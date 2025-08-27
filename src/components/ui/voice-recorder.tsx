"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// 类型定义
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface VoiceRecorderProps {
  onTextChange?: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function VoiceRecorder({
  onTextChange,
  disabled = false,
  className = "",
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognition = useRef<SpeechRecognitionInstance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // 检查浏览器是否支持 Web Speech API
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setIsSupported(true);
      const SpeechRecognition = (window as unknown as {
        SpeechRecognition: new() => SpeechRecognitionInstance;
        webkitSpeechRecognition: new() => SpeechRecognitionInstance;
      }).SpeechRecognition || (window as unknown as {
        SpeechRecognition: new() => SpeechRecognitionInstance;
        webkitSpeechRecognition: new() => SpeechRecognitionInstance;
      }).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      if (recognition.current) {
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = "zh-CN";

        recognition.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            }
          }

          if (finalTranscript) {
            onTextChange?.(finalTranscript);
          }
        };

        recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("语音识别错误:", event.error);
          setIsListening(false);
          toast({
            title: "语音识别错误",
            description: `错误类型: ${event.error}`,
            variant: "destructive",
          });
        };

        recognition.current.onend = () => {
          setIsListening(false);
        };
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [onTextChange, toast]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "不支持语音识别",
        description: "您的浏览器不支持语音识别功能",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      // 停止录音
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
      toast({
        title: "停止语音输入",
        description: "语音录音已停止",
      });
    } else {
      // 开始录音
      if (recognition.current) {
        try {
          recognition.current.start();
          setIsListening(true);
          toast({
            title: "开始语音输入",
            description: "请开始说话，完成后再次点击按钮停止",
          });
        } catch (error) {
          console.error("启动语音识别失败:", error);
          toast({
            title: "启动语音识别失败",
            description: "请检查麦克风权限",
            variant: "destructive",
          });
        }
      }
    }
  };

  if (!isSupported) {
    return null; // 如果不支持就不显示按钮
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={toggleListening}
      disabled={disabled}
      className={`${className} ${isListening ? "animate-pulse" : ""}`}
      title={isListening ? "停止录音" : "开始语音输入"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}