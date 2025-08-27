"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SpeechToTextProps {
  onTextChange?: (text: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SpeechToText({
  onTextChange,
  placeholder = "点击麦克风按钮开始语音输入...",
  className = "",
}: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognition = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // 检查浏览器是否支持 Web Speech API
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      
      if (recognition.current) {
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = "zh-CN";

        recognition.current.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const newText = text + finalTranscript + interimTranscript;
          setText(newText);
          onTextChange?.(newText);
        };

        recognition.current.onerror = (event: any) => {
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
  }, [onTextChange, text, toast]);

  const startListening = () => {
    if (recognition.current && !isListening) {
      try {
        recognition.current.start();
        setIsListening(true);
        toast({
          title: "开始语音输入",
          description: "请开始说话，系统正在监听...",
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
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
      toast({
        title: "停止语音输入",
        description: "语音输入已停止",
      });
    }
  };

  const clearText = () => {
    setText("");
    onTextChange?.("");
    toast({
      title: "文本已清空",
      description: "输入框内容已清除",
    });
  };

  const handleTextChange = (value: string) => {
    setText(value);
    onTextChange?.(value);
  };

  if (!isSupported) {
    return (
      <div className={`p-4 border rounded-lg bg-muted/50 ${className}`}>
        <p className="text-muted-foreground text-center">
          您的浏览器不支持语音识别功能，请使用 Chrome、Edge 或其他支持的浏览器。
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">语音转文本</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={clearText}
            disabled={!text}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            清空
          </Button>
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-1" />
                停止录音
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-1" />
                开始录音
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className={`resize-none ${isListening ? "border-red-300 bg-red-50" : ""}`}
      />
      
      {isListening && (
        <div className="text-sm text-red-600 flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
          正在录音中，请说话...
        </div>
      )}
    </div>
  );
}