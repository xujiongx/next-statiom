'use client';

import { useState, useEffect } from 'react';
import { Quote, RefreshCw } from 'lucide-react';

interface QuoteData {
  text: string;
  author: string;
}

interface DailyQuoteProps {
  /** 自定义名言数据，如果不提供则使用默认数据 */
  customQuotes?: QuoteData[];
  /** 是否显示刷新按钮 */
  showRefreshButton?: boolean;
  /** 组件标题 */
  title?: string;
  /** 自定义样式类名 */
  className?: string;
  /** 是否自动随机初始化 */
  autoRandomize?: boolean;
}

export default function DailyQuote({
  customQuotes,
  showRefreshButton = true,
  title = '每日一言',
  className = '',
  autoRandomize = true
}: DailyQuoteProps) {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // 默认名言数据
  const defaultQuotes: QuoteData[] = [
    {
      text: "生活就像骑自行车，想保持平衡就得往前走。",
      author: "阿尔伯特·爱因斯坦"
    },
    {
      text: "成功不是终点，失败不是末日，继续前进的勇气才最可贵。",
      author: "温斯顿·丘吉尔"
    },
    {
      text: "你的时间有限，不要为别人而活。",
      author: "史蒂夫·乔布斯"
    },
    {
      text: "今天的成就是昨天的积累，明天的成功有赖于今天的努力。",
      author: "宋庆龄"
    },
    {
      text: "路漫漫其修远兮，吾将上下而求索。",
      author: "屈原"
    },
    {
      text: "不积跬步，无以至千里；不积小流，无以成江海。",
      author: "荀子"
    },
    {
      text: "天行健，君子以自强不息。",
      author: "《周易》"
    },
    {
      text: "学而时习之，不亦说乎？",
      author: "孔子"
    }
  ];

  // 使用自定义名言或默认名言
  const quotes = customQuotes || defaultQuotes;

  // 刷新名言
  const refreshQuote = () => {
    setQuoteLoading(true);
    setTimeout(() => {
      setCurrentQuote(Math.floor(Math.random() * quotes.length));
      setQuoteLoading(false);
    }, 500);
  };

  // 初始化随机名言
  useEffect(() => {
    if (autoRandomize) {
      setCurrentQuote(Math.floor(Math.random() * quotes.length));
    }
  }, [quotes.length, autoRandomize]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className='relative'>
        {/* 背景装饰 */}
        <div className='absolute inset-0 bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-red-50/50 dark:from-amber-900/10 dark:via-orange-900/5 dark:to-red-900/10'></div>
        
        {/* 装饰性引号 */}
        <div className='absolute top-4 left-4 opacity-10 dark:opacity-5'>
          <Quote className='h-16 w-16 text-amber-600 dark:text-amber-400' />
        </div>
        <div className='absolute bottom-4 right-4 opacity-10 dark:opacity-5 rotate-180'>
          <Quote className='h-12 w-12 text-amber-600 dark:text-amber-400' />
        </div>

        <div className='relative p-6'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-center space-x-2'>
              <Quote className='h-5 w-5 text-amber-600 dark:text-amber-400' />
              <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>{title}</h3>
            </div>
            {showRefreshButton && (
              <button
                onClick={refreshQuote}
                disabled={quoteLoading}
                className='p-2 rounded-full bg-amber-100/80 dark:bg-amber-900/30 hover:bg-amber-200/80 dark:hover:bg-amber-800/40 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='刷新名言'
              >
                <RefreshCw className={`h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform ${quoteLoading ? 'animate-spin' : 'hover:rotate-180'}`} />
              </button>
            )}
          </div>

          <div className={`transition-all duration-500 ${quoteLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <blockquote className='text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4 font-medium italic'>
              &quot;{quotes[currentQuote]?.text}&quot;
            </blockquote>
            <div className='flex items-center justify-end'>
              <div className='text-right'>
                <p className='text-sm font-semibold text-amber-700 dark:text-amber-300'>
                  —— {quotes[currentQuote]?.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 导出类型定义
export type { QuoteData, DailyQuoteProps };