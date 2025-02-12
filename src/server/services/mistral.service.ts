import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { config } from '@/config';
import { Message } from '@/types/chat';
import { client } from '@/lib/db';
import { ApiError } from '@/lib/error';

const mistralClient = new Mistral(process.env.MISTRAL_API_KEY as SDKOptions);

interface DbMessage {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}

interface DbConversation {
  id: string;
  title: string;
  messages: DbMessage[];
  updated_at: string;
}

export class MistralService {
  async getMistralResponse(params: {
    content: string;
    sessionId: string;
    userId: string;
  }) {
    const { content, sessionId } = params;

    // 获取对话历史
    const messages: DbMessage[] = await this.getConversationMessages(sessionId);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    // 保存用户消息
    await this.saveMessage(sessionId, userMessage);

    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.model,
        stream: false,
        messages: [...messages, userMessage],
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: (response.choices?.[0].message.content as string) || '',
        timestamp: new Date().toISOString(),
      };

      // 保存助手回复
      await this.saveMessage(sessionId, assistantMessage);

      // 更新对话时间
      await this.updateConversationTime(sessionId);

      return assistantMessage.content;
    } catch (error) {
      console.error('Mistral API Error:', error);
      throw error;
    }
  }

  private async getConversationMessages(sessionId: string) {
    const conversation = await client.query<DbConversation>(
      `
      select Conversation {
        id,
        messages: {
          content,
          role,
          timestamp
        } order by .timestamp
      }
      filter .id = <uuid>$sessionId
      limit 1
    `,
      { sessionId }
    );

    if (!conversation) {
      throw new ApiError('对话不存在', 404);
    }

    return conversation[0].messages;
  }

  private async saveMessage(sessionId: string, message: Message) {
    await client.query(
      `
      insert Message {
        content := <str>$content,
        role := <str>$role,
        timestamp := <datetime>$timestamp,
        conversation := (
          select Conversation 
          filter .id = <uuid>$sessionId
        )
      }
    `,
      {
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
        sessionId,
      }
    );
  }

  private async updateConversationTime(sessionId: string) {
    await client.query(
      `
      update Conversation
      filter .id = <uuid>$sessionId
      set {
        updated_at := datetime_current()
      }
    `,
      { sessionId }
    );
  }

  async getConversationList(userId: string) {
    try {
      const conversations = await client.query<DbConversation[]>(
        `
        select Conversation {
          id,
          title,
          updated_at
        }
        filter .user.id = <uuid>$userId
        order by .updated_at desc
      `,
        { userId }
      );

      return {
        code: 0,
        data: {
          conversations,
          total: conversations.length,
        },
      };
    } catch {
      throw new ApiError('获取会话列表失败', 500);
    }
  }

  async deleteConversation(sessionId: string) {
    try {
      await client.query(
        `
        delete Conversation
        filter .id = <uuid>$sessionId
      `,
        { sessionId }
      );

      return {
        code: 0,
        message: '删除成功',
      };
    } catch {
      throw new ApiError('删除会话失败', 500);
    }
  }
}

export const mistralService = new MistralService();
