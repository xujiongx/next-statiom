"use client";

import { DigitalHuman } from "@/components/ui/digital-human";

export default function DigitalHumanPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">3D数字人模型</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            体验逼真的3D数字人模型，支持多种动画和交互控制。
            使用Three.js技术实现高质量的3D渲染效果。
          </p>
        </div>

        <DigitalHuman className="w-full" />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">技术特性</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 基于Three.js的3D渲染引擎</li>
              <li>• 支持GLTF模型格式加载</li>
              <li>• 实时动画播放和控制</li>
              <li>• 交互式相机控制</li>
              <li>• 高质量光照和阴影效果</li>
              <li>• 响应式设计，适配多种设备</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">应用场景</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 虚拟助手和客服系统</li>
              <li>• 在线教育虚拟讲师</li>
              <li>• 游戏角色展示</li>
              <li>• 产品演示和营销</li>
              <li>• 数字人交互体验</li>
              <li>• 虚拟现实应用</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">当前模型信息</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">模型名称:</p>
              <p className="font-medium">机器人表情模型 (RobotExpressive)</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">模型来源:</p>
              <p className="font-medium">Three.js官方示例</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">支持动画:</p>
              <p className="font-medium">多种表情和动作动画</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">文件格式:</p>
              <p className="font-medium">GLTF (.glb)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}