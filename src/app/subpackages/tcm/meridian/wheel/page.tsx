'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Calculator, Info, RotateCcw, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  TWELVE_HOURS,
  BAGUA_DATA,
  EIGHT_POINTS,
  MERIDIAN_TIMING,
  DAY_STEM_VALUES,
  DAY_BRANCH_VALUES,
  TIME_STEM_VALUES,
  TIME_BRANCH_VALUES,
  YANG_STEMS,
  TIME_GANZHI_TABLE,
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES
} from './const';

interface CalculationResult {
  point: string;
  pairedPoint: string;
  remainder: number;
  calculation: string;
  meridianTiming: string;
}

// 人体穴位坐标定义 - 修正版
const BODY_POINTS = {
  // 手部穴位（更精确的解剖位置）
  '内关': { x: 32, y: 42, side: 'front' }, // 前臂掌侧，腕横纹上2寸
  '外关': { x: 68, y: 42, side: 'front' }, // 前臂背侧，腕背横纹上2寸  
  '列缺': { x: 28, y: 48, side: 'front' }, // 前臂桡侧缘，桡骨茎突上方
  '后溪': { x: 72, y: 52, side: 'front' }, // 手掌尺侧，第五掌指关节后方
  
  // 足部穴位（按照标准解剖定位）
  '公孙': { x: 42, y: 87, side: 'front' }, // 足内侧缘，第一跖骨基底部前下方
  '照海': { x: 38, y: 89, side: 'front' }, // 足内侧，内踝尖下方凹陷处
  '临泣': { x: 58, y: 87, side: 'front' }, // 足背侧，第四五跖骨结合部前方
  '申脉': { x: 62, y: 89, side: 'front' }  // 足外侧，外踝尖下方凹陷处
};

export default function WheelPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'wheel' | 'calculator' | 'body'>('wheel');
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  // 更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取当前时辰
  const getCurrentHour = (date: Date) => {
    const hour = date.getHours();
    if (hour >= 23 || hour < 1) return 0; // 子时
    if (hour >= 1 && hour < 3) return 1;  // 丑时
    if (hour >= 3 && hour < 5) return 2;  // 寅时
    if (hour >= 5 && hour < 7) return 3;  // 卯时
    if (hour >= 7 && hour < 9) return 4;  // 辰时
    if (hour >= 9 && hour < 11) return 5; // 巳时
    if (hour >= 11 && hour < 13) return 6; // 午时
    if (hour >= 13 && hour < 15) return 7; // 未时
    if (hour >= 15 && hour < 17) return 8; // 申时
    if (hour >= 17 && hour < 19) return 9; // 酉时
    if (hour >= 19 && hour < 21) return 10; // 戌时
    return 11; // 亥时
  };

  // 简化的干支计算（实际应用中需要更精确的万年历算法）
  const getGanZhi = (date: Date) => {
    const baseDate = new Date('2000-01-01'); // 庚辰年甲子日
    const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const dayGanIndex = (daysDiff + 6) % 10; // 甲子日的天干索引
    const dayZhiIndex = (daysDiff + 6) % 12; // 甲子日的地支索引
    
    const dayGan = HEAVENLY_STEMS[dayGanIndex];
    const dayZhi = EARTHLY_BRANCHES[dayZhiIndex];
    
    // 时干支计算
    const hourIndex = getCurrentHour(date);
    let timeGanZhiKey = '';
    if (dayGan === '甲' || dayGan === '己') timeGanZhiKey = '甲己';
    else if (dayGan === '乙' || dayGan === '庚') timeGanZhiKey = '乙庚';
    else if (dayGan === '丙' || dayGan === '辛') timeGanZhiKey = '丙辛';
    else if (dayGan === '丁' || dayGan === '壬') timeGanZhiKey = '丁壬';
    else timeGanZhiKey = '戊癸';
    
    const timeGanZhi = TIME_GANZHI_TABLE[timeGanZhiKey][hourIndex];
    const timeGan = timeGanZhi[0];
    const timeZhi = timeGanZhi[1];
    
    return { dayGan, dayZhi, timeGan, timeZhi };
  };

  // 灵龟八法计算
  const calculateLingguiBafa = (date: Date) => {
    const { dayGan, dayZhi, timeGan, timeZhi } = getGanZhi(date);
    
    const dayGanValue = DAY_STEM_VALUES[dayGan] || 0;
    const dayZhiValue = DAY_BRANCH_VALUES[dayZhi] || 0;
    const timeGanValue = TIME_STEM_VALUES[timeGan] || 0;
    const timeZhiValue = TIME_BRANCH_VALUES[timeZhi] || 0;
    
    const sum = dayGanValue + dayZhiValue + timeGanValue + timeZhiValue;
    const isYangDay = YANG_STEMS.includes(dayGan);
    const divisor = isYangDay ? 9 : 6;
    const remainder = sum % divisor || divisor;
    
    // 根据余数找到对应的穴位
    const baguaPoint = BAGUA_DATA.find(b => b.number === remainder);
    const pointName = baguaPoint?.point || '';
    
    // 处理特殊情况（余数为5时男女不同）
    let finalPoint = pointName;
    let pairedPoint = '';
    
    if (remainder === 5) {
      finalPoint = '照海/内关'; // 男照海，女内关
      pairedPoint = '列缺/公孙';
    } else if (pointName && EIGHT_POINTS[pointName as keyof typeof EIGHT_POINTS]) {
      const pointInfo = EIGHT_POINTS[pointName as keyof typeof EIGHT_POINTS];
      finalPoint = pointInfo.name;
      pairedPoint = pointInfo.pairedPoint;
    }
    
    const calculation = `(${dayGan}${dayGanValue} + ${dayZhi}${dayZhiValue} + ${timeGan}${timeGanValue} + ${timeZhi}${timeZhiValue}) ÷ ${divisor} = ${sum} ÷ ${divisor} = 余${remainder}`;
    
    // 获取当前时辰对应的经络
    const hourIndex = getCurrentHour(date);
    const meridianInfo = MERIDIAN_TIMING[hourIndex];
    
    return {
      point: finalPoint,
      pairedPoint,
      remainder,
      calculation,
      meridianTiming: `${meridianInfo.time}(${meridianInfo.meridian})`
    };
  };

  // 处理计算
  const handleCalculate = () => {
    if (!selectedDate || !selectedTime) return;
    
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hour, minute] = selectedTime.split(':').map(Number);
    const date = new Date(year, month - 1, day, hour, minute);
    
    const result = calculateLingguiBafa(date);
    setCalculationResult(result);
  };

  // 获取当前开穴信息
  const currentResult = calculateLingguiBafa(currentTime);
  const currentHourIndex = getCurrentHour(currentTime);
  const currentHourInfo = TWELVE_HOURS[currentHourIndex];

  // 圆盘角度计算
  const getAngle = (index: number, total: number) => {
    return (index * 360) / total - 90; // -90度使12点方向为起点
  };

  // 人体图组件 - 改进版
  const HumanBodyDiagram = () => {
    return (
      <div className="space-y-6">
        {/* 人体正面图 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">八脉八穴人体定位图</h3>
          <div className="relative w-full max-w-md mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-auto border rounded-lg bg-gray-50">
              {/* 改进的人体轮廓 */}
              <g stroke="#374151" strokeWidth="0.5" fill="none">
                {/* 头部 */}
                <circle cx="50" cy="12" r="6" />
                {/* 颈部 */}
                <line x1="50" y1="18" x2="50" y2="22" strokeWidth="3" />
                {/* 躯干 - 更符合人体比例 */}
                <rect x="40" y="22" width="20" height="32" rx="3" />
                
                {/* 左臂 - 改进的解剖结构 */}
                <g className="left-arm">
                  {/* 上臂 */}
                  <line x1="40" y1="28" x2="25" y2="38" strokeWidth="2" />
                  {/* 前臂 */}
                  <line x1="25" y1="38" x2="18" y2="52" strokeWidth="2" />
                  {/* 手部 */}
                  <ellipse cx="18" cy="54" rx="2" ry="3" />
                  {/* 腕部标记 */}
                  <line x1="20" y1="50" x2="24" y2="50" stroke="#9ca3af" strokeWidth="0.5" />
                </g>
                
                {/* 右臂 - 对称设计 */}
                <g className="right-arm">
                  {/* 上臂 */}
                  <line x1="60" y1="28" x2="75" y2="38" strokeWidth="2" />
                  {/* 前臂 */}
                  <line x1="75" y1="38" x2="82" y2="52" strokeWidth="2" />
                  {/* 手部 */}
                  <ellipse cx="82" cy="54" rx="2" ry="3" />
                  {/* 腕部标记 */}
                  <line x1="76" y1="50" x2="80" y2="50" stroke="#9ca3af" strokeWidth="0.5" />
                </g>
                
                {/* 左腿 - 改进的比例 */}
                <g className="left-leg">
                  {/* 大腿 */}
                  <line x1="44" y1="54" x2="38" y2="75" strokeWidth="3" />
                  {/* 小腿 */}
                  <line x1="38" y1="75" x2="32" y2="90" strokeWidth="2" />
                  {/* 足部 */}
                  <ellipse cx="30" cy="92" rx="4" ry="2" />
                  {/* 踝部标记 */}
                  <circle cx="34" cy="88" r="1" fill="none" stroke="#9ca3af" strokeWidth="0.5" />
                </g>
                
                {/* 右腿 - 对称设计 */}
                <g className="right-leg">
                  {/* 大腿 */}
                  <line x1="56" y1="54" x2="62" y2="75" strokeWidth="3" />
                  {/* 小腿 */}
                  <line x1="62" y1="75" x2="68" y2="90" strokeWidth="2" />
                  {/* 足部 */}
                  <ellipse cx="70" cy="92" rx="4" ry="2" />
                  {/* 踝部标记 */}
                  <circle cx="66" cy="88" r="1" fill="none" stroke="#9ca3af" strokeWidth="0.5" />
                </g>
              </g>
              
              {/* 穴位标注 - 改进版 */}
              {Object.entries(BODY_POINTS).map(([pointName, coords]) => {
                const point = EIGHT_POINTS[pointName as keyof typeof EIGHT_POINTS];
                if (!point) return null;
                
                const isActive = pointName === currentResult.point || 
                               pointName === currentResult.pairedPoint ||
                               pointName === selectedPoint;
                
                return (
                  <g key={pointName}>
                    {/* 穴位点 - 增大可点击区域 */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="2.5"
                      fill={isActive ? point.color : '#ffffff'}
                      stroke={point.color}
                      strokeWidth="1.5"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedPoint(pointName)}
                    />
                    {/* 穴位名称 - 改进字体大小和位置 */}
                    <text
                      x={coords.x}
                      y={coords.y - 5}
                      textAnchor="middle"
                      className={`text-xs font-medium ${isActive ? 'fill-red-600' : 'fill-gray-700'}`}
                      style={{ fontSize: '3.5px', fontWeight: 'bold' }}
                    >
                      {pointName}
                    </text>
                    {/* 激活状态的指示线 */}
                    {isActive && (
                      <g>
                        <line
                          x1={coords.x}
                          y1={coords.y}
                          x2={coords.x + 10}
                          y2={coords.y - 10}
                          stroke={point.color}
                          strokeWidth="1"
                          strokeDasharray="2,1"
                        />
                        <circle
                          cx={coords.x + 10}
                          cy={coords.y - 10}
                          r="1"
                          fill={point.color}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
              
              {/* 经络走向线条 - 按照中医理论修正 */}
              <g stroke="#6b7280" strokeWidth="0.4" fill="none" opacity="0.7">
                {/* 手太阴肺经 - 列缺穴经络走向 */}
                <path 
                  d="M 28 48 Q 32 45 36 40 Q 40 35 44 30" 
                  strokeDasharray="2,1" 
                  className="lung-meridian"
                />
                
                {/* 手厥阴心包经 - 内关穴经络走向 */}
                <path 
                  d="M 32 42 Q 36 38 40 32 Q 44 28 48 25" 
                  strokeDasharray="2,1" 
                  className="pericardium-meridian"
                />
                
                {/* 手少阳三焦经 - 外关穴经络走向 */}
                <path 
                  d="M 68 42 Q 64 38 60 32 Q 56 28 52 25" 
                  strokeDasharray="2,1" 
                  className="triple-heater-meridian"
                />
                
                {/* 手太阳小肠经 - 后溪穴经络走向 */}
                <path 
                  d="M 72 52 Q 76 48 80 42 Q 84 38 88 32" 
                  strokeDasharray="2,1" 
                  className="small-intestine-meridian"
                />
                
                {/* 足太阴脾经 - 公孙穴经络走向 */}
                <path 
                  d="M 42 87 Q 40 82 38 75 Q 36 65 38 55" 
                  strokeDasharray="2,1" 
                  className="spleen-meridian"
                />
                
                {/* 足少阴肾经 - 照海穴经络走向 */}
                <path 
                  d="M 38 89 Q 40 84 42 78 Q 44 70 46 60" 
                  strokeDasharray="2,1" 
                  className="kidney-meridian"
                />
                
                {/* 足少阳胆经 - 临泣穴经络走向 */}
                <path 
                  d="M 58 87 Q 60 82 62 75 Q 64 65 62 55" 
                  strokeDasharray="2,1" 
                  className="gallbladder-meridian"
                />
                
                {/* 足太阳膀胱经 - 申脉穴经络走向 */}
                <path 
                  d="M 62 89 Q 60 84 58 78 Q 56 70 54 60" 
                  strokeDasharray="2,1" 
                  className="bladder-meridian"
                />
              </g>
              
              {/* 奇经八脉连接线 - 新增 */}
              <g stroke="#dc2626" strokeWidth="0.3" fill="none" opacity="0.5">
                {/* 冲脉-阴维脉连接（公孙-内关） */}
                <path 
                  d="M 42 87 Q 37 65 32 42" 
                  strokeDasharray="3,2" 
                  className="chong-yinwei-connection"
                />
                
                {/* 阳维脉-带脉连接（外关-临泣） */}
                <path 
                  d="M 68 42 Q 63 65 58 87" 
                  strokeDasharray="3,2" 
                  className="yangwei-dai-connection"
                />
                
                {/* 任脉-阴跷脉连接（列缺-照海） */}
                <path 
                  d="M 28 48 Q 33 69 38 89" 
                  strokeDasharray="3,2" 
                  className="ren-yinqiao-connection"
                />
                
                {/* 督脉-阳跷脉连接（后溪-申脉） */}
                <path 
                  d="M 72 52 Q 67 71 62 89" 
                  strokeDasharray="3,2" 
                  className="du-yangqiao-connection"
                />
              </g>
            </svg>
          </div>
          
          {/* 图例 */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>当前开穴</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-400 bg-white"></div>
              <span>其他穴位</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-gray-400" style={{borderTop: '1px dashed'}}></div>
              <span>经络走向</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>选中穴位</span>
            </div>
          </div>
        </Card>
        
        {/* 穴位配对关系图 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">八脉八穴配对关系</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { master: '公孙', paired: '内关', vessel: '冲脉-阴维脉', color: '#dc2626' },
              { master: '外关', paired: '临泣', vessel: '阳维脉-带脉', color: '#15803d' },
              { master: '列缺', paired: '照海', vessel: '任脉-阴跷脉', color: '#dc2626' },
              { master: '后溪', paired: '申脉', vessel: '督脉-阳跷脉', color: '#9333ea' }
            ].map((pair, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: pair.color }}
                    ></div>
                    <span className="font-medium">{pair.master}</span>
                    <span className="text-gray-400">⟷</span>
                    <span className="font-medium">{pair.paired}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">{pair.vessel}</div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* 时辰经络对应表 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">十二时辰经络流注</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
            {MERIDIAN_TIMING.map((item, index) => {
              const isActive = index === currentHourIndex;
              return (
                <div 
                  key={item.time}
                  className={`p-2 rounded border text-center ${
                    isActive ? 'bg-red-50 border-red-200 text-red-800' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="font-medium">{item.time}</div>
                  <div className="text-xs mt-1">{item.meridian}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="container p-4 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm/meridian" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">流注八法盘</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          流注八法盘结合子午流注和灵龟八法，通过可视化圆盘和人体配图展示时辰开穴规律，是中医时间针灸学的重要工具。
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={activeTab === 'wheel' ? "default" : "outline"}
            onClick={() => setActiveTab('wheel')}
          >
            <Clock className="h-4 w-4 mr-2" />
            实时圆盘
          </Button>
          <Button 
            variant={activeTab === 'calculator' ? "default" : "outline"}
            onClick={() => setActiveTab('calculator')}
          >
            <Calculator className="h-4 w-4 mr-2" />
            开穴计算
          </Button>
          <Button 
            variant={activeTab === 'body' ? "default" : "outline"}
            onClick={() => setActiveTab('body')}
          >
            <User className="h-4 w-4 mr-2" />
            人体配图
          </Button>
        </div>
      </div>

      {activeTab === 'body' ? (
        <HumanBodyDiagram />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 圆盘可视化 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">八法圆盘</h3>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
            
            <div className="relative w-80 h-80 mx-auto">
              {/* 外圈 - 十二时辰 */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r="150" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="160" cy="160" r="120" fill="none" stroke="#d1d5db" strokeWidth="1" />
                <circle cx="160" cy="160" r="90" fill="none" stroke="#d1d5db" strokeWidth="1" />
                
                {/* 十二时辰标记 */}
                {TWELVE_HOURS.map((hour, index) => {
                  const angle = getAngle(index, 12);
                  const radian = (angle * Math.PI) / 180;
                  const x = 160 + 135 * Math.cos(radian);
                  const y = 160 + 135 * Math.sin(radian);
                  const isActive = index === currentHourIndex;
                  
                  return (
                    <g key={hour.name}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="12" 
                        fill={isActive ? '#ef4444' : '#f3f4f6'}
                        stroke={isActive ? '#dc2626' : '#d1d5db'}
                        strokeWidth="2"
                      />
                      <text 
                        x={x} 
                        y={y + 4} 
                        textAnchor="middle" 
                        className={`text-xs font-medium ${isActive ? 'fill-white' : 'fill-gray-700'}`}
                      >
                        {hour.name[0]}
                      </text>
                    </g>
                  );
                })}
                
                {/* 八卦穴位 */}
                {BAGUA_DATA.filter(b => b.number !== 5).map((bagua, index) => {
                  const angle = getAngle(index, 8);
                  const radian = (angle * Math.PI) / 180;
                  const x = 160 + 105 * Math.cos(radian);
                  const y = 160 + 105 * Math.sin(radian);
                  const isActive = bagua.point === currentResult.point || 
                                  bagua.point === currentResult.pairedPoint;
                  
                  return (
                    <g key={bagua.name}>
                      <circle 
                        cx={x} 
                        cy={y} 
                        r="16" 
                        fill={isActive ? bagua.color : '#ffffff'}
                        stroke={bagua.color}
                        strokeWidth="2"
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => setSelectedPoint(bagua.point)}
                      />
                      <text 
                        x={x} 
                        y={y - 2} 
                        textAnchor="middle" 
                        className={`text-xs font-medium ${isActive ? 'fill-white' : 'fill-gray-700'}`}
                      >
                        {bagua.name}
                      </text>
                      <text 
                        x={x} 
                        y={y + 8} 
                        textAnchor="middle" 
                        className={`text-xs ${isActive ? 'fill-white' : 'fill-gray-600'}`}
                      >
                        {bagua.number}
                      </text>
                    </g>
                  );
                })}
                
                {/* 中心指针 */}
                <g>
                  <circle cx="160" cy="160" r="8" fill="#dc2626" />
                  <line 
                    x1="160" 
                    y1="160" 
                    x2={160 + 80 * Math.cos((getAngle(currentHourIndex, 12) * Math.PI) / 180)} 
                    y2={160 + 80 * Math.sin((getAngle(currentHourIndex, 12) * Math.PI) / 180)}
                    stroke="#dc2626" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            
            {/* 当前状态显示 */}
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600 mb-2">
                当前时辰：{currentHourInfo.name} ({currentHourInfo.time})
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant="default" className="bg-red-500">
                  {currentResult.point}
                </Badge>
                {currentResult.pairedPoint && (
                  <Badge variant="outline">
                    配 {currentResult.pairedPoint}
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* 信息面板 */}
          <div className="space-y-4">
            {activeTab === 'calculator' ? (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">开穴计算器</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">选择日期</label>
                    <Input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">选择时间</label>
                    <Input 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCalculate} className="w-full">
                    计算开穴
                  </Button>
                  
                  {calculationResult && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">计算结果</h4>
                      <div className="text-sm space-y-1">
                        <p><span className="font-medium">计算过程：</span>{calculationResult.calculation}</p>
                        <p><span className="font-medium">开穴：</span>{calculationResult.point}</p>
                        <p><span className="font-medium">配穴：</span>{calculationResult.pairedPoint}</p>
                        <p><span className="font-medium">时辰经络：</span>{calculationResult.meridianTiming}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">当前开穴信息</h3>
                <div className="space-y-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-800">
                      <p><span className="font-medium">计算：</span>{currentResult.calculation}</p>
                      <p><span className="font-medium">开穴：</span>{currentResult.point}</p>
                      <p><span className="font-medium">配穴：</span>{currentResult.pairedPoint}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <p><span className="font-medium">时辰：</span>{currentResult.meridianTiming}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            
            {/* 穴位详情 */}
            {selectedPoint && EIGHT_POINTS[selectedPoint as keyof typeof EIGHT_POINTS] && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">穴位详情</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedPoint(null)}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                {(() => {
                  const point = EIGHT_POINTS[selectedPoint as keyof typeof EIGHT_POINTS];
                  return (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-lg" style={{color: point.color}}>
                          {point.name}
                        </h4>
                        <p className="text-sm text-gray-600">{point.meridian}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm"><span className="font-medium">定位：</span>{point.location}</p>
                        <p className="text-sm"><span className="font-medium">配穴：</span>{point.pairedPoint}</p>
                        <p className="text-sm"><span className="font-medium">奇经：</span>{point.vessel}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">主治：</p>
                        <div className="flex flex-wrap gap-1">
                          {point.indications.map((indication) => (
                            <Badge key={indication} variant="outline" className="text-xs">
                              {indication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>
            )}
            
            {/* 使用说明 */}
            <Card className="p-6">
              <div className="flex items-center mb-3">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold">使用说明</h3>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>• 红色指针指向当前时辰，对应的穴位为当前开穴</p>
                <p>• 点击圆盘或人体图上的穴位可查看详细信息</p>
                <p>• 使用计算器可查询任意时间的开穴情况</p>
                <p>• 人体配图显示八脉八穴的精确定位和经络走向</p>
                <p>• 灵龟八法按日时干支计算，子午流注按时辰经络</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}