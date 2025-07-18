"use client";

import { Edit, FileText, Heading, Languages, Calculator } from "lucide-react";
import PageContainer from "@/components/ui/page-container";

export default function TextPage() {
  const features = [
    {
      id: "translate",
      title: "智能翻译",
      icon: <Languages className="h-6 w-6" />,
      description: "支持多语言互译，准确快速",
      path: "/subpackages/text/translate",
    },
    {
      id: "title",
      title: "标题生成",
      icon: <Heading className="h-6 w-6" />,
      description: "生成吸引人的标题",
      path: "/subpackages/text/title",
    },
    {
      id: "summary",
      title: "文本摘要",
      icon: <FileText className="h-6 w-6" />,
      description: "快速生成文章摘要",
      path: "/subpackages/text/summary",
    },
    {
      id: "rewrite",
      title: "文本改写",
      icon: <Edit className="h-6 w-6" />,
      description: "优化文章结构和表达",
      path: "/subpackages/text/rewrite",
    },
    {
      id: "converter",
      title: "单位换算",
      icon: <Calculator className="h-6 w-6" />,
      description: "长度、重量、温度等单位转换",
      path: "/subpackages/text/converter",
    },
  ];

  return (
    <PageContainer
      title="文字处理工具"
      description="提供智能翻译、文本生成、单位换算等多种文字处理功能"
      features={features}
      gridCols={{
        sm: 2,
        lg: 3,
        xl: 4,
        "2xl": 5,
      }}
    />
  );
}
