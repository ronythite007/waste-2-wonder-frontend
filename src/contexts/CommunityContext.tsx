import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { CommunityPost, PostComment, Profile } from '../lib/supabase';

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface ExtendedCommunityPost extends Omit<CommunityPost, 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'> {
  author: Author;
  likes: string[];
  comments: any[];
  bookmarks: string[];
  createdAt?: string;
}

interface CommunityContextType {
  posts: ExtendedCommunityPost[];
  loading: boolean;
  addPost: (post: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>) => Promise<ExtendedCommunityPost | null>;
  updatePost: (id: string, post: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  likePost: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, comment: { content: string }) => Promise<void>;
  bookmarkPost: (postId: string, userId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ExtendedCommunityPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshPosts();
    }
  }, [user]);

  const refreshPosts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar,
            role
          ),
          post_likes (
            user_id
          ),
          post_comments (
            id,
            user_id,
            content,
            created_at,
            profiles:user_id (
              id,
              name,
              avatar
            )
          ),
          post_bookmarks (
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        return;
      }

      // Filter out any null/invalid posts and transform profiles to author
      const validPosts = (data || []).filter(post => post && post.user_id).map(post => ({
        ...post,
        author: {
          name: post.profiles?.name || 'Unknown User',
          avatar: post.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.email || 'default'}`,
          role: post.profiles?.role || 'user'
        },
        likes: post.post_likes?.map((like: any) => like.user_id) || [],
        comments: (post.post_comments || []).map((comment: any) => ({
          ...comment,
          author: {
            name: comment.profiles?.name || 'Unknown User',
            avatar: comment.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.profiles?.name || 'default'}`
          }
        })),
        bookmarks: post.post_bookmarks?.map((bookmark: any) => bookmark.user_id) || []
      }));
      setPosts(validPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>): Promise<ExtendedCommunityPost | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          title: postData.title,
          description: postData.description,
          image: postData.image,
          category: postData.category,
          materials: postData.materials,
          time_spent: postData.timeSpent,
          difficulty: postData.difficulty,
          tags: postData.tags,
          tips: postData.tips,
          user_id: user.id,
        }])
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar,
            role
          ),
          post_likes (
            user_id
          ),
          post_comments (
            id,
            user_id,
            content,
            created_at,
            profiles:user_id (
              id,
              name,
              avatar
            )
          ),
          post_bookmarks (
            user_id
          )
        `)
        .single();

      if (error) {
        console.error('Error adding post:', error);
        return null;
      }

      // Transform the post with author info
      const transformedPost: ExtendedCommunityPost = {
        ...data,
        author: {
          name: data.profiles?.name || user.profile?.name || 'Unknown User',
          avatar: data.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.profiles?.email || user.email || 'default'}`,
          role: data.profiles?.role || user.profile?.role || 'user'
        },
        likes: data.post_likes?.map((like: any) => like.user_id) || [],
        comments: data.post_comments || [],
        bookmarks: data.post_bookmarks?.map((bookmark: any) => bookmark.user_id) || []
      };

      setPosts(prev => [transformedPost, ...prev]);
      return transformedPost;
    } catch (error) {
      console.error('Error adding post:', error);
      return null;
    }
  };

  const updatePost = async (id: string, postData: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('community_posts')
        .update(postData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating post:', error);
        return false;
      }

      setPosts(prev => prev.map(post => 
        post.id === id 
          ? { ...post, ...postData }
          : post
      ));

      return true;
    } catch (error) {
      console.error('Error updating post:', error);
      return false;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting post:', error);
        return false;
      }

      setPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  };

  const likePost = async (postId: string, userId: string): Promise<void> => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.likes?.includes(userId) || false;

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error unliking post:', error);
          return;
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) {
          console.error('Error liking post:', error);
          return;
        }
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentLikes = post.likes || [];
          const newLikes = isLiked
            ? currentLikes.filter(id => id !== userId)
            : [...currentLikes, userId];
          
          return { ...post, likes: newLikes };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const addComment = async (postId: string, comment: { content: string }): Promise<void> => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content: comment.content,
        }])
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) {
        console.error('Error adding comment:', error);
        return;
      }

      // Update local state with transformed comment
      const transformedComment = {
        ...data,
        author: {
          name: data.profiles?.name || 'Unknown User',
          avatar: data.profiles?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.profiles?.name || 'default'}`
        }
      };

      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentComments = post.comments || [];
          return {
            ...post,
            comments: [...currentComments, transformedComment]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const bookmarkPost = async (postId: string, userId: string): Promise<void> => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      const isBookmarked = post?.bookmarks?.includes(userId) || false;

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('post_bookmarks')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error removing bookmark:', error);
          return;
        }
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('post_bookmarks')
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) {
          console.error('Error adding bookmark:', error);
          return;
        }
      }

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentBookmarks = post.bookmarks || [];
          const newBookmarks = isBookmarked
            ? currentBookmarks.filter(id => id !== userId)
            : [...currentBookmarks, userId];
          
          return { ...post, bookmarks: newBookmarks };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <CommunityContext.Provider value={{
      posts,
      loading,
      addPost,
      updatePost,
      deletePost,
      likePost,
      addComment,
      bookmarkPost,
      refreshPosts
    }}>
      {children}
    </CommunityContext.Provider>
  );
}