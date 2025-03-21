import { Users, MessageSquare, TrendingUp } from "lucide-react";

export default function CommunityHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">AI工具箱社区</h1>
      <p className="text-blue-100 mb-6">
        分享您的AI使用经验，探讨最新技术，寻求帮助和建议
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          <div>
            <p className="text-lg font-semibold">1,234</p>
            <p className="text-sm text-blue-100">社区成员</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          <div>
            <p className="text-lg font-semibold">5,678</p>
            <p className="text-sm text-blue-100">讨论帖子</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          <div>
            <p className="text-lg font-semibold">987</p>
            <p className="text-sm text-blue-100">本周活跃</p>
          </div>
        </div>
      </div>
    </div>
  );
}