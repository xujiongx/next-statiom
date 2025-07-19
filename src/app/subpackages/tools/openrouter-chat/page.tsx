'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { openRouterApi } from '@/api/openrouter';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 预定义的模型列表
const models = [
  { id: 'qwen/qwq-32b:free', name: 'Qwen 32B' },
  { id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B' },
];

export default function OpenRouterChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // 生成会话ID
    setSessionId(uuidv4());
  }, []);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 使用API客户端发送请求
      const response = await openRouterApi.sendMessage({
        content: input,
        sessionId,
        model: selectedModel,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.data },
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: '发送消息失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 处理模型变更
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    // 如果已经有对话，提示用户模型已更改
    if (messages.length > 0) {
      toast({
        title: '模型已更改',
        description: `当前对话已切换到${models.find(m => m.id === value)?.name}`,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Link
          href="/subpackages/tools"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回工具列表
        </Link>
        <h1 className="text-2xl font-bold">OpenRouter 聊天</h1>
        <p className="text-sm text-muted-foreground mt-1">
          使用 OpenRouter API 进行对话，体验多种AI模型
        </p>
      </div>

      {/* 模型选择器 */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">选择模型:</span>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择模型" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto mb-4 p-4 border rounded-lg">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>发送消息开始对话</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <Card
                key={index}
                className={`p-4 mb-4 ${
                  message.role === "user" ? "bg-primary/10" : "bg-muted/50"
                }`}
              >
                <div className="font-semibold mb-1">
                  {message.role === "user" ? "你" : "AI 助手"}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "发送中..." : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
