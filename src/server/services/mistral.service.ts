import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { config } from '@/config';
import { Message } from '@/types/chat';
import { ApiError } from '@/lib/error';
import { client } from '@/lib/db';

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
  user_id: string; // 添加用户ID字段
}

export class MistralService {
  async getMistralResponse(params: {
    content: string;
    sessionId: string;
    userId: string;
  }) {
    const { content, sessionId, userId } = params;

    // 获取对话历史
    const messages = await client.query<DbMessage[]>(
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

    // Save and continue with the rest of the code...
    // 保存用户消息
    await this.saveMessage(sessionId, userMessage, userId);

    try {
      const response = await mistralClient.chat.complete({
        model: config.mistral.model,
        stream: false,
        messages: [...messages, userMessage] as Message[],
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: (response.choices?.[0].message.content as string) || '',
        timestamp: new Date().toISOString(),
      };

      // 保存助手回复
      await this.saveMessage(sessionId, assistantMessage, userId);

      // 更新对话时间
      await this.updateConversationTime(sessionId);

      return assistantMessage.content;
    } catch (error) {
      console.error('Mistral API Error:', error);
      throw error;
    }
  }

  async getConversationMessages(sessionId: string) {
    const messages = await client.query<DbMessage[]>(
      `
      with conversation := (
        select Conversation { id }
        filter .session_id = <str>$sessionId
      )
      select Message {
        id,
        content,
        role,
        timestamp
      }
      filter .conversation in conversation
      order by .timestamp
    `,
      { sessionId }
    );

    console.log('查询参数:', { sessionId });
    console.log('查询结果:', messages);

    return {
      code: 0,
      data: {
        messages,
        total: messages.length,
      },
    };
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

  async getConversationList(userId: string) {
    try {
      const conversations = await client.query<DbConversation>(
        `
        select Conversation {
          id,
          session_id,
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
      // 先删除关联的消息
      await client.query(
        `
        delete Message
        filter .conversation.session_id = <str>$sessionId
      `,
        { sessionId }
      );

      // 再删除对话
      await client.query(
        `
        delete Conversation
        filter .session_id = <str>$sessionId
      `,
        { sessionId }
      );

      return {
        code: 0,
        message: '删除成功',
      };
    } catch (error) {
      console.error('删除会话错误:', error);
      throw new ApiError('删除会话失败', 500);
    }
  }

  async getLatestConversation(userId: string) {
    try {
      const conversations = await client.query<DbConversation>(
        `
        select Conversation {
          id,
          session_id,
          title,
          updated_at
        }
        filter .user.id = <uuid>$userId
        order by .updated_at desc
        limit 1
        `,
        { userId }
      );

      return {
        code: 0,
        data: conversations[0] || null,
      };
    } catch (error) {
      console.error('获取最近对话错误:', error);
      throw new ApiError('获取最近对话失败', 500);
    }
  }
}

export const mistralService = new MistralService();
