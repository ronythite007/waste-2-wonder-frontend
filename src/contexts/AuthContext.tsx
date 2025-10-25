import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

interface AuthContextType {
  user: (User & { profile?: Profile }) | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: 'user' | 'creator') => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<(User & { profile?: Profile }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user, isMounted);
      } else {
        if (isMounted) setUser(null);
        if (isMounted) setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user, isMounted);
      } else {
        if (isMounted) setUser(null);
        if (isMounted) setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add isMounted param to avoid setting state on unmounted component
  const fetchUserProfile = async (authUser: User, isMounted: boolean = true) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        if (isMounted) setUser(authUser); // fallback to user without profile
      } else {
        if (isMounted) setUser({ ...authUser, profile });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (isMounted) setUser(authUser);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured. Please click "Connect to Supabase" button in the top right to set up your database connection.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to database. Please check your internet connection and try again.');
        }
        setLoading(false);
        return false;
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Unexpected login error:', error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'user' | 'creator'): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase is not configured. Please click "Connect to Supabase" button in the top right to set up your database connection.');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Unable to connect to database. Please check your internet connection and try again.');
        }
        setLoading(false);
        return false;
      }

      if (data.user) {
        // For signup, we don't need to fetch profile immediately
        // The auth state change listener will handle it
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Unexpected signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
    if (!user?.profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        profile: { ...prev.profile!, ...updates }
      } : null);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading,
      updateProfile,
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
}