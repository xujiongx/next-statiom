'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge'

interface Tag {
  name: string;
  count: number;
}

export default function TagCloud() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // 模拟API调用
    setLoading(true);
    
    // 这里应该是真实的API调用，现在用模拟数据
    setTimeout(() => {
      const mockTags: Tag[] = [
        { name: 'AI工具', count: 42 },
        { name: '技巧分享', count: 36 },
        { name: '效率提升', count: 28 },
        { name: '问题解决', count: 24 },
        { name: '新手指南', count: 19 },
        { name: '资源推荐', count: 15 },
        { name: '经验分享', count: 12 },
        { name: '创意应用', count: 10 },
      ];
      
      setTags(mockTags);
      setLoading(false);
    }, 800);
  }, []);
  
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge 
          key={tag.name} 
          variant="outline"
          className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        >
          <Link href={`/community/tag/${encodeURIComponent(tag.name)}`} className="flex items-center">
            <span>{tag.name}</span>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({tag.count})</span>
          </Link>
        </Badge>
      ))}
    </div>
  );
}