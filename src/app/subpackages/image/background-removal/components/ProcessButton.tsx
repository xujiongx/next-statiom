import { Button } from "@/components/ui/button";
import { Scissors, AlertCircle } from "lucide-react";
import { ProcessingState } from "../backgroundRemoval";

interface ProcessButtonProps {
  removeBackgroundAI: () => Promise<void>;
  canProcess: boolean;
  selectionMode: boolean;
  modelStatus: {
    isLoaded: boolean;
    hasError: boolean;
  };
  processingState: ProcessingState;
}

export default function ProcessButton({
  removeBackgroundAI,
  canProcess,
  selectionMode,
  modelStatus,
  processingState,
}: ProcessButtonProps) {
  return (
    <Button
      onClick={removeBackgroundAI}
      disabled={!canProcess || (!selectionMode && modelStatus.hasError)}
      className="w-full relative overflow-hidden group"
      size="lg"
    >
      {processingState.isProcessing ? (
        <>
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="animate-pulse">{processingState.stage}</span>
          </span>
        </>
      ) : !selectionMode && !modelStatus.isLoaded ? (
        <>
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            等待模型加载...
          </span>
        </>
      ) : !selectionMode && modelStatus.hasError ? (
        <>
          <AlertCircle className="mr-2 h-5 w-5" />
          模型加载失败
        </>
      ) : (
        <>
          <span className="flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Scissors className="mr-2 h-5 w-5" />
            {selectionMode ? "开始框选抠图" : "一键抠图"}
          </span>
          <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 w-0 group-hover:w-full transition-all duration-300"></span>
        </>
      )}
    </Button>
  );
}