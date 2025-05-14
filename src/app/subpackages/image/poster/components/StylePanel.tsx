import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PosterData, UploadedImage } from '../types';
import { SingleImageUpload } from '@/components/ui/single-image-upload'

interface StylePanelProps {
  posterData: PosterData;
  updatePosterData: (
    field: keyof PosterData,
    value: string | number | boolean
  ) => void;
  uploadedImage: UploadedImage | null;
  handleImageChange: (image: UploadedImage | null) => void;
}

export function StylePanel({
  posterData,
  updatePosterData,
  uploadedImage,
  handleImageChange,
}: StylePanelProps) {
  // 处理背景透明度变化
  const handleOpacityChange = (value: number[]) => {
    updatePosterData('imageOpacity', value[0]);
  };

  // 处理圆角变化
  const handleBorderRadiusChange = (value: number[]) => {
    updatePosterData('borderRadius', value[0]);
  };

  // 处理阴影开关变化
  const handleShadowChange = (checked: boolean) => {
    updatePosterData('enableShadow', checked);
  };

  // 处理文字阴影开关变化
  const handleTextShadowChange = (checked: boolean) => {
    updatePosterData('enableTextShadow', checked);
  };

  // 处理文本对齐方式变化
  const handleTextAlignChange = (value: string) => {
    updatePosterData('textAlign', value);
  };

  // 处理背景样式变化
  const handleBackgroundStyleChange = (value: string) => {
    updatePosterData('backgroundStyle', value);
  };

  // 处理背景颜色变化
  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updatePosterData('backgroundColor', e.target.value);
  };

  // 处理拖拽功能开关变化
  const handleDragToggle = (checked: boolean) => {
    updatePosterData('enableDrag', checked);
  };

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h3 className='text-lg font-medium mb-3'>背景设置</h3>

        <div className='space-y-4'>
          <div>
            <Label htmlFor='backgroundStyle'>背景类型</Label>
            <Select
              value={posterData.backgroundStyle}
              onValueChange={handleBackgroundStyleChange}
            >
              <SelectTrigger id='backgroundStyle'>
                <SelectValue placeholder='选择背景类型' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gradient'>渐变背景</SelectItem>
                <SelectItem value='solid'>纯色背景</SelectItem>
                <SelectItem value='image'>图片背景</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {posterData.backgroundStyle === 'solid' && (
            <div>
              <Label htmlFor='backgroundColor'>背景颜色</Label>
              <div className='flex mt-1'>
                <Input
                  id='backgroundColor'
                  type='color'
                  value={posterData.backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className='w-12 p-1 h-10'
                />
                <Input
                  value={posterData.backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className='flex-1 ml-2'
                />
              </div>
            </div>
          )}

          {posterData.backgroundStyle === 'image' && (
            <>
              <div>
                <Label className='block mb-1'>
                  背景透明度: {posterData.imageOpacity}%
                </Label>
                <Slider
                  value={[posterData.imageOpacity]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={handleOpacityChange}
                />
              </div>
              {/* 背景图片配置 */}
              <div className='space-y-4'>
                <h3 className='text-lg font-medium'>背景图片</h3>
                <p className='text-sm text-gray-500'>
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
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-3'>边框与形状</h3>

        <div className='space-y-4'>
          <div>
            <Label className='block mb-1'>
              圆角大小: {posterData.borderRadius}px
            </Label>
            <Slider
              value={[posterData.borderRadius]}
              min={0}
              max={32}
              step={1}
              onValueChange={handleBorderRadiusChange}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label htmlFor='shadow'>卡片阴影</Label>
            <Switch
              id='shadow'
              checked={posterData.enableShadow}
              onCheckedChange={handleShadowChange}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-3'>文本样式</h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='textShadow'>文字阴影</Label>
            <Switch
              id='textShadow'
              checked={posterData.enableTextShadow}
              onCheckedChange={handleTextShadowChange}
            />
          </div>

          <div>
            <Label className='block mb-2'>文本对齐</Label>
            <RadioGroup
              value={posterData.textAlign}
              onValueChange={handleTextAlignChange}
              className='flex space-x-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='left' id='left' />
                <Label htmlFor='left'>左对齐</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='center' id='center' />
                <Label htmlFor='center'>居中</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='right' id='right' />
                <Label htmlFor='right'>右对齐</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <div>
        <h3 className='text-lg font-medium mb-3'>交互设置</h3>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='enableDrag'>启用文字拖拽</Label>
            <Switch
              id='enableDrag'
              checked={posterData.enableDrag}
              onCheckedChange={handleDragToggle}
            />
          </div>

          {posterData.enableDrag && (
            <p className='text-sm text-gray-500'>
              启用后，您可以在预览区域拖动文字调整位置，并通过右下角的蓝点调整文字大小。
            </p>
          )}
        </div>
      </div>

      <div className='pt-4 border-t'>
        <p className='text-sm text-gray-500'>
          更多高级样式设置功能即将上线，敬请期待...
        </p>
      </div>
    </div>
  );
}
