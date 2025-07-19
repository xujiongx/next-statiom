'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Volume2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { translateApi } from '@/api/translate';
import { ArrowLeftRight } from 'lucide-react';

const languages = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'fr', label: '法语' },
  { value: 'de', label: '德语' },
];

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!sourceText.trim() || loading) return;

    try {
      setLoading(true);
      // TODO: 调用翻译 API
      const response = await translateApi.translate({
        text: sourceText,
        from: sourceLang,
        to: targetLang,
      });
      setTargetText(response.data.result);
    } catch (error) {
      console.error('翻译失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: '已复制到剪贴板',
      });
    } catch {
      toast({
        variant: 'destructive',
        description: '复制失败',
      });
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleSwitchLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(targetText);
    setTargetText(sourceText);
  };

  return (
    <main className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">智能翻译</h1>
        <p className="text-sm text-muted-foreground">支持多语言互译</p>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <Select value={sourceLang} onValueChange={setSourceLang}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwitchLanguages}
            className="shrink-0"
            title="切换语言"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="请输入要翻译的文本"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          rows={6}
        />

        <Button
          onClick={handleTranslate}
          disabled={loading || !sourceText.trim()}
        >
          {loading ? "翻译中..." : "翻译"}
        </Button>

        <div className="relative">
          <div>
            <Textarea
              placeholder="翻译结果"
              value={targetText}
              readOnly
              rows={6}
            />
            {targetText && (
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(targetText)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  复制
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSpeak(targetText, targetLang)}
                  className="flex items-center gap-2"
                >
                  <Volume2 className="h-4 w-4" />
                  朗读
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
