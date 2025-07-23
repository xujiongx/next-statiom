import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { ProcessingState } from "../../background-removal/backgroundRemoval";

interface ProcessingControlsProps {
  onProcess: () => void;
  canProcess: boolean;
  processingState: ProcessingState;
}

export function ProcessingControls({ onProcess, canProcess, processingState }: ProcessingControlsProps) {
  return (
    <>
      <Button
        onClick={onProcess}
        disabled={!canProcess}
        className="w-full mt-4"
        size="lg"
      >
        {processingState.isProcessing ? (
          <>
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="animate-pulse">{processingState.stage}</span>
            </span>
          </>
        ) : (
          <>
            <Scissors className="mr-2 h-5 w-5" />
            开始抠图
          </>
        )}
      </Button>

      {processingState.isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mt-4">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out flex items-center justify-end"
            style={{ width: `${processingState.progress}%` }}
          >
            <div className="h-2 w-2 bg-white rounded-full mr-0.5 animate-pulse"></div>
          </div>
          <div className="text-xs text-center mt-1 text-gray-600">
            {processingState.stage}
          </div>
        </div>
      )}
    </>
  );
}