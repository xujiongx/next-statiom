import { Upload } from "lucide-react";
import { ProcessingState } from "../backgroundRemoval";

interface ImageUploaderProps {
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processingState: ProcessingState;
}

export default function ImageUploader({
  handleDragOver,
  handleDrop,
  handleFileUpload,
  processingState,
}: ImageUploaderProps) {
  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        disabled={processingState.isProcessing}
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer ${
          processingState.isProcessing
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
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