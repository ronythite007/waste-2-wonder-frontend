import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Declare supabase client variable
let supabase;

// Check for environment variables and provide helpful error message
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please ensure you have set up your Supabase project and configured the environment variables:');
  console.error('1. Click "Connect to Supabase" button in the top right');
  console.error('2. Or manually set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  
  // Create a dummy client to prevent app crashes
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export the supabase client
export { supabase };

// Database types
export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'creator' | 'admin';
  avatar?: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface WasteItem {
  id: string;
  user_id: string;
  type: string;
  description: string;
  image?: string;
  category: string;
  condition: string;
  quantity: number;
  location?: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  material?: string;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  id: string;
  waste_id: string;
  title: string;
  description: string;
  tools: string[];
  materials: string[];
  steps: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_required?: string;
  estimated_cost?: string;
  safety_tips: string[];
  video_search_query?: string;
  eco_impact: {
    co2Saved: number;
    wasteReduced: number;
    energySaved: number;
  };
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  type: 'Sale' | 'Donation';
  dimensions?: string;
  weight?: string;
  color?: string;
  material?: string;
  location?: string;
  tags?: string;
  shipping_info?: string;
  return_policy?: string;
  seller_info: any;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  materials?: string;
  time_spent?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  tips?: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  post_likes?: { user_id: string }[];
  post_comments?: PostComment[];
  post_bookmarks?: { user_id: string }[];
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}