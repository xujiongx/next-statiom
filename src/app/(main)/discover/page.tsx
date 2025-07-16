"use client";

import DailyQuote from "@/components/quote/DailyQuote";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WallpaperRecommendation from "@/components/wallpaper/WallpaperRecommendation";
import { Sparkles, Compass, TrendingUp } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-400/15 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/15 to-pink-400/15 dark:from-indigo-500/10 dark:to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/8 to-blue-400/8 dark:from-cyan-500/5 dark:to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* 现代化页面标题 */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-2xl mb-6 shadow-md">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-4">
              发现世界
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              探索精彩内容，发现美好世界，让每一天都充满惊喜与灵感
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                每日更新，精选推荐
              </span>
            </div>
          </div>

          {/* 每日一言组件 */}
          <div className="mb-12 lg:mb-16">
            <DailyQuote />
          </div>

          {/* 今日壁纸推荐模块 */}
          <div className="mb-12 lg:mb-16">
            <WallpaperRecommendation limit={3} className="backdrop-blur-sm" />
          </div>

          {/* 更多精彩内容模块 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 趋势内容卡片 */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm hover:shadow-md transition-all duration-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                    热门趋势
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-100/50 dark:border-orange-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      AI 艺术创作
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      探索人工智能在艺术创作中的无限可能
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100/50 dark:border-blue-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      数字艺术收藏
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      发现独特的数字艺术作品和收藏价值
                    </p>
                  </div>
                  <div className="text-center pt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-full">
                      更多内容即将上线
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 创作工具卡片 */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm hover:shadow-md transition-all duration-500 group">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    创作工具
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-100/50 dark:border-purple-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      AI 图像生成
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      使用先进的AI技术创造独特的视觉作品
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-100/50 dark:border-green-800/50">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      智能编辑
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      强大的图像编辑和优化工具
                    </p>
                  </div>
                  <div className="text-center pt-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-4 py-2 rounded-full">
                      敬请期待
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 底部装饰 */}
          <div className="text-center mt-6 lg:mt-20">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
              <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse" />
              <span>持续更新中</span>
              <div
                className="w-2 h-2 bg-purple-400 dark:bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
