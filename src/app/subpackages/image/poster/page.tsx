'use client';

import { useRef, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { UploadedImage } from './types';
import { usePosterStore } from '@/store';
import {
  TemplatePanel,
  TextPanel,
  ImagePanel,
  PosterPreview,
  GeneratePanel,
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
            <TabsList className='grid grid-cols-5 mb-4'>
              <TabsTrigger value='template'>模板</TabsTrigger>
              <TabsTrigger value='text'>文本</TabsTrigger>
              <TabsTrigger value='image'>图片</TabsTrigger>
              <TabsTrigger value='style'>样式</TabsTrigger>
              <TabsTrigger value='generate'>生成</TabsTrigger>
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
                posterData={posterData}
                updatePosterData={updatePosterData}
              />
            </TabsContent>

            {/* 样式设置 */}
            <TabsContent value='style' className='space-y-4'>
              <StylePanel
                posterData={posterData}
                updatePosterData={updatePosterData}
                uploadedImage={uploadedImage}
                handleImageChange={handleImageChange}
              />
            </TabsContent>

            {/* 生成海报 */}
            <TabsContent value='generate' className='space-y-4'>
              <GeneratePanel
                loading={loading}
                posterImage={posterImage}
                onGenerate={handleGeneratePoster}
                onDownload={downloadPoster}
              />
            </TabsContent>
          </Tabs>
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
