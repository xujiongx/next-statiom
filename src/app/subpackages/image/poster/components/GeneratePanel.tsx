import { Button } from '@/components/ui/button';
import { Download, Palette, Loader2 } from 'lucide-react';

interface GeneratePanelProps {
  loading: boolean;
  posterImage: string | null;
  onGenerate: () => void;
  onDownload: () => void;
}

export function GeneratePanel({
  loading,
  posterImage,
  onGenerate,
  onDownload,
}: GeneratePanelProps) {
  return (
    <div className='space-y-4'>
      <div className='flex space-x-4 mb-6'>
        <Button
          onClick={onGenerate}
          className='flex-1'
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              生成中...
            </>
          ) : (
            <>
              <Palette className='mr-2 h-4 w-4' />
              生成海报
            </>
          )}
        </Button>
        <Button
          variant='outline'
          onClick={onDownload}
          disabled={loading || !posterImage}
        >
          <Download className='mr-2 h-4 w-4' />
          下载
        </Button>
      </div>

      {/* 显示生成的海报预览 */}
      {posterImage && (
        <div>
          <h3 className='text-lg font-medium mb-3'>生成结果</h3>
          <div className='border rounded-lg p-2 bg-gray-50 dark:bg-gray-900'>
            <img
              src={posterImage}
              alt='生成的海报'
              className='max-w-full h-auto mx-auto'
              style={{ maxHeight: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}