import {
  SingleImageUpload,
  UploadedImage,
} from '@/components/ui/single-image-upload';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, Plus } from 'lucide-react';
import { ImageElement, PosterData, UpdateValue } from '../types';

interface ImagePanelProps {
  posterData: PosterData;
  updatePosterData: (field: keyof PosterData, value: UpdateValue) => void;
}

export function ImagePanel({ posterData, updatePosterData }: ImagePanelProps) {
  // 添加新图片元素
  const handleAddImage = (image: UploadedImage, imageId: string) => {
    const newCustomImages =
      posterData.customImages?.map((img) =>
        img.id === imageId
          ? {
              ...img,
              url: image.url || image.display_url,
            }
          : img
      ) || [];
    updatePosterData('customImages', newCustomImages);
  };

  // 添加新的空图片元素
  const handleAddNewImage = () => {
    const newImage: ImageElement = {
      id: `image-${Date.now()}`,
      url: '',
      position: {
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        isDragging: false,
        isResizing: false,
      },
      width: 200,
      height: 200,
      opacity: 1,
      borderRadius: 0,
    };

    const newCustomImages = [...(posterData.customImages || []), newImage];
    updatePosterData('customImages', newCustomImages);
  };

  return (
    <div className='space-y-6'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-medium'>图片元素</h3>
          <Button variant='outline' size='sm' onClick={handleAddNewImage}>
            <Plus className='h-4 w-4 mr-2' />
            添加图片
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          {posterData.customImages?.map((image) => (
            <div key={image.id} className='relative border p-4 rounded-lg'>
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-2 top-2'
                onClick={() => {
                  const newCustomImages = posterData.customImages.filter(
                    (img) => img.id !== image.id
                  );
                  updatePosterData('customImages', newCustomImages);
                }}
              >
                <X className='h-4 w-4' />
              </Button>

              <div className='space-y-4'>
                <div className='mb-4'>
                  <SingleImageUpload
                    aspectRatio={0}
                    value={{
                      url: image.url,
                      display_url: image.url,
                      filename: '',
                    }}
                    onChange={(newImage) =>
                      newImage && handleAddImage(newImage, image.id)
                    }
                    maxSize={5}
                    placeholder='点击上传图片'
                    buttonText='更换图片'
                    enableCrop={true}
                  />
                </div>

                <div>
                  <Label>不透明度</Label>
                  <Slider
                    value={[image.opacity * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => {
                      const newCustomImages = posterData.customImages.map(
                        (img) =>
                          img.id === image.id
                            ? { ...img, opacity: value[0] / 100 }
                            : img
                      );
                      updatePosterData('customImages', newCustomImages);
                    }}
                  />
                </div>

                <div>
                  <Label>圆角</Label>
                  <Slider
                    value={[image.borderRadius]}
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => {
                      const newCustomImages = posterData.customImages.map(
                        (img) =>
                          img.id === image.id
                            ? { ...img, borderRadius: value[0] }
                            : img
                      );
                      updatePosterData('customImages', newCustomImages);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
