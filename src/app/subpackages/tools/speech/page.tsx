"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SpeechToText from "@/components/ui/speech-to-text";
import TextToSpeech from "@/components/ui/text-to-speech";
import { Mic, Volume2, ArrowRightLeft } from "lucide-react";

export default function SpeechPage() {
  const [speechText, setSpeechText] = useState("");
  const [ttsText, setTtsText] = useState("");

  const handleSpeechToTextChange = (text: string) => {
    setSpeechText(text);
  };

  const copyToTTS = () => {
    setTtsText(speechText);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">语音处理工具</h1>
        <p className="text-muted-foreground">
          使用浏览器内置的 Web Speech API 实现语音转文本和文本转语音功能
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Mic className="h-3 w-3" />
            语音识别
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            语音合成
          </Badge>
          <Badge variant="outline">Web Speech API</Badge>
          <Badge variant="outline">实时处理</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">功能概览</TabsTrigger>
          <TabsTrigger value="speech-to-text">语音转文本</TabsTrigger>
          <TabsTrigger value="text-to-speech">文本转语音</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-blue-500" />
                  语音转文本
                </CardTitle>
                <CardDescription>
                  使用麦克风实时将语音转换为文本，支持连续识别和多语言
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">主要特性：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 实时语音识别</li>
                    <li>• 支持中文普通话</li>
                    <li>• 连续语音输入</li>
                    <li>• 文本编辑功能</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">使用说明：</h4>
                  <p className="text-sm text-muted-foreground">
                    点击&ldquo;开始录音&rdquo;按钮，允许浏览器访问麦克风后开始说话，系统会实时将语音转换为文本。
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-green-500" />
                  文本转语音
                </CardTitle>
                <CardDescription>
                  将输入的文本转换为语音播放，支持多种语音和参数调节
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">主要特性：</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 多种语音选择</li>
                    <li>• 语速、音调、音量调节</li>
                    <li>• 播放控制（播放/暂停/停止）</li>
                    <li>• 支持长文本朗读</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">使用说明：</h4>
                  <p className="text-sm text-muted-foreground">
                    输入要朗读的文本，选择合适的语音和参数，点击&ldquo;播放&rdquo;按钮即可听到语音。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-purple-500" />
                组合使用
              </CardTitle>
              <CardDescription>
                语音转文本和文本转语音可以组合使用，实现语音到语音的处理流程
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">语音输入</h4>
                  <SpeechToText
                    onTextChange={handleSpeechToTextChange}
                    placeholder="使用语音输入功能转换语音为文本..."
                  />
                  {speechText && (
                    <div className="text-center">
                      <button
                        onClick={copyToTTS}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                        转至语音播放
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">语音播放</h4>
                  <TextToSpeech initialText={ttsText} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speech-to-text">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-500" />
                语音转文本工具
              </CardTitle>
              <CardDescription>
                使用麦克风进行语音输入，实时转换为文本内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SpeechToText onTextChange={setSpeechText} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text-to-speech">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-green-500" />
                文本转语音工具
              </CardTitle>
              <CardDescription>
                输入文本内容，转换为语音播放
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TextToSpeech />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="font-medium mb-2">技术说明</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• 本工具使用浏览器内置的 Web Speech API，无需额外的服务器端支持</p>
          <p>• 语音识别需要浏览器支持且需要用户授权麦克风权限</p>
          <p>• 建议使用 Chrome、Edge 等现代浏览器以获得最佳体验</p>
          <p>• 网络连接可能影响语音识别的准确性和响应速度</p>
        </div>
      </div>
    </div>
  );
}