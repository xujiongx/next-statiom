import { Loader2, AlertCircle } from "lucide-react";

interface ModelStatusProps {
  selectionMode: boolean;
  modelStatus: {
    isLoaded: boolean;
    hasError: boolean;
    error: string | null;
  };
}

export default function ModelStatus({ selectionMode, modelStatus }: ModelStatusProps) {
  if (selectionMode) return null;
  
  if (!modelStatus.isLoaded) {
    return (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-blue-800">正在加载 AI 模型...</span>
        </div>
      </div>
    );
  }
  
  if (modelStatus.hasError) {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-800">
            AI 模型加载失败，请刷新页面重试
          </span>
        </div>
      </div>
    );
  }
  
  return null;
}