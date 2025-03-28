'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Play, Pause, Download } from 'lucide-react';

export default function MusicGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(8);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  
  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      const response = await fetch('/api/music/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration }),
      });

      const data = await response.json();
      if (data.code === 0) {
        setAudioUrl(data.data.url);
        toast({ description: '生成成功' });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: error instanceof Error ? error.message : '生成失败，请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    const audio = document.getElementById('music-player') as HTMLAudioElement;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `generated-music-${Date.now()}.wav`;
    link.click();
  };

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">AI 音乐生成</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">音乐描述</label>
            <Textarea
              placeholder="描述你想要生成的音乐风格、情绪、场景等..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              时长：{duration} 秒
            </label>
            <Slider
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={4}
              max={16}
              step={1}
              className="w-full"
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading || !prompt.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : '生成音乐'}
          </Button>

          {audioUrl && (
            <div className="space-y-4">
              <audio 
                id="music-player"
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}