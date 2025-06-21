'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { meridians, extraordinaryVessels, type MeridianInfo } from './const';

export default function MeridianMapPage() {
    const [selectedMeridian, setSelectedMeridian] = useState<MeridianInfo | null>(null);
    const [activeTab, setActiveTab] = useState('regular');

    return (
        <div className="container p-6 max-w-6xl mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/subpackages/tcm/meridian" className="mr-4">
                    <ArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold">经络图谱</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="regular">十二正经</TabsTrigger>
                    <TabsTrigger value="extraordinary">奇经八脉</TabsTrigger>
                </TabsList>

                <TabsContent value="regular" className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 经络列表 */}
                        <div className="lg:col-span-1">
                            <h3 className="text-lg font-semibold mb-4">选择经络</h3>
                            <div className="space-y-2">
                                {meridians.map((meridian) => (
                                    <Card
                                        key={meridian.id}
                                        className={`p-3 cursor-pointer transition-all ${
                                            selectedMeridian?.id === meridian.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                                        }`}
                                        onClick={() => setSelectedMeridian(meridian)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">{meridian.name}</h4>
                                                <p className="text-sm text-gray-600">{meridian.organ}·{meridian.element}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={meridian.nature === 'yin' ? 'secondary' : 'default'}>
                                                    {meridian.nature === 'yin' ? '阴' : '阳'}
                                                </Badge>
                                                <Badge variant="outline">{meridian.points}穴</Badge>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* 经络详情 */}
                        <div className="lg:col-span-2">
                            {selectedMeridian ? (
                                <Card className="p-6">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xl font-bold">{selectedMeridian.fullName}</h3>
                                            <Badge variant={selectedMeridian.nature === 'yin' ? 'secondary' : 'default'}>
                                                {selectedMeridian.nature === 'yin' ? '阴经' : '阳经'}
                                            </Badge>
                                            <Badge variant="outline">{selectedMeridian.element}行</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="font-medium">所属脏腑：</span>{selectedMeridian.organ}</div>
                                            <div><span className="font-medium">穴位数量：</span>{selectedMeridian.points}个</div>
                                            <div><span className="font-medium">部位：</span>{selectedMeridian.location === 'hand' ? '手部' : '足部'}</div>
                                            <div><span className="font-medium">五行：</span>{selectedMeridian.element}</div>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-2">主要功能</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedMeridian.mainFunctions.map((func) => (
                                                <Badge key={func} variant="outline">{func}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="font-semibold mb-2">循行路径</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{selectedMeridian.pathway}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold mb-3">常用穴位</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {selectedMeridian.commonPoints.map((point) => (
                                                <div key={point.name} className="bg-gray-50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium">{point.name}</span>
                                                        <Badge variant="secondary" className="text-xs">{point.function}</Badge>
                                                    </div>
                                                    <p className="text-xs text-gray-600">{point.location}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="p-12 text-center">
                                    <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-600 mb-2">选择经络查看详情</h3>
                                    <p className="text-gray-500">点击左侧经络名称查看详细信息和穴位分布</p>
                                </Card>
                            )}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="extraordinary" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {extraordinaryVessels.map((vessel) => (
                            <Card key={vessel.name} className="p-6">
                                <h3 className="text-lg font-bold mb-2">{vessel.name}</h3>
                                <p className="text-gray-600 mb-4">{vessel.description}</p>

                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">循行路径</h4>
                                    <p className="text-sm text-gray-700">{vessel.pathway}</p>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">主要功能</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {vessel.functions.map((func) => (
                                            <Badge key={func} variant="outline" className="text-xs">{func}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}