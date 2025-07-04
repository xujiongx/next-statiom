'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Sparkles, Edit3 } from 'lucide-react';
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

const rewriteStyles = [
  { value: 'formal', label: '正式文体' },
  { value: 'casual', label: '轻松随意' },
  { value: 'academic', label: '学术风格' },
  { value: 'creative', label: '创意表达' },
  { value: 'concise', label: '简洁明了' },
  { value: 'detailed', label: '详细描述' },
];

const rewritePurposes = [
  { value: 'improve', label: '语言优化' },
  { value: 'simplify', label: '简化表达' },
  { value: 'expand', label: '内容扩展' },
  { value: 'tone', label: '语调调整' },
  { value: 'clarity', label: '清晰表达' },
  { value: 'engagement', label: '增强吸引力' },
];

export default function RewritePage() {
  const [sourceText, setSourceText] = useState('');
  const [rewriteResults, setRewriteResults] = useState<string[]>([]);
  const [rewriteStyle, setRewriteStyle] = useState('formal');
  const [rewritePurpose, setRewritePurpose] = useState('improve');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 构建改写提示词
  const buildRewritePrompt = (text: string, style: string, purpose: string): string => {
    const styleDescriptions = {
      formal: '正式文体，用词规范严谨，语法标准',
      casual: '轻松随意的风格，用词亲切自然，语言生动',
      academic: '学术风格，逻辑严密，用词专业准确',
      creative: '创意表达，用词新颖独特，富有想象力',
      concise: '简洁明了，去除冗余，突出重点',
      detailed: '详细描述，丰富内容，增加具体细节'
    };

    const purposeDescriptions = {
      improve: '优化语言表达，提升文本质量和可读性',
      simplify: '简化复杂表达，使内容更易理解',
      expand: '扩展内容，增加相关信息和细节',
      tone: '调整语调风格，使其更符合目标受众',
      clarity: '提高表达清晰度，消除歧义',
      engagement: '增强文本吸引力，提升读者参与度'
    };

    return `请对以下文本进行改写，要求采用${styleDescriptions[style as keyof typeof styleDescriptions]}，目的是${purposeDescriptions[purpose as keyof typeof purposeDescriptions]}。

原文：
${text}

改写要求：
1. 保持原文的核心意思和主要信息
2. 采用${rewriteStyles.find(s => s.value === style)?.label}的表达方式
3. 重点关注${rewritePurposes.find(p => p.value === purpose)?.label}
4. 生成3个不同的改写版本
5. 每个版本单独一段，用"版本1："、"版本2："、"版本3："开头

请直接输出改写结果：`;
  };

  // 使用Q&A接口生成改写
  const generateRewrite = async () => {
    if (!sourceText.trim() || loading) return;

    try {
      setLoading(true);
      
      const prompt = buildRewritePrompt(sourceText, rewriteStyle, rewritePurpose);
      const response = await qaApi.ask({ prompt });
      
      if (!response.code && response.data) {
        // 解析AI返回的改写结果，按版本分割
        const results = response.data.response
          .split(/版本[123]：/)
          .filter(result => result.trim().length > 0)
          .map(result => result.trim())
          .slice(0, 3); // 确保最多3个版本
        
        setRewriteResults(results.length > 0 ? results : ['改写失败，请重试']);
        toast({
          description: '文本改写成功！',
        });
      } else {
        throw new Error('API调用失败');
      }
    } catch (error) {
      console.error('改写失败:', error);
      toast({
        variant: 'destructive',
        description: '改写失败，请重试',
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
    setRewriteResults([]);
  };

  const handleRegenerate = () => {
    if (sourceText.trim()) {
      generateRewrite();
    }
  };

  return (
    <main className='container max-w-6xl p-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold mb-1'>智能文本改写</h1>
        <p className='text-sm text-muted-foreground'>多风格文本改写，提升表达效果</p>
      </div>

      <div className='grid gap-6'>
        {/* 设置区域 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>改写风格</label>
            <Select value={rewriteStyle} onValueChange={setRewriteStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rewriteStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium mb-2 block'>改写目的</label>
            <Select value={rewritePurpose} onValueChange={setRewritePurpose}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rewritePurposes.map((purpose) => (
                  <SelectItem key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 输入区域 */}
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
            placeholder='请输入需要改写的文本内容...'
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            rows={8}
            className='resize-none'
          />
          <div className='flex justify-between items-center text-xs text-muted-foreground'>
            <span>字数: {sourceText.length}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className='flex justify-center gap-3'>
          <Button
            onClick={generateRewrite}
            disabled={loading || !sourceText.trim()}
            size='lg'
            className='flex items-center gap-2'
          >
            <Sparkles className='h-4 w-4' />
            {loading ? '改写中...' : '开始改写'}
          </Button>
          
          {rewriteResults.length > 0 && (
            <Button
              variant='outline'
              onClick={handleRegenerate}
              disabled={loading}
              size='lg'
              className='flex items-center gap-2'
            >
              <RefreshCw className='h-4 w-4' />
              重新改写
            </Button>
          )}
        </div>

        {/* 改写结果区域 */}
        {rewriteResults.length > 0 && (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>改写结果</h3>
            <div className='grid gap-4'>
              {rewriteResults.map((result, index) => (
                <Card key={index} className='hover:shadow-md transition-shadow'>
                  <CardContent className='p-6'>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <h4 className='font-medium text-sm text-muted-foreground flex items-center gap-2'>
                          <Edit3 className='h-4 w-4' />
                          版本 {index + 1}
                        </h4>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleCopy(result)}
                          className='flex items-center gap-1'
                        >
                          <Copy className='h-4 w-4' />
                          复制
                        </Button>
                      </div>
                      <div className='text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-primary/20 pl-4'>
                        {result}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        字数: {result.length}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}