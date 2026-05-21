import OpenAI from 'openai';
import { Message } from '@/types/chat';
import { ApiError } from '@/lib/error';
import { prisma } from '@/lib/db';

const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

interface DbMessage {
  content: string;
  role: string;
  timestamp: Date;
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

      await this.saveMessage(sessionId, assistantMessage, userId);
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
}

export const openRouterService = new OpenRouterService();
