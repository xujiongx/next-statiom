import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export function ImageUploader({ onDragOver, onDrop, onFileUpload, isProcessing }: ImageUploaderProps) {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        className="hidden"
        id="file-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          点击上传或拖拽图片到此处
        </p>
        <p className="text-sm text-gray-500">
          支持 JPG、PNG、WEBP 格式，最大 10MB
        </p>
      </label>
    </div>
  );
}