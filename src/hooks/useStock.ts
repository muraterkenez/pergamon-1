import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type StockItem = Database['public']['Tables']['stock_items']['Row'];
type StockMovement = Database['public']['Tables']['stock_movements']['Row'];

export function useStock() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getStockItems() {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Stok kalemleri yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addStockItem(item: Omit<StockItem, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .insert(item)
        .select()
        .single();

      if (error) throw error;

      toast.success('Stok kalemi eklendi');
      return data;
    } catch (error) {
      toast.error('Stok kalemi eklenirken hata oluştu');
      throw error;
    }
  }

  async function updateStockItem(id: string, updates: Partial<StockItem>) {
    try {
      const { data, error } = await supabase
        .from('stock_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Stok kalemi güncellendi');
      return data;
    } catch (error) {
      toast.error('Stok kalemi güncellenirken hata oluştu');
      throw error;
    }
  }

  async function addStockMovement(movement: Omit<StockMovement, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert(movement)
        .select()
        .single();

      if (error) throw error;

      toast.success('Stok hareketi kaydedildi');
      return data;
    } catch (error) {
      toast.error('Stok hareketi kaydedilirken hata oluştu');
      throw error;
    }
  }

  async function getStockMovements(itemId?: string) {
    try {
      let query = supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (itemId) {
        query = query.eq('item_id', itemId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Stok hareketleri yüklenirken hata oluştu');
      throw error;
    }
  }

  async function getLowStockItems() {
    try {
      // Using a filter function instead of raw SQL
      const { data: allItems, error: itemsError } = await supabase
        .from('stock_items')
        .select('*')
        .order('quantity');

      if (itemsError) throw itemsError;

      // Filter items where quantity is less than or equal to min_quantity
      const lowStockItems = allItems.filter(item => item.quantity <= item.min_quantity);
      return lowStockItems;
    } catch (error) {
      toast.error('Düşük stok kalemleri yüklenirken hata oluştu');
      throw error;
    }
  }

  async function getExpiringItems() {
    try {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data, error } = await supabase
        .from('stock_items')
        .select('*')
        .lte('expiry_date', thirtyDaysFromNow.toISOString())
        .gte('expiry_date', new Date().toISOString())
        .order('expiry_date');

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Son kullanma tarihi yaklaşan ürünler yüklenirken hata oluştu');
      throw error;
    }
  }

  return {
    loading,
    error,
    getStockItems,
    addStockItem,
    updateStockItem,
    addStockMovement,
    getStockMovements,
    getLowStockItems,
    getExpiringItems
  };
}