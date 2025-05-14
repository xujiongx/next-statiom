import { RefObject } from 'react';
import Image from 'next/image';
import {
  PosterData,
  PosterTemplate,
  TextPosition,
  UpdateValue,
} from '../types';
import { DraggableText } from './DraggableText';

interface PosterPreviewProps {
  posterData: PosterData;
  canvasRef: RefObject<HTMLDivElement | null>;
  currentTemplate: PosterTemplate;
  updatePosterData: (field: keyof PosterData, value: UpdateValue) => void;
}

export function PosterPreview({
  posterData,
  canvasRef,
  currentTemplate,
  updatePosterData,
}: PosterPreviewProps) {
  // 处理文本位置变化
  const handleTitlePositionChange = (newPosition: TextPosition) => {
    console.log('更新前位置:', posterData.titlePosition);
    console.log('更新后位置:', newPosition);
    updatePosterData('titlePosition', newPosition);
  };

  const handleSubtitlePositionChange = (newPosition: TextPosition) => {
    updatePosterData('subtitlePosition', newPosition);
  };

  const handleDescriptionPositionChange = (newPosition: TextPosition) => {
    updatePosterData('descriptionPosition', newPosition);
  };

  // 根据样式设置生成样式对象
  const containerStyle = {
    borderRadius: posterData.borderRadius
      ? `${posterData.borderRadius}px`
      : undefined,
    boxShadow: posterData.enableShadow
      ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : 'none',
  };

  // 背景样式
  let backgroundStyle = {};
  if (posterData.backgroundStyle === 'solid') {
    backgroundStyle = {
      background: posterData.backgroundColor,
    };
  }

  // 文本阴影样式
  const textShadowStyle = posterData.enableTextShadow
    ? { textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)' }
    : {};

  return (
    <div className='sticky top-20'>
      <h3 className='text-lg font-medium mb-3'>预览</h3>
      <div
        ref={canvasRef}
        className={`${
          posterData.backgroundStyle === 'gradient'
            ? currentTemplate.bgColor
            : ''
        } w-full aspect-[9/16] rounded-lg overflow-hidden shadow-lg relative`}
        style={{ ...containerStyle, ...backgroundStyle }}
      >
        {posterData.imageUrl && (
          <div
            className='absolute inset-0 w-full h-full'
            style={{
              opacity: posterData.imageOpacity
                ? posterData.imageOpacity / 100
                : 0.2,
            }}
          >
            <Image
              src={posterData.imageUrl}
              alt='海报背景'
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, 33vw'
              priority
              unoptimized={posterData.imageUrl.startsWith('blob:')}
              crossOrigin='anonymous'
            />
          </div>
        )}

        {/* 标题 */}
        <DraggableText
          id='poster-title'
          position={posterData.titlePosition}
          onPositionChange={handleTitlePositionChange}
          enabled={posterData.enableDrag}
          style={{
            fontFamily: posterData.titleFont,
            color: posterData.titleColor,
            fontSize: `${posterData.titleSize}px`,
            lineHeight: 1.2,
            textAlign: posterData.textAlign,
            ...textShadowStyle,
          }}
        >
          {posterData.title}
        </DraggableText>

        {/* 副标题 */}
        <DraggableText
          id='poster-subtitle'
          position={posterData.subtitlePosition}
          onPositionChange={handleSubtitlePositionChange}
          enabled={posterData.enableDrag}
          style={{
            fontFamily: posterData.subtitleFont,
            color: posterData.subtitleColor,
            fontSize: `${posterData.subtitleSize}px`,
            lineHeight: 1.3,
            textAlign: posterData.textAlign,
            ...textShadowStyle,
          }}
        >
          {posterData.subtitle}
        </DraggableText>

        {/* 描述 */}
        <DraggableText
          id='poster-description'
          position={posterData.descriptionPosition}
          onPositionChange={handleDescriptionPositionChange}
          enabled={posterData.enableDrag}
          style={{
            fontFamily: posterData.descriptionFont,
            color: posterData.descriptionColor,
            fontSize: `${posterData.descriptionSize}px`,
            lineHeight: 1.5,
            textAlign: posterData.textAlign,
            ...textShadowStyle,
          }}
        >
          {posterData.description}
        </DraggableText>
        {/* 渲染自定义文本元素 */}
        {posterData.customTexts?.map((text) => (
          <DraggableText
            key={text.id}
            id={text.id}
            position={text.position}
            onPositionChange={(newPosition) => {
              const newCustomTexts = posterData.customTexts.map((t) =>
                t.id === text.id ? { ...t, position: newPosition } : t
              );
              updatePosterData('customTexts', newCustomTexts);
            }}
            enabled={posterData.enableDrag}
            style={{
              fontFamily: text.font,
              color: text.color,
              fontSize: `${text.size}px`,
              lineHeight: 1.5,
              textAlign: posterData.textAlign,
              ...textShadowStyle,
            }}
          >
            {text.content}
          </DraggableText>
        ))}
        {/* 渲染图片元素 */}
        {posterData.customImages?.map((image) => (
          <DraggableText
            resizeMode='both'
            key={image.id}
            id={image.id}
            position={image.position}
            onPositionChange={(newPosition) => {
              const newCustomImages = posterData.customImages.map((img) =>
                img.id === image.id ? { ...img, position: newPosition } : img
              );
              updatePosterData('customImages', newCustomImages);
            }}
            enabled={posterData.enableDrag}
            style={{
              width: `${image.width}px`,
              height: `${image.height}px`,
            }}
          >
            <img
              src={image.url}
              alt='图片元素'
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: image.opacity,
                borderRadius: `${image.borderRadius}px`,
              }}
            />
          </DraggableText>
        ))}
      </div>

      {posterData.enableDrag && (
        <div className='mt-2 text-sm text-gray-500 text-center'>
          提示：可拖动文字调整位置，拖动右下角蓝点调整大小
        </div>
      )}
    </div>
  );
}
