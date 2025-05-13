'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Download, Palette, Loader2 } from 'lucide-react';
import { UploadedImage } from './types';
import { usePosterStore } from '@/store';
import {
  TemplatePanel,
  TextPanel,
  ImagePanel,
  PosterPreview,
} from './components';
import { StylePanel } from './components/StylePanel';

// 主组件
export default function PosterPage() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null
  );

  // 使用 Zustand store
  const {
    posterData,
    updatePosterData,
    currentTemplate,
    loading,
    posterImage,
    generatePoster,
    downloadPoster,
  } = usePosterStore();


  console.log('👠', posterData);

  // 处理图片上传
  const handleImageChange = (image: UploadedImage | null) => {
    setUploadedImage(image);
    updatePosterData('imageUrl', image?.url || image?.display_url || '');
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
    images.forEach((img) => {
      img.addEventListener('error', handleImageError);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('error', handleImageError);
      });
    };
  }, [posterData.imageUrl, toast]);

  // 处理生成海报
  const handleGeneratePoster = async () => {
    try {
      await generatePoster(canvasRef);
    } catch {
      toast({
        variant: 'destructive',
        title: '生成海报失败',
        description: '请稍后重试',
      });
    }
  };

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
              <TemplatePanel
                posterData={posterData}
                updatePosterData={updatePosterData}
              />
            </TabsContent>

            {/* 文本编辑 */}
            <TabsContent value='text' className='space-y-4'>
              <TextPanel
                posterData={posterData}
                updatePosterData={updatePosterData}
              />
            </TabsContent>

            {/* 图片上传 */}
            <TabsContent value='image' className='space-y-4'>
              <ImagePanel
                uploadedImage={uploadedImage}
                handleImageChange={handleImageChange}
              />
            </TabsContent>

            {/* 样式设置 */}
            <TabsContent value='style' className='space-y-4'>
              <StylePanel
                posterData={posterData}
                updatePosterData={updatePosterData}
              />
            </TabsContent>
          </Tabs>

          <div className='mt-6 flex space-x-4'>
            <Button
              onClick={handleGeneratePoster}
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
                  alt='生成的海报'
                  className='max-w-full h-auto mx-auto'
                  style={{ maxHeight: '400px' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 右侧预览区 */}
        <div className='lg:col-span-1'>
          <PosterPreview
            posterData={posterData}
            canvasRef={canvasRef}
            currentTemplate={currentTemplate}
            updatePosterData={updatePosterData}
          />
        </div>
      </div>
    </div>
  );
}
