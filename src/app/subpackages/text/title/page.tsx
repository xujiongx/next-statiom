'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { qaApi } from '@/api/translate'; // 导入Q&A API
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const titleTypes = [
  { value: 'article', label: '文章标题' },
  { value: 'blog', label: '博客标题' },
  { value: 'news', label: '新闻标题' },
  { value: 'social', label: '社交媒体' },
  { value: 'marketing', label: '营销文案' },
  { value: 'academic', label: '学术论文' },
];

const tones = [
  { value: 'professional', label: '专业严肃' },
  { value: 'casual', label: '轻松随意' },
  { value: 'creative', label: '创意新颖' },
  { value: 'urgent', label: '紧迫感' },
  { value: 'emotional', label: '情感化' },
  { value: 'humorous', label: '幽默风趣' },
];

export default function TitlePage() {
  const [content, setContent] = useState('');
  const [titleType, setTitleType] = useState('article');
  const [tone, setTone] = useState('professional');
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 构建提示词的函数
  const buildPrompt = (text: string, type: string, toneValue: string): string => {
    const typeDescriptions = {
      article: '文章标题，要求准确概括内容主题，具有一定的学术性和权威性',
      blog: '博客标题，要求亲切自然，贴近读者，具有个人化色彩',
      news: '新闻标题，要求简洁有力，突出时效性和重要性',
      social: '社交媒体标题，要求吸引眼球，具有传播性和互动性',
      marketing: '营销文案标题，要求具有说服力和行动号召力',
      academic: '学术论文标题，要求严谨准确，体现研究价值和创新性'
    };

    const toneDescriptions = {
      professional: '专业严肃的语调，用词准确规范',
      casual: '轻松随意的语调，用词亲切自然',
      creative: '创意新颖的语调，用词独特有趣',
      urgent: '紧迫感的语调，突出重要性和时效性',
      emotional: '情感化的语调，能够触动读者情感',
      humorous: '幽默风趣的语调，轻松有趣'
    };

    return `请根据以下内容生成5个${typeDescriptions[type as keyof typeof typeDescriptions]}，语调要求${toneDescriptions[toneValue as keyof typeof toneDescriptions]}。

内容：${text}

要求：
1. 生成5个不同的标题
2. 每个标题单独一行
3. 标题要准确反映内容主题
4. 符合${titleTypes.find(t => t.value === type)?.label}的特点
5. 体现${tones.find(t => t.value === toneValue)?.label}的风格

请直接输出标题，每行一个，不需要编号或其他格式：`;
  };

  // 使用Q&A接口生成标题
  const generateTitlesWithQA = async (text: string, type: string, toneValue: string): Promise<string[]> => {
    try {
      const prompt = buildPrompt(text, type, toneValue);
      const response = await qaApi.ask({ prompt });

      console.log("🧟‍♀️", response);
      
      if (!response.code && response.data) {
        // 解析AI返回的标题，按行分割并过滤空行
        const titles = response.data.response
          .split('\n')
          .map(title => title.trim())
          .filter(title => title.length > 0)
          .slice(0, 5); // 确保最多5个标题
        
        return titles.length > 0 ? titles : ['生成失败，请重试'];
      } else {
        throw new Error('API调用失败');
      }
    } catch (error) {
      console.error('标题生成失败:', error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      
      // 使用Q&A接口生成标题
      const titles = await generateTitlesWithQA(content, titleType, tone);
      setGeneratedTitles(titles);
      
      toast({
        description: '标题生成成功！',
      });
    } catch (error) {
      console.error('标题生成失败:', error);
      toast({
        variant: 'destructive',
        description: '生成失败，请重试',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (title: string) => {
    try {
      await navigator.clipboard.writeText(title);
      toast({
        description: '标题已复制到剪贴板',
      });
    } catch {
      toast({
        variant: 'destructive',
        description: '复制失败',
      });
    }
  };

  const handleRegenerate = () => {
    if (content.trim()) {
      handleGenerate();
    }
  };

  return (
    <main className='container max-w-4xl p-6'>
      <div className='mb-6'>
        <h1 className='text-xl font-bold mb-1'>智能标题生成</h1>
        <p className='text-sm text-muted-foreground'>根据内容生成吸引人的标题</p>
      </div>

      <div className='grid gap-6'>
        {/* 设置区域 */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium mb-2 block'>标题类型</label>
            <Select value={titleType} onValueChange={setTitleType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {titleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className='text-sm font-medium mb-2 block'>语调风格</label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((toneOption) => (
                  <SelectItem key={toneOption.value} value={toneOption.value}>
                    {toneOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 内容输入区域 */}
        <div>
          <label className='text-sm font-medium mb-2 block'>文章内容或关键信息</label>
          <Textarea
            placeholder='请输入文章内容、关键词或主要信息，AI将根据这些内容生成合适的标题...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className='resize-none'
          />
        </div>

        {/* 生成按钮 */}
        <div className='flex gap-2'>
          <Button
            onClick={handleGenerate}
            disabled={loading || !content.trim()}
            className='flex items-center gap-2'
          >
            <Sparkles className='h-4 w-4' />
            {loading ? '生成中...' : '生成标题'}
          </Button>
          
          {generatedTitles.length > 0 && (
            <Button
              variant='outline'
              onClick={handleRegenerate}
              disabled={loading}
              className='flex items-center gap-2'
            >
              <RefreshCw className='h-4 w-4' />
              重新生成
            </Button>
          )}
        </div>

        {/* 生成结果区域 */}
        {generatedTitles.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold mb-4'>生成的标题建议</h3>
            <div className='grid gap-3'>
              {generatedTitles.map((title, index) => (
                <Card key={index} className='hover:shadow-md transition-shadow'>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between gap-4'>
                      <p className='flex-1 text-sm leading-relaxed'>{title}</p>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleCopy(title)}
                        className='shrink-0 flex items-center gap-1'
                      >
                        <Copy className='h-4 w-4' />
                        复制
                      </Button>
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