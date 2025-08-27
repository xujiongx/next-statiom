'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
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
import VoiceRecorder from '@/components/ui/voice-recorder';

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
  const [autoPlay, setAutoPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPlayingText, setCurrentPlayingText] = useState('');
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // 使用API客户端发送请求
      const response = await openRouterApi.sendMessage({
        content: currentInput,
        sessionId,
        model: selectedModel,
      });

      const assistantMessage = { role: 'assistant' as const, content: response.data };
      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);

      // 如果开启了自动播放，播放AI回复
      if (autoPlay) {
        playTextToSpeech(response.data);
      }
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

  // 处理语音输入文本变化
  const handleVoiceInput = (text: string) => {
    setInput(prev => prev + text);
  };

  // 播放文本转语音
  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // 停止当前播放
      stopSpeech();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      currentUtteranceRef.current = utterance;
      setCurrentPlayingText(text);
      setIsManuallyStopped(false); // 重置手动停止标志
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        toast({
          title: "开始播放",
          description: "正在播放语音内容...",
        });
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPlayingText('');
        currentUtteranceRef.current = null;
        if (!isManuallyStopped) {
          toast({
            title: "播放完成",
            description: "语音播放结束",
          });
        }
      };
      
      utterance.onerror = (event) => {
        console.error('语音合成错误:', event);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentPlayingText('');
        currentUtteranceRef.current = null;
        // 只有在非手动停止的情况下才显示错误提示
        if (!isManuallyStopped) {
          toast({
            title: "播放失败",
            description: "语音播放出现错误",
            variant: "destructive",
          });
        }
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "不支持语音播放",
        description: "您的浏览器不支持语音合成功能",
        variant: "destructive",
      });
    }
  };

  // 暂停语音播放
  const pauseSpeech = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      toast({
        title: "播放已暂停",
        description: "语音播放已暂停",
      });
    }
  };

  // 继续语音播放
  const resumeSpeech = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      toast({
        title: "继续播放",
        description: "语音播放已恢复",
      });
    }
  };

  // 停止语音播放
  const stopSpeech = () => {
    if (speechSynthesis.speaking) {
      setIsManuallyStopped(true); // 设置手动停止标志
      speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPlayingText('');
      currentUtteranceRef.current = null;
      toast({
        title: "播放已停止",
        description: "语音播放已停止",
      });
    }
  };

  // 播放指定消息
  const playMessage = (content: string) => {
    playTextToSpeech(content);
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

      {/* 控制面板 */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* 语音播放控制 */}
          <div className="flex items-center gap-2">
            <Button
              variant={autoPlay ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoPlay(!autoPlay)}
            >
              {autoPlay ? <Volume2 className="h-4 w-4 mr-1" /> : <VolumeX className="h-4 w-4 mr-1" />}
              自动播放
            </Button>
            
            {/* 播放控制按钮 */}
            {isPlaying && (
              <>
                {!isPaused ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={pauseSpeech}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    暂停
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resumeSpeech}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    继续
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={stopSpeech}
                >
                  <Square className="h-4 w-4 mr-1" />
                  停止
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* 当前播放状态显示 */}
        {isPlaying && currentPlayingText && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-blue-500 animate-pulse'}`} />
              <span className="font-medium">{isPaused ? '播放已暂停' : '正在播放'}:</span>
            </div>
            <div className="text-sm text-blue-600 mt-1 line-clamp-2">
              {currentPlayingText.slice(0, 100)}{currentPlayingText.length > 100 ? '...' : ''}
            </div>
          </div>
        )}
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
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">
                    {message.role === "user" ? "你" : "AI 助手"}
                  </div>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playMessage(message.content)}
                        className="h-6 w-6 p-0"
                        disabled={isPlaying && currentPlayingText === message.content}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                      {isPlaying && currentPlayingText === message.content && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </Card>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
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
            <div className="flex flex-col gap-2">
              <VoiceRecorder
                onTextChange={handleVoiceInput}
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "发送中..." : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
