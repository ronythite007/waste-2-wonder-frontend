import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { WasteItem, Suggestion } from '../lib/supabase';

interface WasteContextType {
  wasteItems: WasteItem[];
  suggestions: Suggestion[];
  savedSuggestions: Suggestion[];
  loading: boolean;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  addWasteItem: (item: Omit<WasteItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<WasteItem | null>;
  generateSuggestions: (wasteId: string) => Promise<Suggestion[]>;
  getUserWasteItems: (userId: string) => WasteItem[];
  refreshWasteItems: () => Promise<void>;
  canProceed: (hasImage: boolean) => boolean;
  fetchSavedSuggestions: () => Promise<void>;
  getSavedSuggestions: () => Suggestion[];
}

const WasteContext = createContext<WasteContextType | undefined>(undefined);

export function useWaste() {
  const context = useContext(WasteContext);
  if (!context) {
    throw new Error('useWaste must be used within a WasteProvider');
  }
  return context;
}

export function WasteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [savedSuggestions, setSavedSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSavedSuggestions = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('saved_suggestions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSavedSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching saved suggestions:', error);
    }
  };

  const getSavedSuggestions = () => savedSuggestions;

  useEffect(() => {
    if (user) {
      refreshWasteItems();
      fetchSuggestions();
      fetchSavedSuggestions();
    }
  }, [user]);

  const refreshWasteItems = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching waste items:', error);
        return;
      }

      setWasteItems(data || []);
    } catch (error) {
      console.error('Error fetching waste items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching suggestions:', error);
        return;
      }

      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const addWasteItem = async (item: Omit<WasteItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WasteItem | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('waste_items')
        .insert([{
          ...item,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding waste item:', error);
        return null;
      }

      setWasteItems(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding waste item:', error);
      return null;
    }
  };

  const generateSuggestions = async (wasteId: string): Promise<Suggestion[]> => {
    const wasteItem = wasteItems.find(item => item.id === wasteId);
    if (!wasteItem) return [];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate mock suggestions based on waste item
    const baseProjects = [
      {
        title: `Eco-Friendly Planter from ${wasteItem.type}`,
        description: `Transform your ${wasteItem.type} into a beautiful, sustainable planter perfect for herbs, succulents, or small flowering plants.`,
        tools: ['Electric drill with bits', 'Sandpaper (120 & 220 grit)', 'Paint brushes', 'Measuring tape', 'Pencil'],
        materials: ['Drainage gravel or pebbles', 'Potting soil', 'Acrylic paint (optional)', 'Primer', 'Waterproof sealant', 'Small plants or seeds'],
        steps: [
          'Clean the container thoroughly with soap and water, removing all labels and residue',
          'Mark drainage hole locations on the bottom (4-6 holes for small containers, more for larger ones)',
          'Drill drainage holes using appropriate drill bit size (6-8mm diameter)',
          'Sand all rough edges and surfaces with 120-grit, then 220-grit sandpaper for smooth finish',
          'Apply primer if painting, let dry completely (2-4 hours)',
          'Paint with 2-3 thin coats of acrylic paint, allowing each coat to dry',
          'Apply waterproof sealant to protect against moisture damage',
          'Add a layer of drainage material (gravel/pebbles) at the bottom',
          'Fill with appropriate potting soil, leaving 2cm from the top',
          'Plant your chosen plants and water gently'
        ],
        difficulty: 'Easy' as const,
        time_required: '2-4 hours (including drying time)',
        estimated_cost: '$15-25',
        safety_tips: [
          'Wear safety glasses when drilling',
          'Use dust mask when sanding',
          'Work in well-ventilated area when painting',
          'Keep tools away from children'
        ],
        video_search_query: `DIY ${wasteItem.category.toLowerCase()} planter tutorial`,
        eco_impact: {
          co2Saved: 2.5,
          wasteReduced: 0.8,
          energySaved: 1.2
        }
      },
      {
        title: `Multi-Purpose Storage Organizer`,
        description: `Create a versatile storage solution perfect for organizing office supplies, craft materials, or household items.`,
        tools: ['Sharp craft knife', 'Metal ruler', 'Cutting mat', 'Pencil', 'Hot glue gun', 'Scissors'],
        materials: ['Decorative paper or fabric', 'Strong adhesive', 'Velcro strips', 'Labels', 'Cardboard dividers', 'Felt pads'],
        steps: [
          'Measure and mark the desired height for your organizer',
          'Cut the container to size using craft knife and ruler for clean edges',
          'Sand or file all cut edges until smooth to prevent injury',
          'Plan compartment layout and measure divider positions',
          'Cut cardboard dividers to fit snugly inside the container',
          'Cover dividers with decorative paper or fabric using adhesive',
          'Install dividers using hot glue, ensuring they are secure and level',
          'Cover exterior with chosen decorative material, smoothing out air bubbles',
          'Add felt pads to the bottom to protect surfaces',
          'Create and attach labels for each compartment',
          'Test fit with intended items and adjust as needed'
        ],
        difficulty: 'Medium' as const,
        time_required: '3-5 hours',
        estimated_cost: '$10-20',
        safety_tips: [
          'Use cutting mat to protect work surface',
          'Keep fingers away from blade when cutting',
          'Use hot glue gun carefully to avoid burns',
          'Ensure good ventilation when using adhesives'
        ],
        video_search_query: `DIY storage organizer from ${wasteItem.category.toLowerCase()}`,
        eco_impact: {
          co2Saved: 1.8,
          wasteReduced: 0.6,
          energySaved: 0.9
        }
      },
      {
        title: `Upcycled Art Sculpture`,
        description: `Transform your waste item into a unique piece of decorative art that showcases creativity and environmental consciousness.`,
        tools: ['Craft knife set', 'Hot glue gun with sticks', 'Paint brushes (various sizes)', 'Palette knife', 'Spray bottle'],
        materials: ['Acrylic paints (primary colors)', 'Canvas or wooden backing', 'Protective varnish', 'Decorative elements (beads, buttons)', 'Texture paste', 'Gold leaf (optional)'],
        steps: [
          'Clean the item thoroughly and let dry completely',
          'Sketch your artistic concept on paper, considering the item\'s shape and features',
          'Prepare your workspace with protective covering and good lighting',
          'Cut and shape the item as needed for your design using appropriate tools',
          'Apply primer if necessary for better paint adhesion',
          'Create base layer with main colors, allowing each layer to dry',
          'Add texture using palette knife and texture paste for dimension',
          'Apply detailed work with smaller brushes for intricate elements',
          'Attach decorative elements using hot glue gun',
          'Add highlights and shadows to create depth and interest',
          'Apply protective varnish in thin, even coats',
          'Mount on backing material if creating wall art',
          'Sign and date your finished artwork'
        ],
        difficulty: 'Hard' as const,
        time_required: '6-10 hours (spread over multiple sessions)',
        estimated_cost: '$20-35',
        safety_tips: [
          'Work in well-ventilated area',
          'Wear apron to protect clothing',
          'Keep hot glue gun on stand when not in use',
          'Clean brushes immediately after use'
        ],
        video_search_query: `upcycled art project ${wasteItem.category.toLowerCase()} sculpture`,
        eco_impact: {
          co2Saved: 4.1,
          wasteReduced: 1.2,
          energySaved: 2.0
        }
      }
    ];

    // Select relevant projects based on category and condition
    const relevantProjects = baseProjects.filter(project => {
      if (wasteItem.category === 'Organic') return false;
      if (wasteItem.condition === 'Poor') return project.difficulty !== 'Easy';
      return true;
    }).slice(0, 3);

    try {
      const suggestionsToInsert = relevantProjects.map(project => ({
        waste_id: wasteId,
        ...project
      }));

      const { data, error } = await supabase
        .from('suggestions')
        .insert(suggestionsToInsert)
        .select();

      if (error) {
        console.error('Error saving suggestions:', error);
        return [];
      }

      setSuggestions(prev => [...prev, ...(data || [])]);
      return data || [];
    } catch (error) {
      console.error('Error generating suggestions:', error);
      return [];
    }
  };

  const getUserWasteItems = (userId: string) => {
    return wasteItems.filter(item => item.user_id === userId);
  };

  // Function to determine if user can proceed based on image state
  const canProceed = (hasImage: boolean): boolean => {
    if (!hasImage) return true; // If no image is selected, user can proceed
    return !isUploading; // If image is selected, can only proceed if not uploading
  };

  return (
    <WasteContext.Provider value={{
      wasteItems,
      suggestions,
      savedSuggestions,
      loading,
      isUploading,
      setIsUploading,
      addWasteItem,
      generateSuggestions,
      getUserWasteItems,
      refreshWasteItems,
      canProceed,
      fetchSavedSuggestions,
      getSavedSuggestions
    }}>
      {children}
    </WasteContext.Provider>
  );
}