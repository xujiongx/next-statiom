"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Edit, FileText, Heading, Languages } from "lucide-react";

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
  ];

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold mb-6">文字处理</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Link key={feature.id} href={feature.path}>
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                {feature.icon}
                <div>
                  <h2 className="font-semibold">{feature.title}</h2>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
