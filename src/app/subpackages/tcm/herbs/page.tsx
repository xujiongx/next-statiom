"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

interface Herb {
  id: number;
  name: string;
  pinyin: string;
  category: string;
  nature: string;
  flavor: string;
  meridian: string[];
  effects: string[];
  description: string;
  image: string;
}

const herbs: Herb[] = [
  {
    id: 1,
    name: "人参",
    pinyin: "rén shēn",
    category: "补虚药",
    nature: "温",
    flavor: "甘、微苦",
    meridian: ["脾", "肺", "心"],
    effects: ["大补元气", "复脉固脱", "补脾益肺", "生津安神"],
    description: "人参为五加科植物人参的干燥根和根茎，是著名的补气良药。",
    image: "🌿",
  },
  {
    id: 2,
    name: "当归",
    pinyin: "dāng guī",
    category: "补血药",
    nature: "温",
    flavor: "甘、辛",
    meridian: ["肝", "心", "脾"],
    effects: ["补血活血", "调经止痛", "润肠通便"],
    description: "当归为伞形科植物当归的干燥根，有'血中圣药'之称。",
    image: "🌱",
  },
  {
    id: 3,
    name: "黄芪",
    pinyin: "huáng qí",
    category: "补气药",
    nature: "微温",
    flavor: "甘",
    meridian: ["脾", "肺"],
    effects: ["补气升阳", "固表止汗", "利水消肿", "生津养血"],
    description: "黄芪为豆科植物蒙古黄芪或膜荚黄芪的干燥根，是常用的补气药。",
    image: "🌾",
  },
  {
    id: 4,
    name: "枸杞子",
    pinyin: "gǒu qǐ zǐ",
    category: "补阴药",
    nature: "平",
    flavor: "甘",
    meridian: ["肝", "肾"],
    effects: ["滋补肝肾", "益精明目"],
    description: "枸杞子为茄科植物宁夏枸杞的干燥成熟果实，具有很好的滋补作用。",
    image: "🔴",
  },
  {
    id: 5,
    name: "甘草",
    pinyin: "gān cǎo",
    category: "补气药",
    nature: "平",
    flavor: "甘",
    meridian: ["心", "肺", "脾", "胃"],
    effects: ["补脾益气", "清热解毒", "祛痰止咳", "缓急止痛", "调和诸药"],
    description:
      "甘草为豆科植物甘草、胀果甘草或光果甘草的干燥根和根茎，有'国老之称。",
    image: "🌿",
  },
];

export default function HerbsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const categories = ["全部", "补虚药", "补血药", "补气药", "补阴药"];

  const filteredHerbs = herbs.filter((herb) => {
    const matchesSearch =
      herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      herb.pinyin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "全部" || herb.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="flex items-center mb-6">
        <Link href="/subpackages/tcm" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold">中药百科</h1>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索中药名称..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHerbs.map((herb) => (
          <Card key={herb.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{herb.image}</div>
              <h3 className="text-xl font-bold">{herb.name}</h3>
              <p className="text-gray-500">{herb.pinyin}</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">性味：</span>
                <span>
                  {herb.nature} · {herb.flavor}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">归经：</span>
                <div className="flex flex-wrap gap-1">
                  {herb.meridian.map((m) => (
                    <Badge key={m} variant="secondary" className="text-xs">
                      {m}经
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-gray-600">功效：</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {herb.effects.map((effect) => (
                    <Badge key={effect} variant="outline" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-3">{herb.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {filteredHerbs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到相关的中药材</p>
        </div>
      )}
    </div>
  );
}
