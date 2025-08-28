"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Play, Pause, Square, Volume2, Download } from 'lucide-react';

interface TTSParams {
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

interface AudioState {
  isPlaying: boolean;
  isPaused: boolean;
  duration: number;
  currentTime: number;
}

export default function AlibabaTTSPage() {
  const [text, setText] = useState('那我来给大家推荐一款T恤，这款呢真的是超级好看，这个颜色呢很显气质，而且呢也是搭配的绝佳单品，大家可以闭眼入，真的是非常好看，对身材的包容性也很好，不管啥身材的宝宝呢，穿上去都是很好看的。推荐宝宝们下单哦。');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isPaused: false,
    duration: 0,
    currentTime: 0,
  });
  
  const [ttsParams, setTtsParams] = useState<TTSParams>({
    voice: 'Chelsie',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // 可用的语音选项（qwen-tts模型支持的语音角色）
  const voiceOptions = [
    { value: 'Chelsie', label: 'Chelsie (甘美女声)' },
    { value: 'Anna', label: 'Anna (温柔女声)' },
    { value: 'Bella', label: 'Bella (甘甜女声)' },
    { value: 'Carrie', label: 'Carrie (清新女声)' },
    { value: 'Dora', label: 'Dora (温和女声)' },
    { value: 'Eva', label: 'Eva (优雅女声)' },
    { value: 'Fiona', label: 'Fiona (知性女声)' },
    { value: 'Grace', label: 'Grace (端庄女声)' },
    { value: 'Helen', label: 'Helen (成熟女声)' },
    { value: 'Iris', label: 'Iris (清亮女声)' },
    { value: 'Jenny', label: 'Jenny (活泼女声)' },
    { value: 'Kate', label: 'Kate (职场女声)' },
    { value: 'Luna', label: 'Luna (神秘女声)' },
    { value: 'Mia', label: 'Mia (可爱女声)' },
    { value: 'Nina', label: 'Nina (清朗女声)' },
    { value: 'Olivia', label: 'Olivia (成熟女声)' },
    { value: 'Paula', label: 'Paula (理性女声)' },
    { value: 'Quinn', label: 'Quinn (中性女声)' },
    { value: 'Ruby', label: 'Ruby (热情女声)' },
    { value: 'Sara', label: 'Sara (温暖女声)' },
    { value: 'Tina', label: 'Tina (青春女声)' },
    { value: 'Uma', label: 'Uma (高贵女声)' },
    { value: 'Vera', label: 'Vera (冷静女声)' },
    { value: 'Wendy', label: 'Wendy (友善女声)' },
    { value: 'Xenia', label: 'Xenia (异域女声)' },
    { value: 'Yuna', label: 'Yuna (梦幻女声)' },
    { value: 'Zara', label: 'Zara (时尚女声)' },
  ];

  // 调用阿里百炼TTS API
  const generateSpeech = async () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入要转换的文本"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/alibaba/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          voice: ttsParams.voice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '语音合成失败');
      }

      // 检查是否为模拟模式
      const isMockMode = response.headers.get('X-Mock-Mode') === 'true';
      
      // 获取音频数据
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // 清理之前的音频对象
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // 创建新的音频对象
      const audio = new Audio(url);
      audioRef.current = audio;

      // 设置音频事件监听器
      audio.addEventListener('loadedmetadata', () => {
        setAudioState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      });

      audio.addEventListener('timeupdate', () => {
        setAudioState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
        }));
      });

      audio.addEventListener('ended', () => {
        setAudioState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentTime: 0,
        }));
      });

      toast({
        title: "成功",
        description: isMockMode ? 
          "模拟模式：音频文件生成完成（静音）" : 
          "语音合成完成，可以播放了！"
      });

    } catch (error) {
      console.error('TTS Error:', error);
      
      // 尝试解析错误信息
      let errorMessage = '语音合成过程中发生错误';
      let errorDetails = '';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // 特殊处理模型访问拒绝错误
      if (errorMessage.includes('模型访问被拒绝')) {
        errorDetails = '建议设置 ALIBABA_TTS_MOCK_MODE=true 使用模拟模式进行测试';
      }
      
      toast({
        variant: "destructive",
        title: "合成失败",
        description: errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // 播放音频
  const playAudio = () => {
    if (!audioRef.current) return;

    if (audioState.isPaused) {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    } else {
      audioRef.current.play();
      setAudioState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  // 暂停音频
  const pauseAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setAudioState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
  };

  // 停止音频
  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
    }));
  };

  // 下载音频文件
  const downloadAudio = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `阿里百炼TTS_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "下载开始",
      description: "音频文件开始下载"
    });
  };

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">阿里百炼 TTS 调试</h1>
          <p className="text-gray-600">使用阿里百炼API进行文本转语音功能测试</p>
        </div>

        {/* 文本输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              文本输入
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="请输入要转换为语音的文本..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>字符数: {text.length}</span>
              <span>建议文本长度不超过500字符</span>
            </div>
          </CardContent>
        </Card>

        {/* 语音参数设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              语音参数设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 语音选择 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">语音角色</label>
              <Select
                value={ttsParams.voice}
                onValueChange={(value) => setTtsParams(prev => ({ ...prev, voice: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择语音角色" />
                </SelectTrigger>
                <SelectContent>
                  {voiceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 合成控制 */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={generateSpeech}
              disabled={loading || !text.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? '正在合成语音...' : '生成语音'}
            </Button>
          </CardContent>
        </Card>

        {/* 音频播放控制 */}
        {audioUrl && (
          <Card>
            <CardHeader>
              <CardTitle>音频播放控制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 播放控制按钮 */}
              <div className="flex items-center gap-3">
                {!audioState.isPlaying ? (
                  <Button onClick={playAudio} size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    播放
                  </Button>
                ) : (
                  <Button onClick={pauseAudio} size="sm" variant="secondary">
                    <Pause className="h-4 w-4 mr-2" />
                    暂停
                  </Button>
                )}
                
                <Button onClick={stopAudio} size="sm" variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  停止
                </Button>

                <Button onClick={downloadAudio} size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </div>

              {/* 播放进度 */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                    style={{
                      width: audioState.duration > 0 
                        ? `${(audioState.currentTime / audioState.duration) * 100}%` 
                        : '0%'
                    }}
                  />
                </div>
              </div>

              {/* 播放状态指示 */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${
                  audioState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span>
                  {audioState.isPlaying ? '正在播放' : 
                   audioState.isPaused ? '已暂停' : '准备播放'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使用说明 */}
        <Card>
          <CardHeader>
            <CardTitle>使用说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• 输入要转换的文本，支持中文和英文</p>
              <p>• 选择合适的语音角色</p>
              <p>• 点击&ldquo;生成语音&rdquo;开始合成</p>
              <p>• 合成完成后可以播放、暂停、停止和下载音频</p>
              <p>• 使用新的 qwen-tts 模型，支持多种英文语音角色</p>
            </div>
          </CardContent>
        </Card>

        {/* API配置说明 */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">🔧 API配置说明</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-700 space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-medium text-amber-800 mb-2">🚩 快速测试模式</p>
                <p className="text-amber-700 text-xs mb-2">
                  如果您还没有配置阿里百炼API，可以先使用模拟模式测试界面功能：
                </p>
                <ol className="list-decimal list-inside space-y-1 ml-2 text-xs text-amber-700">
                  <li>在项目根目录创建 .env.local 文件</li>
                  <li>添加：ALIBABA_TTS_MOCK_MODE=true</li>
                  <li>重启开发服务器即可测试</li>
                </ol>
              </div>
              
              <div>
                <p className="font-medium mb-1">如果遇到 403 错误（访问被拒绝），请检查：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>阿里百炼API密钥是否正确配置</li>
                  <li>TTS模型是否已在控制台开通</li>
                  <li>账户余额是否充足</li>
                  <li>API密钥是否有TTS服务权限</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-1">正式配置步骤：</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>访问 <a href="https://dashscope.console.aliyun.com/" target="_blank" className="text-blue-600 underline">阿里百炼控制台</a></li>
                  <li>在“模型广场”中开通 TTS 模型</li>
                  <li>在“API-KEY管理”中创建 API 密钥</li>
                  <li>在项目根目录创建 .env.local 文件</li>
                  <li>添加：ALIBABA_API_KEY=您的API密钥</li>
                  <li>移除或设置ALIBABA_TTS_MOCK_MODE=false</li>
                </ol>
              </div>
              <div className="text-xs text-blue-600">
                ⚠️ 注意：使用 TTS 服务会按字符数收费，请确保账户余额充足。
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}