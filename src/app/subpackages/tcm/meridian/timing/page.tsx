'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sun, Moon, Sunrise, Sunset } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface TimeSlot {
    time: string;
    period: string;
    meridian: string;
    organ: string;
    element: string;
    nature: 'yin' | 'yang';
    description: string;
    advice: string;
    icon: string;
}

const timeSlots: TimeSlot[] = [
    {
        time: '23:00-01:00',
        period: '子时',
        meridian: '足少阳胆经',
        organ: '胆',
        element: '木',
        nature: 'yang',
        description: '胆经当令，胆汁新陈代谢最旺盛的时候',
        advice: '宜安睡，忌熬夜。此时入睡有利于胆汁代谢',
        icon: '🌙'
    },
    {
        time: '01:00-03:00',
        period: '丑时',
        meridian: '足厥阴肝经',
        organ: '肝',
        element: '木',
        nature: 'yin',
        description: '肝经当令，肝脏解毒排毒的最佳时间',
        advice: '深度睡眠时间，肝脏进行解毒和血液净化',
        icon: '🌚'
    },
    {
        time: '03:00-05:00',
        period: '寅时',
        meridian: '手太阴肺经',
        organ: '肺',
        element: '金',
        nature: 'yin',
        description: '肺经当令，肺部功能最强的时候',
        advice: '深度睡眠，肺部进行气体交换和净化',
        icon: '🌌'
    },
    {
        time: '05:00-07:00',
        period: '卯时',
        meridian: '手阳明大肠经',
        organ: '大肠',
        element: '金',
        nature: 'yang',
        description: '大肠经当令，排便的最佳时间',
        advice: '宜起床排便，喝温开水促进肠道蠕动',
        icon: '🌅'
    },
    {
        time: '07:00-09:00',
        period: '辰时',
        meridian: '足阳明胃经',
        organ: '胃',
        element: '土',
        nature: 'yang',
        description: '胃经当令，胃部消化功能最强',
        advice: '宜吃早餐，营养丰富易消化为佳',
        icon: '☀️'
    },
    {
        time: '09:00-11:00',
        period: '巳时',
        meridian: '足太阴脾经',
        organ: '脾',
        element: '土',
        nature: 'yin',
        description: '脾经当令，脾脏运化功能最强',
        advice: '适合工作学习，脾主思，思维最敏捷',
        icon: '🌞'
    },
    {
        time: '11:00-13:00',
        period: '午时',
        meridian: '手少阴心经',
        organ: '心',
        element: '火',
        nature: 'yin',
        description: '心经当令，心脏功能最强盛',
        advice: '宜午休，养心安神，忌剧烈运动',
        icon: '🌤️'
    },
    {
        time: '13:00-15:00',
        period: '未时',
        meridian: '手太阳小肠经',
        organ: '小肠',
        element: '火',
        nature: 'yang',
        description: '小肠经当令，小肠分清浊功能最强',
        advice: '适合午餐后消化，宜清淡饮食',
        icon: '☀️'
    },
    {
        time: '15:00-17:00',
        period: '申时',
        meridian: '足太阳膀胱经',
        organ: '膀胱',
        element: '水',
        nature: 'yang',
        description: '膀胱经当令，膀胱储尿功能最强',
        advice: '多喝水，促进新陈代谢和排毒',
        icon: '🌅'
    },
    {
        time: '17:00-19:00',
        period: '酉时',
        meridian: '足少阴肾经',
        organ: '肾',
        element: '水',
        nature: 'yin',
        description: '肾经当令，肾脏过滤血液功能最强',
        advice: '宜休息，忌过度劳累，保护肾精',
        icon: '🌇'
    },
    {
        time: '19:00-21:00',
        period: '戌时',
        meridian: '手厥阴心包经',
        organ: '心包',
        element: '火',
        nature: 'yin',
        description: '心包经当令，心包保护心脏功能最强',
        advice: '宜轻松愉快，散步聊天，准备入睡',
        icon: '🌆'
    },
    {
        time: '21:00-23:00',
        period: '亥时',
        meridian: '手少阳三焦经',
        organ: '三焦',
        element: '火',
        nature: 'yang',
        description: '三焦经当令，三焦通调水道功能最强',
        advice: '宜安静，准备睡眠，调节情绪',
        icon: '🌃'
    }
];

export default function TimingPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentSlot, setCurrentSlot] = useState<TimeSlot | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const hour = currentTime.getHours();
        const slotIndex = Math.floor(hour / 2);
        setCurrentSlot(timeSlots[slotIndex]);
    }, [currentTime]);

    const getCurrentProgress = () => {
        const hour = currentTime.getHours();
        const minute = currentTime.getMinutes();
        const slotStart = Math.floor(hour / 2) * 2;
        const progressInSlot = ((hour - slotStart) * 60 + minute) / 120 * 100;
        return Math.min(progressInSlot, 100);
    };

    const getTimeIcon = (hour: number) => {
        if (hour >= 6 && hour < 12) return <Sunrise className="h-4 w-4" />;
        if (hour >= 12 && hour < 18) return <Sun className="h-4 w-4" />;
        if (hour >= 18 && hour < 22) return <Sunset className="h-4 w-4" />;
        return <Moon className="h-4 w-4" />;
    };

    return (
        <div className="container p-6 max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/subpackages/tcm/meridian" className="mr-4">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold">子午流注</h1>
            </div>

            <div className="mb-8">
                <p className="text-gray-600 text-center mb-6">
                    子午流注是中医学按时间治疗的方法，根据十二时辰经络气血的盛衰规律，选择适当的时间进行治疗和养生。
                </p>
            </div>

            {/* 当前时辰 */}
            {currentSlot && (
                <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">{currentSlot.icon}</div>
                            <div>
                                <h2 className="text-xl font-bold">{currentSlot.period} - {currentSlot.meridian}</h2>
                                <p className="text-gray-600">{currentTime.toLocaleTimeString('zh-CN', { hour12: false })}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <Badge variant={currentSlot.nature === 'yin' ? 'secondary' : 'default'} className="mb-2">
                                {currentSlot.nature === 'yin' ? '阴经' : '阳经'}
                            </Badge>
                            <p className="text-sm text-gray-600">{currentSlot.element}行</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>当前时辰进度</span>
                            <span>{Math.round(getCurrentProgress())}%</span>
                        </div>
                        <Progress value={getCurrentProgress()} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">经络特点</h3>
                            <p className="text-sm text-gray-700">{currentSlot.description}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">养生建议</h3>
                            <p className="text-sm text-gray-700">{currentSlot.advice}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* 十二时辰表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeSlots.map((slot, index) => {
                    const isActive = currentSlot?.period === slot.period;

                    return (
                        <Card
                            key={slot.period}
                            className={`p-4 transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{slot.icon}</span>
                                    <div>
                                        <h3 className="font-semibold">{slot.period}</h3>
                                        <p className="text-xs text-gray-500">{slot.time}</p>
                                    </div>
                                </div>
                                {getTimeIcon(index * 2 + 1)}
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{slot.meridian}</span>
                                    <Badge variant={slot.nature === 'yin' ? 'secondary' : 'default'} className="text-xs">
                                        {slot.nature === 'yin' ? '阴' : '阳'}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-600">{slot.organ} · {slot.element}行</p>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 mb-1">特点</h4>
                                    <p className="text-xs text-gray-600">{slot.description}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 mb-1">建议</h4>
                                    <p className="text-xs text-gray-600">{slot.advice}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* 养生要点 */}
            <Card className="p-6 mt-8">
                <h2 className="text-lg font-semibold mb-4">子午流注养生要点</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl mb-2">⏰</div>
                        <h3 className="font-medium mb-1">顺应时令</h3>
                        <p className="text-xs text-gray-600">按照经络气血流注规律安排作息</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">🍽️</div>
                        <h3 className="font-medium mb-1">合理饮食</h3>
                        <p className="text-xs text-gray-600">在相应时辰调养对应脏腑</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">😴</div>
                        <h3 className="font-medium mb-1">规律作息</h3>
                        <p className="text-xs text-gray-600">子时前入睡，卯时起床排便</p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl mb-2">🧘</div>
                        <h3 className="font-medium mb-1">情志调节</h3>
                        <p className="text-xs text-gray-600">在不同时辰调节相应情绪</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}