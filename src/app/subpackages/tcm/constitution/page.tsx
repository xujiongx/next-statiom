'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: number;
  text: string;
  constitution: string;
}

const questions: Question[] = [
  { id: 1, text: "您平时精力充沛吗？", constitution: "平和质" },
  { id: 2, text: "您容易疲劳吗？", constitution: "气虚质" },
  { id: 3, text: "您怕冷，手脚发凉吗？", constitution: "阳虚质" },
  { id: 4, text: "您口燥咽干吗？", constitution: "阴虚质" },
  { id: 5, text: "您面部皮肤油腻吗？", constitution: "痰湿质" },
  { id: 6, text: "您容易烦躁不安吗？", constitution: "湿热质" },
  { id: 7, text: "您感到闷闷不乐、情绪低沉吗？", constitution: "气郁质" },
  { id: 8, text: "您容易忘事吗？", constitution: "血瘀质" },
  { id: 9, text: "您对异味、异物等比较敏感吗？", constitution: "特禀质" },
];

const constitutionDescriptions = {
  "平和质": {
    description: "体质平和，身体健康",
    advice: "保持规律作息，适度运动，饮食均衡"
  },
  "气虚质": {
    description: "元气不足，容易疲劳",
    advice: "多食补气食物如人参、黄芪，避免过度劳累"
  },
  "阳虚质": {
    description: "阳气不足，畏寒怕冷",
    advice: "多食温热食物，注意保暖，适当运动"
  },
  "阴虚质": {
    description: "阴液亏少，容易上火",
    advice: "多食滋阴食物如枸杞、银耳，避免熬夜"
  },
  "痰湿质": {
    description: "痰湿凝聚，形体肥胖",
    advice: "清淡饮食，多运动，少食甜腻食物"
  },
  "湿热质": {
    description: "湿热内蕴，容易长痘",
    advice: "清热利湿，多食绿豆、薏米等"
  },
  "气郁质": {
    description: "气机郁滞，情绪不稳",
    advice: "保持心情愉快，多参加社交活动"
  },
  "血瘀质": {
    description: "血行不畅，容易健忘",
    advice: "活血化瘀，多食山楂、红花等"
  },
  "特禀质": {
    description: "先天禀赋不足，容易过敏",
    advice: "避免过敏原，增强体质"
  }
};

export default function ConstitutionPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (allAnswers: number[]) => {
    const constitutionScores: { [key: string]: number } = {};
    
    questions.forEach((question, index) => {
      const constitution = question.constitution;
      if (!constitutionScores[constitution]) {
        constitutionScores[constitution] = 0;
      }
      constitutionScores[constitution] += allAnswers[index];
    });

    const maxScore = Math.max(...Object.values(constitutionScores));
    const resultConstitution = Object.keys(constitutionScores).find(
      key => constitutionScores[key] === maxScore
    ) || '平和质';

    setResult(resultConstitution);
    setShowResult(true);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setResult('');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResult) {
    const resultInfo = constitutionDescriptions[result as keyof typeof constitutionDescriptions];
    
    return (
      <div className="container p-6 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/subpackages/tcm" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">体质测试结果</h1>
        </div>

        <Card className="p-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">{result}</h2>
            <p className="text-gray-600 text-lg">{resultInfo.description}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">养生建议</h3>
            <p className="text-gray-700">{resultInfo.advice}</p>
          </div>

          <Button onClick={resetTest} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            重新测试
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container p-6 max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">中医体质测试</h1>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>问题 {currentQuestion + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {questions[currentQuestion].text}
        </h2>

        <div className="space-y-3">
          {[
            { text: "完全不符合", score: 1 },
            { text: "基本不符合", score: 2 },
            { text: "有点符合", score: 3 },
            { text: "比较符合", score: 4 },
            { text: "完全符合", score: 5 }
          ].map((option) => (
            <Button
              key={option.score}
              variant="outline"
              className="w-full p-4 text-left justify-start"
              onClick={() => handleAnswer(option.score)}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}