export interface ApiResponse<T> {
  code: number;
  message?: string;
  data: T;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}
