"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TextToSpeechProps {
  initialText?: string;
  className?: string;
}

export default function TextToSpeech({
  initialText = "",
  className = "",
}: TextToSpeechProps) {
  const [text, setText] = useState(initialText);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // 优先选择中文语音
        const chineseVoice = availableVoices.find(voice => 
          voice.lang.includes("zh") || voice.lang.includes("cn")
        );
        if (chineseVoice) {
          setSelectedVoice(chineseVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "请输入文本",
        description: "需要输入要朗读的文本内容",
        variant: "destructive",
      });
      return;
    }

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      toast({
        title: "开始朗读",
        description: "正在播放语音...",
      });
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "朗读完成",
        description: "语音播放已结束",
      });
    };

    utterance.onerror = (event) => {
      console.error("语音合成错误:", event);
      setIsPlaying(false);
      setIsPaused(false);
      toast({
        title: "语音合成错误",
        description: "播放语音时出现错误",
        variant: "destructive",
      });
    };

    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      toast({
        title: "已暂停",
        description: "语音播放已暂停",
      });
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      toast({
        title: "继续播放",
        description: "语音播放已恢复",
      });
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    toast({
      title: "停止播放",
      description: "语音播放已停止",
    });
  };

  if (!isSupported) {
    return (
      <div className={`p-4 border rounded-lg bg-muted/50 ${className}`}>
        <p className="text-muted-foreground text-center">
          您的浏览器不支持语音合成功能。
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">文本转语音</h3>
        <div className="flex space-x-2">
          {isPlaying && !isPaused && (
            <Button variant="outline" size="sm" onClick={pause}>
              <Pause className="h-4 w-4 mr-1" />
              暂停
            </Button>
          )}
          {isPlaying && isPaused && (
            <Button variant="outline" size="sm" onClick={resume}>
              <Play className="h-4 w-4 mr-1" />
              继续
            </Button>
          )}
          {isPlaying && (
            <Button variant="destructive" size="sm" onClick={stop}>
              <Square className="h-4 w-4 mr-1" />
              停止
            </Button>
          )}
          {!isPlaying && (
            <Button onClick={speak} disabled={!text.trim()}>
              <Volume2 className="h-4 w-4 mr-1" />
              播放
            </Button>
          )}
        </div>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入要转换为语音的文本..."
        rows={6}
        className="resize-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">语音选择</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="选择语音" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">语速</label>
              <span className="text-sm text-muted-foreground">{rate[0]}x</span>
            </div>
            <Slider
              value={rate}
              onValueChange={setRate}
              min={0.1}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">音调</label>
              <span className="text-sm text-muted-foreground">{pitch[0]}</span>
            </div>
            <Slider
              value={pitch}
              onValueChange={setPitch}
              min={0}
              max={2}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">音量</label>
              <span className="text-sm text-muted-foreground">{Math.round(volume[0] * 100)}%</span>
            </div>
            <Slider
              value={volume}
              onValueChange={setVolume}
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="text-sm text-blue-600 flex items-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
          {isPaused ? "播放已暂停" : "正在播放语音..."}
        </div>
      )}
    </div>
  );
}