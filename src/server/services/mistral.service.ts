import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { fileStorage } from './fileStorage.service';
import { config } from '@/config';
import { Message } from '@/types/chat';

const client = new Mistral(process.env.MISTRAL_API_KEY as SDKOptions);

export class MistralService {
  async getMistralResponse(params: { content: string; sessionId: string }) {
    const { content, sessionId } = params;
    let messages = await fileStorage.getConversation(sessionId);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    messages.push(userMessage);

    try {
      const response = await client.chat.complete({
        model: config.mistral.model,
        stream: false,
        messages,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices
          ? (response.choices[0].message.content as string)
          : '',
        timestamp: new Date().toISOString(),
      };
      messages.push(assistantMessage);

      if (messages.length > config.mistral.maxMessages) {
        messages = messages.slice(-config.mistral.maxMessages);
      }

      await fileStorage.saveConversation(sessionId, messages);
      return assistantMessage.content;
    } catch (error) {
      console.error('Mistral API Error:', error);
      throw error;
    }
  }

  async generateCouplet(content: string) {
    const prompt = `你是一个专业的对联大师。请根据主题"${content}"创作一副优美的对联。要求：
1. 上下联字数相同，平仄工整
2. 上下联要意境优美，意象丰富
3. 横批要与对联主题呼应，简洁有力
4. 整体要富有文学气息和传统韵味
5. 严格按照以下JSON格式返回：{"up":"上联内容","down":"下联内容","horizontal":"横批内容"}
请直接返回JSON数据，不要有任何其他内容。`;

    try {
      const response = await client.chat.complete({
        model: config.mistral.model,
        stream: false,
        messages: [
          {
            role: 'system',
            content:
              '你是一位精通对联创作的文学大师，擅长创作优美、工整、意境深远的对联。',
          },
          { role: 'user', content: prompt },
        ],
      });

      const cleanContent = (
        response.choices ? (response.choices[0].message.content as string) : ''
      )
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .trim();

      return JSON.parse(cleanContent);
    } catch (error) {
      throw new Error('生成对联失败：' + (error as Error).message);
    }
  }

  async translate(params: { content: string; from?: string; to?: string }) {
    const { content, from = 'auto', to = 'zh' } = params;
    const prompt = `请将以下文本从${from}翻译成${to}，直接返回翻译结果，不要有任何解释或额外内容：\n\n${content}`;

    try {
      const response = await client.chat.complete({
        model: config.mistral.model,
        stream: false,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的翻译器，只返回翻译结果，不做任何解释。',
          },
          { role: 'user', content: prompt },
        ],
      });

      return {
        result: (response.choices
          ? (response.choices[0].message.content as string)
          : ''
        ).trim(),
        from,
        to,
      };
    } catch (error) {
      throw new Error('翻译失败：' + (error as Error).message);
    }
  }

  async getLatestConversation() {
    const conversations = await fileStorage.getConversationList();
    if (conversations && conversations.length > 0) {
      const sortedConversations = conversations.sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );
      return sortedConversations[0].id;
    }
    return null;
  }

  async getConversationList() {
    try {
      const conversations = await fileStorage.getConversationList();
      return {
        code: 0,
        data: {
          conversations,
          total: conversations.length,
        },
      };
    } catch (error) {
      throw new Error('获取会话列表失败：' + (error as Error).message);
    }
  }

  async getConversationHistory(sessionId: string) {
    try {
      const history = await fileStorage.getConversation(sessionId);
      return {
        code: 0,
        data: { messages: history },
      };
    } catch (error) {
      throw new Error('获取会话历史失败：' + (error as Error).message);
    }
  }

  async deleteConversation(sessionId: string) {
    try {
      await fileStorage.deleteConversation(sessionId);
      return {
        code: 0,
        message: '删除成功',
      };
    } catch (error) {
      throw new Error('删除会话失败：' + (error as Error).message);
    }
  }
}

export const mistralService = new MistralService();
