'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '../ui/badge';
import { communityApi } from '@/api/community';

interface Tag {
  name: string;
  count: number;
}

export default function TagCloud() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await communityApi.getPopularTags(10);
        if (response.data) {
          setTags(response.data);
        }
      } catch (error) {
        console.error('获取标签失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTags();
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
    <div className='flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant='outline'
          className='hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
        >
          <Link
            href={`/subpackages/community/tags/community/tag/${encodeURIComponent(
              tag.name
            )}`}
            className='flex items-center'
          >
            <span>{tag.name}</span>
            <span className='ml-1 text-xs text-gray-500 dark:text-gray-400'>
              ({tag.count})
            </span>
          </Link>
        </Badge>
      ))}
    </div>
  );
}