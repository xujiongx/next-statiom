'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Download, Palette, Loader2 } from 'lucide-react';
import {
  SingleImageUpload,
  UploadedImage,
} from '@/components/ui/single-image-upload';
import Image from 'next/image';
// 导入新的依赖
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// 海报模板数据
const posterTemplates = [
  {
    id: 'template1',
    name: '商业简约',
    bgColor: 'bg-gradient-to-br from-blue-500 to-purple-600',
  },
  {
    id: 'template2',
    name: '时尚潮流',
    bgColor: 'bg-gradient-to-r from-pink-500 to-orange-500',
  },
  {
    id: 'template3',
    name: '自然清新',
    bgColor: 'bg-gradient-to-br from-green-400 to-blue-400',
  },
  {
    id: 'template4',
    name: '科技未来',
    bgColor: 'bg-gradient-to-br from-indigo-600 to-purple-800',
  },
  {
    id: 'template5',
    name: '节日喜庆',
    bgColor: 'bg-gradient-to-r from-red-500 to-yellow-500',
  },
];

// 字体选项
const fontOptions = [
  { value: 'sans', label: '无衬线体' },
  { value: 'serif', label: '衬线体' },
  { value: 'mono', label: '等宽体' },
];

export default function PosterPage() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);

  // 海报状态
  const [posterData, setPosterData] = useState({
    template: 'template1',
    title: '精彩活动即将开始',
    subtitle: '不容错过的年度盛会',
    description: '2023年12月15日 | 上海国际会展中心',
    titleColor: '#ffffff',
    subtitleColor: '#f0f0f0',
    descriptionColor: '#e0e0e0',
    titleFont: 'sans',
    subtitleFont: 'sans',
    descriptionFont: 'sans',
    titleSize: 36,
    subtitleSize: 24,
    descriptionSize: 16,
    imageUrl: '',
  });

  // 上传的图片对象
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );
  
  // 计算当前模板
  const currentTemplate = posterTemplates.find(
    (template) => template.id === posterData.template
  ) || posterTemplates[0];

  // 更新海报数据
  const updatePosterData = (field: string, value: string | number) => {
    setPosterData((prev) => ({ ...prev, [field]: value }));
  };

  // 处理图片上传
  const handleImageChange = (image: UploadedImage | null) => {
    console.log('🕴', image);
    setUploadedImage(image);
    updatePosterData('imageUrl', image?.url || image?.display_url || '');
  };

  // 生成海报
  const generatePoster = async () => {
    if (!canvasRef.current) return;
    
    setLoading(true);
    try {
      // 使用html2canvas将DOM元素转换为Canvas
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // 提高分辨率
        useCORS: true, // 允许跨域图片
        allowTaint: true,
        backgroundColor: null, // 透明背景
        logging: false,
      });
      
      // 将Canvas转换为图片URL
      const imageUrl = canvas.toDataURL('image/png');
      setPosterImage(imageUrl);
      
      toast({
        title: '海报生成成功',
        description: '您可以点击下载按钮保存海报',
      });
    } catch (error) {
      console.error('生成海报失败:', error);
      toast({
        variant: 'destructive',
        title: '生成失败',
        description: '请稍后重试',
      });
    } finally {
      setLoading(false);
    }
  };

  // 下载海报
  const downloadPoster = () => {
    if (!posterImage) {
      toast({
        variant: 'destructive',
        title: '请先生成海报',
        description: '点击"生成海报"按钮生成后再下载',
      });
      return;
    }
    
    try {
      // 使用file-saver库保存图片
      const filename = `海报_${new Date().toISOString().slice(0, 10)}.png`;
      
      // 从base64字符串创建Blob
      const byteString = atob(posterImage.split(',')[1]);
      const mimeString = posterImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      saveAs(blob, filename);
      
      toast({
        title: '下载成功',
        description: `海报已保存为 ${filename}`,
      });
    } catch (error) {
      console.error('下载海报失败:', error);
      toast({
        variant: 'destructive',
        title: '下载失败',
        description: '请稍后重试',
      });
    }
  };

  // 处理图片加载错误
  useEffect(() => {
    const handleImageError = () => {
      if (posterData.imageUrl) {
        toast({
          variant: 'destructive',
          title: '图片加载失败',
          description: '背景图片无法加载，请尝试重新上传',
        });
      }
    };

    // 监听图片加载错误
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', handleImageError);
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('error', handleImageError);
      });
    };
  }, [posterData.imageUrl, toast]);

  return (
    <div className='container p-6'>
      <h1 className='text-2xl font-bold mb-6'>AI 海报生成</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 左侧编辑区 */}
        <div className='lg:col-span-2'>
          <Tabs defaultValue='template' className='w-full'>
            <TabsList className='grid grid-cols-4 mb-4'>
              <TabsTrigger value='template'>模板</TabsTrigger>
              <TabsTrigger value='text'>文本</TabsTrigger>
              <TabsTrigger value='image'>图片</TabsTrigger>
              <TabsTrigger value='style'>样式</TabsTrigger>
            </TabsList>

            {/* 模板选择 */}
            <TabsContent value='template' className='space-y-4'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {posterTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`${
                      template.bgColor
                    } h-24 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      posterData.template === template.id
                        ? 'ring-2 ring-blue-500 scale-105'
                        : 'hover:scale-105'
                    }`}
                    onClick={() => updatePosterData('template', template.id)}
                  >
                    <span className='text-white font-medium'>
                      {template.name}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 文本编辑 */}
            <TabsContent value='text' className='space-y-4'>
              <div>
                <Label htmlFor='title'>标题</Label>
                <Input
                  id='title'
                  value={posterData.title}
                  onChange={(e) => updatePosterData('title', e.target.value)}
                  className='mb-2'
                />
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Label htmlFor='titleFont'>字体</Label>
                    <Select
                      value={posterData.titleFont}
                      onValueChange={(value) =>
                        updatePosterData('titleFont', value)
                      }
                    >
                      <SelectTrigger id='titleFont'>
                        <SelectValue placeholder='选择字体' />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='titleColor'>颜色</Label>
                    <div className='flex'>
                      <Input
                        id='titleColor'
                        type='color'
                        value={posterData.titleColor}
                        onChange={(e) =>
                          updatePosterData('titleColor', e.target.value)
                        }
                        className='w-12 p-1 h-10'
                      />
                      <Input
                        value={posterData.titleColor}
                        onChange={(e) =>
                          updatePosterData('titleColor', e.target.value)
                        }
                        className='flex-1 ml-2'
                      />
                    </div>
                  </div>
                </div>
                <Label className='mt-2 block'>
                  字号: {posterData.titleSize}px
                </Label>
                <Slider
                  value={[posterData.titleSize]}
                  min={16}
                  max={72}
                  step={1}
                  onValueChange={(value) =>
                    updatePosterData('titleSize', value[0])
                  }
                  className='my-2'
                />
              </div>

              <div>
                <Label htmlFor='subtitle'>副标题</Label>
                <Input
                  id='subtitle'
                  value={posterData.subtitle}
                  onChange={(e) => updatePosterData('subtitle', e.target.value)}
                  className='mb-2'
                />
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Label htmlFor='subtitleFont'>字体</Label>
                    <Select
                      value={posterData.subtitleFont}
                      onValueChange={(value) =>
                        updatePosterData('subtitleFont', value)
                      }
                    >
                      <SelectTrigger id='subtitleFont'>
                        <SelectValue placeholder='选择字体' />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='subtitleColor'>颜色</Label>
                    <div className='flex'>
                      <Input
                        id='subtitleColor'
                        type='color'
                        value={posterData.subtitleColor}
                        onChange={(e) =>
                          updatePosterData('subtitleColor', e.target.value)
                        }
                        className='w-12 p-1 h-10'
                      />
                      <Input
                        value={posterData.subtitleColor}
                        onChange={(e) =>
                          updatePosterData('subtitleColor', e.target.value)
                        }
                        className='flex-1 ml-2'
                      />
                    </div>
                  </div>
                </div>
                <Label className='mt-2 block'>
                  字号: {posterData.subtitleSize}px
                </Label>
                <Slider
                  value={[posterData.subtitleSize]}
                  min={12}
                  max={48}
                  step={1}
                  onValueChange={(value) =>
                    updatePosterData('subtitleSize', value[0])
                  }
                  className='my-2'
                />
              </div>

              <div>
                <Label htmlFor='description'>描述</Label>
                <Textarea
                  id='description'
                  value={posterData.description}
                  onChange={(e) =>
                    updatePosterData('description', e.target.value)
                  }
                  className='mb-2'
                  rows={3}
                />
                <div className='grid grid-cols-2 gap-2'>
                  <div>
                    <Label htmlFor='descriptionFont'>字体</Label>
                    <Select
                      value={posterData.descriptionFont}
                      onValueChange={(value) =>
                        updatePosterData('descriptionFont', value)
                      }
                    >
                      <SelectTrigger id='descriptionFont'>
                        <SelectValue placeholder='选择字体' />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='descriptionColor'>颜色</Label>
                    <div className='flex'>
                      <Input
                        id='descriptionColor'
                        type='color'
                        value={posterData.descriptionColor}
                        onChange={(e) =>
                          updatePosterData('descriptionColor', e.target.value)
                        }
                        className='w-12 p-1 h-10'
                      />
                      <Input
                        value={posterData.descriptionColor}
                        onChange={(e) =>
                          updatePosterData('descriptionColor', e.target.value)
                        }
                        className='flex-1 ml-2'
                      />
                    </div>
                  </div>
                </div>
                <Label className='mt-2 block'>
                  字号: {posterData.descriptionSize}px
                </Label>
                <Slider
                  value={[posterData.descriptionSize]}
                  min={10}
                  max={32}
                  step={1}
                  onValueChange={(value) =>
                    updatePosterData('descriptionSize', value[0])
                  }
                  className='my-2'
                />
              </div>
            </TabsContent>

            {/* 图片上传 - 使用新组件 */}
            <TabsContent value='image' className='space-y-4'>
              <div className='p-4'>
                <h3 className='text-lg font-medium mb-3'>背景图片</h3>
                <p className='text-sm text-gray-500 mb-4'>
                  上传图片作为海报背景，图片将以半透明效果显示
                </p>
                <SingleImageUpload
                  value={uploadedImage}
                  onChange={handleImageChange}
                  maxSize={5}
                  aspectRatio={9 / 16}
                  placeholder='支持 JPG, PNG 格式，建议使用高清图片'
                  buttonText='选择背景图片'
                  enableCrop={true}
                />
              </div>
            </TabsContent>

            {/* 样式设置 */}
            <TabsContent value='style' className='space-y-4'>
              <p className='text-sm text-gray-500 mb-4'>
                更多样式设置功能即将上线...
              </p>
            </TabsContent>
          </Tabs>

          <div className='mt-6 flex space-x-4'>
            <Button
              onClick={generatePoster}
              className='flex-1'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  生成中...
                </>
              ) : (
                <>
                  <Palette className='mr-2 h-4 w-4' />
                  生成海报
                </>
              )}
            </Button>
            <Button
              variant='outline'
              onClick={downloadPoster}
              disabled={loading || !posterImage}
            >
              <Download className='mr-2 h-4 w-4' />
              下载
            </Button>
          </div>
          
          {/* 显示生成的海报预览 */}
          {posterImage && (
            <div className='mt-6'>
              <h3 className='text-lg font-medium mb-3'>生成结果</h3>
              <div className='border rounded-lg p-2 bg-gray-50 dark:bg-gray-900'>
                <img 
                  src={posterImage} 
                  alt="生成的海报" 
                  className='max-w-full h-auto mx-auto'
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className='lg:col-span-1'>
          <div className='sticky top-20'>
            <h3 className='text-lg font-medium mb-3'>预览</h3>
            <div
              ref={canvasRef}
              className={`${currentTemplate.bgColor} w-full aspect-[9/16] rounded-lg overflow-hidden shadow-lg flex flex-col items-center justify-between p-6 relative`}
            >
              {/* 预览区域 */}
              {posterData.imageUrl && (
                <div className='absolute inset-0 opacity-20 w-full h-full'>
                  <Image
                    src={posterData.imageUrl}
                    alt='海报背景'
                    className='object-cover'
                    fill
                    sizes='(max-width: 768px) 100vw, 33vw'
                    priority
                    unoptimized={posterData.imageUrl.startsWith('blob:')}
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              <div className='z-10 text-center mt-8 space-y-2 w-full'>
                <h2
                  className={`font-${posterData.titleFont}`}
                  style={{
                    color: posterData.titleColor,
                    fontSize: `${posterData.titleSize}px`,
                    lineHeight: 1.2,
                  }}
                >
                  {posterData.title}
                </h2>
                <h3
                  className={`font-${posterData.subtitleFont}`}
                  style={{
                    color: posterData.subtitleColor,
                    fontSize: `${posterData.subtitleSize}px`,
                    lineHeight: 1.3,
                  }}
                >
                  {posterData.subtitle}
                </h3>
              </div>

              <div className='z-10 mt-auto mb-8'>
                <p
                  className={`text-center font-${posterData.descriptionFont}`}
                  style={{
                    color: posterData.descriptionColor,
                    fontSize: `${posterData.descriptionSize}px`,
                    lineHeight: 1.5,
                  }}
                >
                  {posterData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
