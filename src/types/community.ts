import { UploadedImage } from '@/components/ui/image-upload';

export interface Author {
  id: string;
  nickname: string;
  image: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  tags: string[];
  author: Author;
  comments: MyComment[];
  new_comment: MyComment;
  likes: unknown[];
  images: UploadedImage[];
}

export interface MyComment {
  id: string;
  content: string;
  created_at: string;
  author: Author;
  parent_comment?: MyComment;
}
