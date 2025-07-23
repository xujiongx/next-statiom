import { useState, useEffect } from "react";
import { backgroundRemovalTool } from "../backgroundRemoval";
import { useToast } from "@/components/ui/use-toast";

export function useModelStatus() {
  const { toast } = useToast();

  const [modelStatus, setModelStatus] = useState({
    isLoaded: false,
    hasError: false,
    error: null as string | null,
  });

  useEffect(() => {
    const checkModelStatus = () => {
      const status = backgroundRemovalTool.getModelStatus();
      setModelStatus(status);

      if (status.isLoaded && !status.hasError) {
        toast({
          description: "AI 模型加载完成！",
        });
      } else if (status.hasError) {
        toast({
          variant: "destructive",
          description: "模型加载失败，请刷新页面重试",
        });
      }
    };

    // 立即检查一次
    checkModelStatus();

    // 如果模型还没加载完成，定期检查
    const interval = setInterval(() => {
      const status = backgroundRemovalTool.getModelStatus();
      if (status.isLoaded) {
        setModelStatus(status);
        clearInterval(interval);

        if (!status.hasError) {
          toast({
            description: "AI 模型加载完成！",
          });
        } else {
          toast({
            variant: "destructive",
            description: "模型加载失败，请刷新页面重试",
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [toast]);

  return { modelStatus };
}
