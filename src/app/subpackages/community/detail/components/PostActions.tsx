import { MoreVertical, Edit, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface PostActionsProps {
  postId: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function PostActions({ onEdit, onDelete }: PostActionsProps) {
  return (
    <div className='sticky top-24'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800'
          >
            <MoreVertical className='h-5 w-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuItem onClick={onEdit} className='cursor-pointer'>
            <Edit className='mr-2 h-4 w-4' />
            编辑
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            className='cursor-pointer text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
