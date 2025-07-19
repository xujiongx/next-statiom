'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';

export default function AvatarGeneratorPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('lorelei');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000));

  // 使用Dicebear提供的免费头像风格
  const avatarStyles = [
    { value: 'lorelei', label: '写实风格' },
    { value: 'avataaars', label: '卡通风格' },
    { value: 'pixel-art', label: '像素风格' },
    { value: 'bottts', label: '机器人风格' },
    { value: 'micah', label: '简约风格' },
    { value: 'adventurer', label: '冒险家风格' },
    { value: 'big-smile', label: '大笑脸风格' },
  ];

  const generateAvatar = async () => {
    setLoading(true);
    
    try {
      // 使用Dicebear API生成头像
      // 注意：Dicebear不使用prompt，而是使用seed来生成不同的头像
      const dicebearUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${prompt || seed}`;
      
      setAvatarUrl(dicebearUrl);
      
      toast({
        title: '头像生成成功',
        description: '您的AI头像已生成',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: '生成失败',
        description: '头像生成过程中出现错误，请稍后再试',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadAvatar = () => {
    if (!avatarUrl) return;
    
    // 对于SVG格式，我们需要先获取SVG内容，然后转换为Blob
    fetch(avatarUrl)
      .then(response => response.text())
      .then(svgText => {
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-avatar-${new Date().getTime()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        toast({
          variant: 'destructive',
          title: '下载失败',
          description: '头像下载过程中出现错误',
        });
      });
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold mb-6">AI 头像生成</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">输入一个关键词作为种子</Label>
            <Input
              id="prompt"
              placeholder="例如：programmer, artist, gamer"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              不同的关键词会生成不同的头像
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">选择风格</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger id="style">
                <SelectValue placeholder="选择头像风格" />
              </SelectTrigger>
              <SelectContent>
                {avatarStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>随机种子 ({seed})</Label>
            <Slider
              value={[seed]}
              min={0}
              max={1000}
              step={1}
              onValueChange={(value) => setSeed(value[0])}
            />
            <p className="text-xs text-gray-500">
              如果不输入关键词，将使用此随机种子
            </p>
          </div>

          <Button
            onClick={generateAvatar}
            disabled={loading}
            className="w-full"
          >
            {loading ? "生成中..." : "生成头像"}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-50">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="生成的头像"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">头像预览</span>
            )}
          </div>

          {avatarUrl && (
            <Button variant="outline" onClick={downloadAvatar}>
              下载头像
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}