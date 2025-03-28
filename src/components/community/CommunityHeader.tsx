"use client"

import { useState, useEffect } from "react"
import { Users, MessageSquare, TrendingUp } from "lucide-react";
import { communityApi } from "@/api/community";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityHeader() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_posts: 0,
    active_users_this_week: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getCommunityStats();
        setStats(response.data);
      } catch (error) {
        console.error("获取社区统计数据失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-4 sm:p-8 text-white overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-white opacity-5 rounded-full -mr-10 sm:-mr-20 -mt-10 sm:-mt-20"></div>
      <div className="absolute bottom-0 left-0 w-20 sm:w-40 h-20 sm:h-40 bg-white opacity-5 rounded-full -ml-5 sm:-ml-10 -mb-5 sm:-mb-10"></div>
      
      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 flex items-center">
          AI工具箱社区
          <span className="ml-2 text-xs bg-blue-400/30 px-2 py-1 rounded-full">Beta</span>
        </h1>
        <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl text-sm sm:text-base">
          分享您的AI使用经验，探讨最新技术，寻求帮助和建议
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center">
          <div className="flex items-center">
            <div className="bg-blue-500/30 p-2 rounded-lg mr-3">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-14 bg-blue-400/30" />
              ) : (
                <p className="text-lg sm:text-xl font-bold">{stats.total_users.toLocaleString()}</p>
              )}
              <p className="text-xs text-blue-200">社区成员</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-indigo-500/30 p-2 rounded-lg mr-3">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-14 bg-blue-400/30" />
              ) : (
                <p className="text-lg sm:text-xl font-bold">{stats.total_posts.toLocaleString()}</p>
              )}
              <p className="text-xs text-blue-200">讨论帖子</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-purple-500/30 p-2 rounded-lg mr-3">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 sm:h-7 w-12 sm:w-14 bg-blue-400/30" />
              ) : (
                <p className="text-lg sm:text-xl font-bold">{stats.active_users_this_week?.toLocaleString()}</p>
              )}
              <p className="text-xs text-blue-200">本周活跃</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}