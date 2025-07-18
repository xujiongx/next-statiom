"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftRight,
  Calculator,
  Ruler,
  Weight,
  Thermometer,
  Clock,
  Zap,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ConversionCategory = {
  id: string;
  name: string;
  icon: React.ReactNode;
  units: { [key: string]: { name: string; factor: number; offset?: number } };
};

type ExchangeRates = {
  [key: string]: number;
};

const conversionCategories: ConversionCategory[] = [
  {
    id: "currency",
    name: "货币",
    icon: <DollarSign className="h-5 w-5" />,
    units: {
      USD: { name: "美元 (USD)", factor: 1 },
      EUR: { name: "欧元 (EUR)", factor: 1 },
      GBP: { name: "英镑 (GBP)", factor: 1 },
      JPY: { name: "日元 (JPY)", factor: 1 },
      CNY: { name: "人民币 (CNY)", factor: 1 },
      KRW: { name: "韩元 (KRW)", factor: 1 },
      HKD: { name: "港币 (HKD)", factor: 1 },
      CAD: { name: "加元 (CAD)", factor: 1 },
      AUD: { name: "澳元 (AUD)", factor: 1 },
      CHF: { name: "瑞士法郎 (CHF)", factor: 1 },
      SGD: { name: "新加坡元 (SGD)", factor: 1 },
      INR: { name: "印度卢比 (INR)", factor: 1 },
    },
  },
  {
    id: "length",
    name: "长度",
    icon: <Ruler className="h-5 w-5" />,
    units: {
      mm: { name: "毫米", factor: 1 },
      cm: { name: "厘米", factor: 10 },
      m: { name: "米", factor: 1000 },
      km: { name: "千米", factor: 1000000 },
      inch: { name: "英寸", factor: 25.4 },
      ft: { name: "英尺", factor: 304.8 },
      yard: { name: "码", factor: 914.4 },
      mile: { name: "英里", factor: 1609344 },
    },
  },
  {
    id: "weight",
    name: "重量",
    icon: <Weight className="h-5 w-5" />,
    units: {
      mg: { name: "毫克", factor: 1 },
      g: { name: "克", factor: 1000 },
      kg: { name: "千克", factor: 1000000 },
      t: { name: "吨", factor: 1000000000 },
      oz: { name: "盎司", factor: 28349.5 },
      lb: { name: "磅", factor: 453592 },
      stone: { name: "英石", factor: 6350293 },
    },
  },
  {
    id: "temperature",
    name: "温度",
    icon: <Thermometer className="h-5 w-5" />,
    units: {
      celsius: { name: "摄氏度", factor: 1, offset: 0 },
      fahrenheit: { name: "华氏度", factor: 1.8, offset: 32 },
      kelvin: { name: "开尔文", factor: 1, offset: 273.15 },
    },
  },
  {
    id: "area",
    name: "面积",
    icon: <Calculator className="h-5 w-5" />,
    units: {
      mm2: { name: "平方毫米", factor: 1 },
      cm2: { name: "平方厘米", factor: 100 },
      m2: { name: "平方米", factor: 1000000 },
      km2: { name: "平方千米", factor: 1000000000000 },
      inch2: { name: "平方英寸", factor: 645.16 },
      ft2: { name: "平方英尺", factor: 92903 },
      acre: { name: "英亩", factor: 4046856422.4 },
    },
  },
  {
    id: "time",
    name: "时间",
    icon: <Clock className="h-5 w-5" />,
    units: {
      ms: { name: "毫秒", factor: 1 },
      s: { name: "秒", factor: 1000 },
      min: { name: "分钟", factor: 60000 },
      h: { name: "小时", factor: 3600000 },
      day: { name: "天", factor: 86400000 },
      week: { name: "周", factor: 604800000 },
      month: { name: "月", factor: 2629746000 },
      year: { name: "年", factor: 31556952000 },
    },
  },
  {
    id: "energy",
    name: "能量",
    icon: <Zap className="h-5 w-5" />,
    units: {
      j: { name: "焦耳", factor: 1 },
      kj: { name: "千焦", factor: 1000 },
      cal: { name: "卡路里", factor: 4.184 },
      kcal: { name: "千卡", factor: 4184 },
      wh: { name: "瓦时", factor: 3600 },
      kwh: { name: "千瓦时", factor: 3600000 },
      btu: { name: "英热单位", factor: 1055.06 },
    },
  },
];

export default function ConverterPage() {
  const [selectedCategory, setSelectedCategory] = useState<ConversionCategory>(
    conversionCategories[0],
  );
  const [fromUnit, setFromUnit] = useState<string>("CNY");
  const [toUnit, setToUnit] = useState<string>("USD");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const { toast } = useToast();
  // 获取汇率数据
  const fetchExchangeRates = async () => {
    setIsLoadingRates(true);
    try {
      // 使用免费的汇率API - exchangerate-api.com
      const response = await fetch(
        "https://api.exchangerate-api.com/v4/latest/USD",
      );
      if (!response.ok) {
        throw new Error("获取汇率失败");
      }
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date().toLocaleString("zh-CN"));
      toast({
        title: "汇率更新成功",
      });
    } catch (error) {
      console.error("获取汇率失败:", error);
      toast({
        variant: "destructive",
        title: "获取汇率失败，请检查网络连接",
      });
      // 设置默认汇率（仅作为备用）
      setExchangeRates({
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        CNY: 6.45,
        KRW: 1180,
        HKD: 7.8,
        CAD: 1.25,
        AUD: 1.35,
        CHF: 0.92,
        SGD: 1.35,
        INR: 74.5,
      });
      setLastUpdated("使用默认汇率");
    } finally {
      setIsLoadingRates(false);
    }
  };

  // 组件加载时获取汇率
  useEffect(() => {
    if (selectedCategory.id === "currency") {
      fetchExchangeRates();
    }
  }, [selectedCategory.id]);

  const handleConvert = () => {
    if (!inputValue || !fromUnit || !toUnit) return;

    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    if (selectedCategory.id === "currency") {
      // 货币转换
      const fromRate = exchangeRates[fromUnit] || 1;
      const toRate = exchangeRates[toUnit] || 1;

      // 先转换为USD，再转换为目标货币
      const usdValue = value / fromRate;
      const convertedValue = usdValue * toRate;

      setResult(convertedValue.toFixed(4).replace(/\.?0+$/, ""));
      return;
    }

    const fromUnitData = selectedCategory.units[fromUnit];
    const toUnitData = selectedCategory.units[toUnit];

    if (!fromUnitData || !toUnitData) return;

    let convertedValue: number;

    if (selectedCategory.id === "temperature") {
      // 温度转换需要特殊处理
      if (fromUnit === "celsius" && toUnit === "fahrenheit") {
        convertedValue = value * 1.8 + 32;
      } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
        convertedValue = (value - 32) / 1.8;
      } else if (fromUnit === "celsius" && toUnit === "kelvin") {
        convertedValue = value + 273.15;
      } else if (fromUnit === "kelvin" && toUnit === "celsius") {
        convertedValue = value - 273.15;
      } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
        convertedValue = (value - 32) / 1.8 + 273.15;
      } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
        convertedValue = (value - 273.15) * 1.8 + 32;
      } else {
        convertedValue = value;
      }
    } else {
      // 其他单位转换
      const baseValue = value * fromUnitData.factor;
      convertedValue = baseValue / toUnitData.factor;
    }

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ""));
  };

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setInputValue(result);
    setResult(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    setResult("");
    setFromUnit("");
    setToUnit("");
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          单位换算器
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          支持货币、长度、重量、温度、面积、时间、能量等多种单位的精确转换
        </p>
      </div>

      {/* 分类选择 */}
      <div className="mb-6">
        <Label className="text-base font-medium mb-3 block">选择转换类型</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {conversionCategories.map((category) => (
            <Button
              key={category.id}
              variant={
                selectedCategory.id === category.id ? "default" : "outline"
              }
              className="h-auto p-3 flex flex-col items-center gap-2"
              onClick={() => {
                setSelectedCategory(category);
                // 如果是货币转换，设置默认为人民币转美元
                if (category.id === "currency") {
                  setFromUnit("CNY");
                  setToUnit("USD");
                } else {
                  setFromUnit("");
                  setToUnit("");
                }
                setInputValue("");
                setResult("");
              }}
            >
              {category.icon}
              <span className="text-sm">{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* 货币汇率信息 */}
      {selectedCategory.id === "currency" && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  实时汇率 {lastUpdated && `(更新时间: ${lastUpdated})`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchExchangeRates}
                disabled={isLoadingRates}
                className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${
                    isLoadingRates ? "animate-spin" : ""
                  }`}
                />
                刷新汇率
              </Button>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
              汇率数据来源于 exchangerate-api.com，仅供参考
            </p>
          </CardContent>
        </Card>
      )}

      {/* 转换器主体 */}
      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedCategory.icon}
            {selectedCategory.name}转换
          </CardTitle>
          <CardDescription>在下方输入数值并选择单位进行转换</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 输入区域 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 从单位 */}
            <div className="space-y-3">
              <Label htmlFor="from-value">从</Label>
              <div className="space-y-2">
                <Input
                  id="from-value"
                  type="number"
                  placeholder="输入数值"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-lg"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择单位" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(selectedCategory.units).map(
                      ([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 到单位 */}
            <div className="space-y-3">
              <Label htmlFor="to-value">到</Label>
              <div className="space-y-2">
                <Input
                  id="to-value"
                  type="text"
                  placeholder="转换结果"
                  value={result}
                  readOnly
                  className="text-lg bg-gray-50 dark:bg-slate-700"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择单位" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(selectedCategory.units).map(
                      ([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleConvert}
              disabled={
                !inputValue ||
                !fromUnit ||
                !toUnit ||
                (selectedCategory.id === "currency" && isLoadingRates)
              }
              className="px-8"
            >
              <Calculator className="w-4 h-4 mr-2" />
              转换
            </Button>
            <Button
              variant="outline"
              onClick={handleSwapUnits}
              disabled={!fromUnit || !toUnit}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              交换单位
            </Button>
            <Button variant="outline" onClick={handleClear}>
              清除
            </Button>
          </div>

          {/* 结果显示 */}
          {result && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <p className="text-lg font-medium text-blue-900 dark:text-blue-100">
                  {inputValue} {selectedCategory.units[fromUnit]?.name} ={" "}
                  {result} {selectedCategory.units[toUnit]?.name}
                </p>
                {selectedCategory.id === "currency" && (
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    汇率基于实时数据，仅供参考
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 常用转换提示 */}
      <Card className="mt-6 bg-gray-50 dark:bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-lg">常用转换</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {selectedCategory.id === "currency" ? (
              <div className="col-span-full">
                <h4 className="font-medium mb-2">主要货币</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>USD - 美元</li>
                    <li>EUR - 欧元</li>
                    <li>GBP - 英镑</li>
                  </ul>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>JPY - 日元</li>
                    <li>CNY - 人民币</li>
                    <li>KRW - 韩元</li>
                  </ul>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>HKD - 港币</li>
                    <li>CAD - 加元</li>
                    <li>AUD - 澳元</li>
                  </ul>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>CHF - 瑞士法郎</li>
                    <li>SGD - 新加坡元</li>
                    <li>INR - 印度卢比</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-medium mb-2">长度</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>1 米 = 100 厘米</li>
                    <li>1 千米 = 1000 米</li>
                    <li>1 英寸 = 2.54 厘米</li>
                    <li>1 英尺 = 30.48 厘米</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">重量</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>1 千克 = 1000 克</li>
                    <li>1 吨 = 1000 千克</li>
                    <li>1 磅 = 0.454 千克</li>
                    <li>1 盎司 = 28.35 克</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">温度</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>0°C = 32°F</li>
                    <li>100°C = 212°F</li>
                    <li>0°C = 273.15K</li>
                    <li>室温 ≈ 20°C</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
