'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface EightMethod {
  id: string;
  name: string;
  masterPoint: string;
  coupledPoint: string;
  meridian: string;
  indications: string[];
  timeRange: string;
}

const eightMethods: EightMethod[] = [
  {
    id: 'gongxun',
    name: '公孙',
    masterPoint: '公孙',
    coupledPoint: '内关',
    meridian: '足太阴脾经',
    indications: ['胃脘痛', '呕吐', '腹胀', '泄泻', '痢疾'],
    timeRange: '申时开穴'
  },
  {
    id: 'neiguan',
    name: '内关',
    masterPoint: '内关',
    coupledPoint: '公孙',
    meridian: '手厥阴心包经',
    indications: ['心痛', '胸闷', '心悸', '失眠', '癫狂'],
    timeRange: '戌时开穴'
  },
  {
    id: 'houxi',
    name: '后溪',
    masterPoint: '后溪',
    coupledPoint: '申脉',
    meridian: '手太阳小肠经',
    indications: ['头项强痛', '腰背痛', '癫痫', '疟疾'],
    timeRange: '卯时开穴'
  },
  {
    id: 'shenmai',
    name: '申脉',
    masterPoint: '申脉',
    coupledPoint: '后溪',
    meridian: '足太阳膀胱经',
    indications: ['头痛', '眩晕', '腰腿痛', '癫痫'],
    timeRange: '酉时开穴'
  },
  {
    id: 'linqi',
    name: '临泣',
    masterPoint: '临泣',
    coupledPoint: '外关',
    meridian: '足少阳胆经',
    indications: ['偏头痛', '目疾', '耳聋', '胁痛'],
    timeRange: '子时开穴'
  },
  {
    id: 'waiguan',
    name: '外关',
    masterPoint: '外关',
    coupledPoint: '临泣',
    meridian: '手少阳三焦经',
    indications: ['头痛', '耳鸣', '胁痛', '手臂痛'],
    timeRange: '午时开穴'
  },
  {
    id: 'lieque',
    name: '列缺',
    masterPoint: '列缺',
    coupledPoint: '照海',
    meridian: '手太阴肺经',
    indications: ['咳嗽', '气喘', '咽喉痛', '头项痛'],
    timeRange: '巳时开穴'
  },
  {
    id: 'zhaohai',
    name: '照海',
    masterPoint: '照海',
    coupledPoint: '列缺',
    meridian: '足少阴肾经',
    indications: ['咽喉痛', '失眠', '癫痫', '月经不调'],
    timeRange: '亥时开穴'
  }
];

export default function LingguibafaPage() {
  const [selectedMethod, setSelectedMethod] = useState<EightMethod | null>(null);
  const [calculatorMode, setCalculatorMode] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [treatmentDate, setTreatmentDate] = useState('');
  const [result, setResult] = useState<string>('');

  const calculateOpenPoint = () => {
    if (!birthDate || !treatmentDate) return;
    
    // 简化的计算逻辑（实际应用中需要更复杂的算法）
    const birth = new Date(birthDate);
    const treatment = new Date(treatmentDate);
    const daysDiff = Math.floor((treatment.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const methodIndex = daysDiff % 8;
    const selectedMethod = eightMethods[methodIndex];
    
    setResult(`建议开穴：${selectedMethod.masterPoint} 配 ${selectedMethod.coupledPoint}`);
  };

  return (
    <div className="container p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm/meridian" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">灵龟八法</h1>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          灵龟八法是古代针灸学中按时开穴的重要方法，根据干支纪时和八卦理论，选择特定时间开启相应的奇经八脉穴位。
        </p>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant={!calculatorMode ? "default" : "outline"}
            onClick={() => setCalculatorMode(false)}
          >
            八法详解
          </Button>
          <Button 
            variant={calculatorMode ? "default" : "outline"}
            onClick={() => setCalculatorMode(true)}
          >
            <Calculator className="h-4 w-4 mr-2" />
            开穴计算
          </Button>
        </div>
      </div>

      {calculatorMode ? (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">开穴时间计算</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">出生日期</label>
              <Input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">治疗日期</label>
              <Input 
                type="date" 
                value={treatmentDate}
                onChange={(e) => setTreatmentDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={calculateOpenPoint} className="w-full mb-4">
            计算开穴
          </Button>
          {result && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">{result}</p>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eightMethods.map((method) => (
            <Card 
              key={method.id} 
              className={`p-4 cursor-pointer transition-all ${
                selectedMethod?.id === method.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedMethod(method)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{method.name}</h3>
                <Badge variant="outline">{method.timeRange}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{method.meridian}</p>
              <p className="text-sm mb-3">
                <span className="font-medium">配穴：</span>
                {method.masterPoint} + {method.coupledPoint}
              </p>
              <div className="flex flex-wrap gap-1">
                {method.indications.slice(0, 3).map((indication) => (
                  <Badge key={indication} variant="secondary" className="text-xs">
                    {indication}
                  </Badge>
                ))}
                {method.indications.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{method.indications.length - 3}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedMethod && !calculatorMode && (
        <Card className="p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">{selectedMethod.name}详解</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">基本信息</h4>
              <ul className="space-y-1 text-sm">
                <li><span className="font-medium">主穴：</span>{selectedMethod.masterPoint}</li>
                <li><span className="font-medium">配穴：</span>{selectedMethod.coupledPoint}</li>
                <li><span className="font-medium">经络：</span>{selectedMethod.meridian}</li>
                <li><span className="font-medium">开穴时间：</span>{selectedMethod.timeRange}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">主治病症</h4>
              <div className="flex flex-wrap gap-1">
                {selectedMethod.indications.map((indication) => (
                  <Badge key={indication} variant="outline" className="text-xs">
                    {indication}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}