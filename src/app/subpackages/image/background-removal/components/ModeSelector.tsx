import { Switch } from "@/components/ui/switch";

interface ModeSelectorProps {
  selectionMode: boolean;
  setSelectionMode: (mode: boolean) => void;
}

export default function ModeSelector({ selectionMode, setSelectionMode }: ModeSelectorProps) {
  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium">抠图模式</h3>
          <p className="text-sm text-gray-500">
            {selectionMode 
              ? "框选模式：手动选择要保留的区域" 
              : "智能模式：AI 自动识别前景"}
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2 flex-shrink-0">
          <span className="text-sm text-gray-500">智能模式</span>
          <Switch 
            checked={selectionMode} 
            onCheckedChange={setSelectionMode} 
          />
          <span className="text-sm text-gray-500">框选模式</span>
        </div>
      </div>
    </div>
  );
}