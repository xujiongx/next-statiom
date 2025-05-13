import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PosterData } from '../types';
import { FONT_OPTIONS } from '../constants';

interface TextPanelProps {
  posterData: PosterData;
  updatePosterData: (field: keyof PosterData, value: string | number) => void;
}

export function TextPanel({ posterData, updatePosterData }: TextPanelProps) {
  // 文本字段配置
  const textFields = [
    {
      id: 'title',
      label: '标题',
      value: posterData.title,
      font: posterData.titleFont,
      color: posterData.titleColor,
      size: posterData.titleSize,
      minSize: 16,
      maxSize: 72,
    },
    {
      id: 'subtitle',
      label: '副标题',
      value: posterData.subtitle,
      font: posterData.subtitleFont,
      color: posterData.subtitleColor,
      size: posterData.subtitleSize,
      minSize: 12,
      maxSize: 48,
    },
    {
      id: 'description',
      label: '描述',
      value: posterData.description,
      font: posterData.descriptionFont,
      color: posterData.descriptionColor,
      size: posterData.descriptionSize,
      minSize: 10,
      maxSize: 32,
      isTextarea: true,
    },
  ];

  return (
    <div className='space-y-4'>
      {textFields.map((field) => (
        <div key={field.id}>
          <Label htmlFor={field.id}>{field.label}</Label>
          {field.isTextarea ? (
            <Textarea
              id={field.id}
              value={field.value}
              onChange={(e) =>
                updatePosterData(field.id as keyof PosterData, e.target.value)
              }
              className='mb-2'
              rows={3}
            />
          ) : (
            <Input
              id={field.id}
              value={field.value}
              onChange={(e) =>
                updatePosterData(field.id as keyof PosterData, e.target.value)
              }
              className='mb-2'
            />
          )}
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <Label htmlFor={`${field.id}Font`}>字体</Label>
              <Select
                value={field.font}
                onValueChange={(value) =>
                  updatePosterData(`${field.id}Font` as keyof PosterData, value)
                }
              >
                <SelectTrigger id={`${field.id}Font`}>
                  <SelectValue placeholder='选择字体' />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor={`${field.id}Color`}>颜色</Label>
              <div className='flex'>
                <Input
                  id={`${field.id}Color`}
                  type='color'
                  value={field.color}
                  onChange={(e) =>
                    updatePosterData(
                      `${field.id}Color` as keyof PosterData,
                      e.target.value
                    )
                  }
                  className='w-12 p-1 h-10'
                />
                <Input
                  value={field.color}
                  onChange={(e) =>
                    updatePosterData(
                      `${field.id}Color` as keyof PosterData,
                      e.target.value
                    )
                  }
                  className='flex-1 ml-2'
                />
              </div>
            </div>
          </div>
          <Label className='mt-2 block'>字号: {field.size}px</Label>
          <Slider
            value={[field.size]}
            min={field.minSize}
            max={field.maxSize}
            step={1}
            onValueChange={(value) =>
              updatePosterData(`${field.id}Size` as keyof PosterData, value[0])
            }
            className='my-2'
          />
        </div>
      ))}
    </div>
  );
}