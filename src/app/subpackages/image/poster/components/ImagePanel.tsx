import { SingleImageUpload, UploadedImage } from '@/components/ui/single-image-upload';

interface ImagePanelProps {
  uploadedImage: UploadedImage | null;
  handleImageChange: (image: UploadedImage | null) => void;
}

export function ImagePanel({ uploadedImage, handleImageChange }: ImagePanelProps) {
  return (
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
  );
}