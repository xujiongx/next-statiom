import { Button } from "@/components/ui/button";
import { QualityLevel } from "../backgroundRemoval";

interface QualitySelectorProps {
  quality: QualityLevel;
  setQuality: (quality: QualityLevel) => void;
}

export default function QualitySelector({ quality, setQuality }: QualitySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        variant={quality === "low" ? "default" : "outline"}
        onClick={() => setQuality("low")}
        className="w-full"
      >
        低质量
        <span className="ml-1 text-xs">(快速)</span>
      </Button>
      <Button
        variant={quality === "medium" ? "default" : "outline"}
        onClick={() => setQuality("medium")}
        className="w-full"
      >
        中质量
        <span className="ml-1 text-xs">(平衡)</span>
      </Button>
      <Button
        variant={quality === "high" ? "default" : "outline"}
        onClick={() => setQuality("high")}
        className="w-full"
      >
        高质量
        <span className="ml-1 text-xs">(精细)</span>
      </Button>
    </div>
  );
}