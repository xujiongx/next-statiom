import OpenAI from 'openai';
import { Message } from '@/types/chat';
import { ApiError } from '@/lib/error';
import { client } from '@/lib/db';

// 创建 OpenRouter 客户端
const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

interface DbMessage {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}

export class OpenRouterService {
  async getOpenRouterResponse(params: {
    content: string;
    sessionId: string;
    userId: string;
    model?: string;
  }) {
    const {
      content,
      sessionId,
      userId,
      model = 'deepseek/deepseek-chat:free',
    } = params;

    // 获取对话历史
    const messages = await client.query<DbMessage>(
      `
      select Message {
        content,
        role,
        timestamp
      }
      filter .conversation.session_id = <str>$sessionId
        and .conversation.user.id = <uuid>$userId
      order by .timestamp
    `,
      { sessionId, userId }
    );

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // 保存用户消息
    await this.saveMessage(sessionId, userMessage, userId);

    try {
      const response = await openRouterClient.chat.completions.create({
        model,
        messages: [
          ...messages.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          })),
          {
            role: 'user',
            content,
          },
        ],
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.choices[0]?.message?.content || '',
        timestamp: new Date().toISOString(),
      };

      // 保存助手回复
      await this.saveMessage(sessionId, assistantMessage, userId);

      // 更新对话时间
      await this.updateConversationTime(sessionId);

      return assistantMessage.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  private async saveMessage(
    sessionId: string,
    message: Message,
    userId: string
  ) {
    const result = await client.query(
      `
      with
        conversation := (
          select Conversation 
          filter .session_id = <str>$sessionId
        ),
        new_conversation := (
          insert Conversation {
            title := <str>$content,
            session_id := <str>$sessionId,
            user := (
              select User 
              filter .id = <uuid>$userId
            )
          }
          unless conflict on .session_id
        )
      select (
        insert Message {
          content := <str>$content,
          role := <str>$role,
          timestamp := <datetime>$timestamp,
          conversation := assert_exists(conversation ?? new_conversation)
        }
      ) {
        id,
        content,
        role,
        timestamp,
        conversation: {
          id,
          session_id
        }
      }
    `,
      {
        content: message.content,
        role: message.role,
        timestamp: new Date(message.timestamp),
        sessionId,
        userId,
      }
    );

    console.log('保存消息结果:', result);

    if (!result) {
      throw new ApiError('消息保存失败', 500);
    }
  }

  private async updateConversationTime(sessionId: string) {
    await client.query(
      `
      update Conversation
      filter .session_id = <str>$sessionId
      set {
        updated_at := datetime_current()
      }
    `,
      { sessionId }
    );
  }
}

export const openRouterService = new OpenRouterService();
