import { ProcessingState } from "../backgroundRemoval";

interface ProgressBarProps {
  processingState: ProcessingState;
}

export default function ProgressBar({ processingState }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
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
  );
}