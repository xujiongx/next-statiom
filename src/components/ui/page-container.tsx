"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface Feature {
  id: string;
  title: string;
  icon: ReactNode;
  description: string;
  path: string;
}

interface PageContainerProps {
  title: string;
  description: string;
  features: Feature[];
  maxWidth?: string;
  gridCols?: {
    sm?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };
  showDevelopmentTip?: boolean;
  developmentTipText?: string;
}

export default function PageContainer({
  title,
  description,
  features,
  maxWidth = "max-w-7xl",
  gridCols = {
    sm: 2,
    lg: 3,
    xl: 4,
    "2xl": 5,
  },
  showDevelopmentTip = true,
  developmentTipText = "更多功能正在开发中，敬请期待",
}: PageContainerProps) {
  const getGridClasses = () => {
    const baseClasses = "grid grid-cols-1";
    const smClasses = gridCols.sm ? `sm:grid-cols-${gridCols.sm}` : "";
    const lgClasses = gridCols.lg ? `lg:grid-cols-${gridCols.lg}` : "";
    const xlClasses = gridCols.xl ? `xl:grid-cols-${gridCols.xl}` : "";
    const xl2Classes = gridCols["2xl"] ? `2xl:grid-cols-${gridCols["2xl"]}` : "";
    
    return [baseClasses, smClasses, lgClasses, xlClasses, xl2Classes, "gap-6"]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className={`container mx-auto p-6 ${maxWidth}`}>
      {/* 页面标题区域 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* 功能卡片网格 */}
      <div className={getGridClasses()}>
        {features.map((feature) => (
          <Link key={feature.id} href={feature.path}>
            <Card className="group p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50">
              <div className="flex flex-col items-center text-center space-y-4">
                {/* 图标容器 */}
                <div className="p-3 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 group-hover:from-blue-100 group-hover:to-indigo-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-indigo-800/30 transition-all duration-300">
                  <div className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {feature.icon}
                  </div>
                </div>
                
                {/* 文本内容 */}
                <div className="space-y-2">
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* 悬停指示器 */}
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* 底部提示信息 */}
      {showDevelopmentTip && (
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {developmentTipText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}