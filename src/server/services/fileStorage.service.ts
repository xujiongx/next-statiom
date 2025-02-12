import fs from 'fs/promises';
import path from 'path';
import { Message } from '@/types/chat';

const STORAGE_DIR = path.join(process.cwd(), 'data/conversations');

export class FileStorageService {
  constructor() {
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(STORAGE_DIR, { recursive: true });
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }
  }

  async saveConversation(sessionId: string, messages: Message[]) {
    const filePath = path.join(STORAGE_DIR, `${sessionId}.json`);
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));
  }

  async getConversation(sessionId: string): Promise<Message[]> {
    const filePath = path.join(STORAGE_DIR, `${sessionId}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getConversationList() {
    try {
      const files = await fs.readdir(STORAGE_DIR);
      const conversations = await Promise.all(
        files
          .filter((file) => file.endsWith('.json'))
          .map(async (file) => {
            const sessionId = file.replace('.json', '');
            try {
              const data = await fs.readFile(
                path.join(STORAGE_DIR, file),
                'utf8'
              );
              const messages: Message[] = JSON.parse(data);
              const firstMessage = messages.find((msg) => msg.role === 'user');
              const stats = await fs.stat(path.join(STORAGE_DIR, file));

              return {
                id: sessionId,
                title: firstMessage ? firstMessage.content : '新对话',
                created_at: stats.birthtime.toISOString(),
                updated_at: stats.mtime.toISOString(),
              };
            } catch {
              return {
                id: sessionId,
                title: '无法读取对话',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
            }
          })
      );

      return conversations.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } catch {
      return [];
    }
  }

  async deleteConversation(sessionId: string) {
    const filePath = path.join(STORAGE_DIR, `${sessionId}.json`);
    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

export const fileStorage = new FileStorageService();
