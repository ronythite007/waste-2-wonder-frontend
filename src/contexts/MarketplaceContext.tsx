import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Product } from '../lib/supabase';

interface MarketplaceContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'seller_info'>) => Promise<Product | null>;
  updateProduct: (id: string, product: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'seller_info'>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductsByCategory: (category: string) => Product[];
  getProductsByUser: (userId: string) => Product[];
  searchProducts: (query: string) => Product[];
  refreshProducts: () => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      refreshProducts();
    }
  }, [user]);

  const refreshProducts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      // Transform data to include seller info
      const transformedProducts = (data || []).map(product => ({
        ...product,
        seller_info: {
          name: product.profiles?.name || 'Unknown',
          avatar: product.profiles?.avatar || '',
          rating: 4.5, // Mock rating
          joinDate: new Date().toISOString(),
          totalSales: Math.floor(Math.random() * 50) + 1
        }
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'seller_info'>): Promise<Product | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          user_id: user.id,
        }])
        .select(`
          *,
          profiles:user_id (
            id,
            name,
            avatar,
            role
          )
        `)
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return null;
      }

      const transformedProduct = {
        ...data,
        seller_info: {
          name: data.profiles?.name || user.profile?.name || 'Unknown',
          avatar: data.profiles?.avatar || user.profile?.avatar || '',
          rating: 4.5,
          joinDate: user.profile?.join_date || new Date().toISOString(),
          totalSales: 1
        }
      };

      setProducts(prev => [transformedProduct, ...prev]);
      return transformedProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  };

  const updateProduct = async (id: string, productData: Omit<Product, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'seller_info'>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }

      setProducts(prev => prev.map(product => 
        product.id === id 
          ? { ...product, ...productData }
          : product
      ));

      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }

      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsByUser = (userId: string) => {
    return products.filter(product => product.user_id === userId);
  };

  const searchProducts = (query: string) => {
    return products.filter(product => 
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.tags?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <MarketplaceContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductsByCategory,
      getProductsByUser,
      searchProducts,
      refreshProducts
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
}