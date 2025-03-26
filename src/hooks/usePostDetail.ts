import { useState, useEffect } from 'react';
import { communityApi } from '@/api/community';
import { Post, MyComment } from '@/types/community';

export function usePostDetail(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPost = async () => {
    try {
      const response = await communityApi.getPostById(postId);
      setPost(response.data);
    } catch (error) {
      console.error('获取帖子详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (page: number = 1) => {
    setLoadingComments(true);
    try {
      const response = await communityApi.getPostComments(postId, page);
      setComments(response.data.comments);
      setTotal(response.data.pagination.total);
    } catch (error) {
      console.error('获取评论列表失败:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  return {
    post,
    loading,
    fetchPost,
    comments,
    loadingComments,
    fetchComments,
    total,
  };
}


