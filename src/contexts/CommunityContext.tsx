import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { CommunityPost, PostComment, Profile } from '../lib/supabase';

interface CommunityContextType {
  posts: CommunityPost[];
  loading: boolean;
  addPost: (post: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>) => Promise<CommunityPost | null>;
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
  const [posts, setPosts] = useState<CommunityPost[]>([]);
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

      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData: Omit<CommunityPost, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'profiles' | 'post_likes' | 'post_comments' | 'post_bookmarks'>): Promise<CommunityPost | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
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

      setPosts(prev => [data, ...prev]);
      return data;
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
      const isLiked = post?.post_likes?.some(like => like.user_id === userId);

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
          const currentLikes = post.post_likes || [];
          const newLikes = isLiked
            ? currentLikes.filter(like => like.user_id !== userId)
            : [...currentLikes, { user_id: userId }];
          
          return { ...post, post_likes: newLikes };
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

      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const currentComments = post.post_comments || [];
          return {
            ...post,
            post_comments: [...currentComments, data]
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
      const isBookmarked = post?.post_bookmarks?.some(bookmark => bookmark.user_id === userId);

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
          const currentBookmarks = post.post_bookmarks || [];
          const newBookmarks = isBookmarked
            ? currentBookmarks.filter(bookmark => bookmark.user_id !== userId)
            : [...currentBookmarks, { user_id: userId }];
          
          return { ...post, post_bookmarks: newBookmarks };
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