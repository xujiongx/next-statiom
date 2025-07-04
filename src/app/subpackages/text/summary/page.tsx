'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, FileText, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { qaApi } from '@/api/translate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const summaryTypes = [
  { value: 'brief', label: '简要摘要' },
  { value: 'detailed', label: '详细摘要' },
  { value: 'keypoints', label: '要点提取' },
  { value: 'abstract', label: '学术摘要' },
];

const summaryLengths = [
  { value: 'short', label: '简短 (50-100字)' },
  { value: 'medium', label: '中等 (100-200字)' },
  { value: 'long', label: '详细 (200-300字)' },
];

export default function SummaryPage() {
  const [sourceText, setSourceText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryType, setSummaryType] = useState('brief');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 构建摘要提示词
  const buildSummaryPrompt = (text: string, type: string, length: string): string => {
    const typeDescriptions = {
      brief: '简要摘要，突出核心内容和主要观点',
      detailed: '详细摘要，包含重要细节和论证过程',
      keypoints: '要点提取，以条目形式列出关键信息',
      abstract: '学术摘要，包含背景、方法、结果和结论'
    };

    const lengthDescriptions = {
      short: '50-100字的简短摘要',
      medium: '100-200字的中等长度摘要',
      long: '200-300字的详细摘要'
    };

    let formatInstruction = '';
    if (type === 'keypoints') {
      formatInstruction = '\n\n请以要点形式输出，每个要点单独一行，使用"• "开头。';
    } else {
      formatInstruction = '\n\n请以段落形式输出摘要。';
    }

    return `请对以下文本进行${typeDescriptions[type as keyof typeof typeDescriptions]}，要求生成${lengthDescriptions[length as keyof typeof lengthDescriptions]}。${formatInstruction}

原文内容：
${text}

要求：
1. 准确概括原文主要内容
2. 保持逻辑清晰，语言简洁
3. 字数控制在指定范围内
4. 不添加原文中没有的信息

请直接输出摘要内容：`;
  };

  // 使用Q&A接口生成摘要
  const generateSummary = async () => {
    if (!sourceText.trim() || loading) return;

    try {
      setLoading(true);
      
      const prompt = buildSummaryPrompt(sourceText, summaryType, summaryLength);
      const response = await qaApi.ask({ prompt });
      
      if (!response.code && response.data) {
        setSummaryResult(response.data.response.trim());
        toast({
          description: '摘要生成成功！',
        });
      } else {
        throw new Error('API调用失败');
      }
    } catch (error) {
      console.error('摘要生成失败:', error);
      toast({
        variant: 'destructive',
        description: '生成失败，请重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        description: '内容已复制到剪贴板',
      });
    } catch {
      toast({
        variant: 'destructive',
        description: '复制失败',
      });
    }
  };

  const handleClear = () => {
    setSourceText('');
    setSummaryResult('');
  };

  return (
    <main className='container max-w-6xl p-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold mb-1'>智能文本摘要</h1>
        <p className='text-sm text-muted-foreground'>快速生成文本摘要和要点提取</p>
      </div>

      <div className='grid gap-6'>
        {/* 设置区域 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>摘要类型</label>
            <Select value={summaryType} onValueChange={setSummaryType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {summaryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium mb-2 block'>摘要长度</label>
            <Select value={summaryLength} onValueChange={setSummaryLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {summaryLengths.map((length) => (
                  <SelectItem key={length.value} value={length.value}>
                    {length.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 输入输出区域 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 原文输入 */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>原文内容</label>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleClear}
                  disabled={loading}
                >
                  清空
                </Button>
              </div>
            </div>
            <Textarea
              placeholder='请输入需要生成摘要的文本内容...'
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={12}
              className='resize-none'
            />
            <div className='flex justify-between items-center text-xs text-muted-foreground'>
              <span>字数: {sourceText.length}</span>
            </div>
          </div>

          {/* 摘要输出 */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>生成摘要</label>
              {summaryResult && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleCopy(summaryResult)}
                  className='flex items-center gap-1'
                >
                  <Copy className='h-4 w-4' />
                  复制
                </Button>
              )}
            </div>
            <Card className='h-[300px]'>
              <CardContent className='p-4 h-full'>
                {summaryResult ? (
                  <div className='h-full overflow-y-auto'>
                    <div className='text-sm leading-relaxed whitespace-pre-wrap'>
                      {summaryResult}
                    </div>
                  </div>
                ) : (
                  <div className='h-full flex items-center justify-center text-muted-foreground'>
                    <div className='text-center'>
                      <FileText className='h-12 w-12 mx-auto mb-2 opacity-50' />
                      <p className='text-sm'>摘要将在这里显示</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {summaryResult && (
              <div className='text-xs text-muted-foreground'>
                摘要字数: {summaryResult.length}
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className='flex justify-center'>
          <Button
            onClick={generateSummary}
            disabled={loading || !sourceText.trim()}
            size='lg'
            className='flex items-center gap-2'
          >
            <Sparkles className='h-4 w-4' />
            {loading ? '生成中...' : '生成摘要'}
          </Button>
        </div>
      </div>
    </main>
  );
}