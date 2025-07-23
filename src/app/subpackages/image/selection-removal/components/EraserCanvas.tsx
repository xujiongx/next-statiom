import { Button } from "@/components/ui/button";

interface EraserCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  eraserSize: number;
  setEraserSize: (size: number) => void;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUp: () => void;
  handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchEnd: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

export function EraserCanvas({
  canvasRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  onComplete,
  onCancel,
}: EraserCanvasProps) {
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="cursor-crosshair"
        style={{
          touchAction: "none",
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          maxHeight: "500px",
        }}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Button onClick={onComplete} size="sm" variant="default">
          完成
        </Button>
        <Button onClick={onCancel} size="sm" variant="outline">
          取消
        </Button>
      </div>
    </div>
  );
}
