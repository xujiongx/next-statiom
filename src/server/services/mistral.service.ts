import { config } from '@/config';
import { Message } from '@/types/chat';
import { ApiError } from '@/lib/error';
import { prisma } from '@/lib/db';
import { mistralClient } from '@/lib/mistral';

interface DbMessage {
  id: string;
  content: string;
  role: string;
  timestamp: string;
}

interface DbConversation {
  id: string;
  title: string;
  session_id: string;
  updated_at: string;
}

export class MistralService {
  async getMistralResponse(params: {
    content: string;
    sessionId: string;
    userId: string;
  }) {
    const { content, sessionId, userId } = params;

    const messages = await prisma.message.findMany({
      where: {
        conversation: {
          sessionId,
          userId,
        },
      },
      orderBy: { timestamp: 'asc' },
      select: {
        content: true,
        role: true,
        timestamp: true,
      },
    });

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

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

      await this.saveMessage(sessionId, assistantMessage, userId);
      await this.updateConversationTime(sessionId);

      return assistantMessage.content;
    } catch (error) {
      console.error('Mistral API Error:', error);
      throw error;
    }
  }

  async getConversationMessages(sessionId: string) {
    const messages = await prisma.message.findMany({
      where: {
        conversation: { sessionId },
      },
      orderBy: { timestamp: 'asc' },
      select: {
        id: true,
        content: true,
        role: true,
        timestamp: true,
      },
    });

    return {
      code: 0,
      data: {
        messages: messages.map((message) => ({
          ...message,
          timestamp: message.timestamp.toISOString(),
        })),
        total: messages.length,
      },
    };
  }

  private async saveMessage(
    sessionId: string,
    message: Message,
    userId: string,
  ) {
    const conversation = await prisma.conversation.upsert({
      where: { sessionId },
      create: {
        title: message.content.slice(0, 50),
        sessionId,
        userId,
      },
      update: {},
    });

    const result = await prisma.message.create({
      data: {
        content: message.content,
        role: message.role,
        timestamp: new Date(message.timestamp),
        conversationId: conversation.id,
      },
      select: {
        id: true,
        content: true,
        role: true,
        timestamp: true,
        conversation: {
          select: {
            id: true,
            sessionId: true,
          },
        },
      },
    });

    console.log('保存消息结果:', result);

    if (!result) {
      throw new ApiError('消息保存失败', 500);
    }
  }

  private async updateConversationTime(sessionId: string) {
    await prisma.conversation.update({
      where: { sessionId },
      data: { updatedAt: new Date() },
    });
  }

  async getConversationList(userId: string) {
    try {
      const conversations = await prisma.conversation.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          sessionId: true,
          title: true,
          updatedAt: true,
        },
      });

      return {
        code: 0,
        data: {
          conversations: conversations.map((conversation) => ({
            id: conversation.id,
            session_id: conversation.sessionId,
            title: conversation.title,
            updated_at: conversation.updatedAt.toISOString(),
          })) as DbConversation[],
          total: conversations.length,
        },
      };
    } catch {
      throw new ApiError('获取会话列表失败', 500);
    }
  }

  async deleteConversation(sessionId: string) {
    try {
      await prisma.conversation.delete({
        where: { sessionId },
      });

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
      const conversation = await prisma.conversation.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          sessionId: true,
          title: true,
          updatedAt: true,
        },
      });

      return {
        code: 0,
        data: conversation
          ? {
              id: conversation.id,
              session_id: conversation.sessionId,
              title: conversation.title,
              updated_at: conversation.updatedAt.toISOString(),
            }
          : null,
      };
    } catch (error) {
      console.error('获取最近对话错误:', error);
      throw new ApiError('获取最近对话失败', 500);
    }
  }
}

export const mistralService = new MistralService();
