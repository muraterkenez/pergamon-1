import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type FarmProfile = Database['public']['Tables']['farm_profile']['Row'];

export function useFarmProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getFarmProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_profile')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Çiftlik bilgileri yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateFarmProfile(updates: Partial<FarmProfile>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_profile')
        .update(updates)
        .eq('id', 1) // Tek bir profil kaydı olacağı için id=1
        .select()
        .single();

      if (error) throw error;

      toast.success('Çiftlik bilgileri güncellendi');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Çiftlik bilgileri güncellenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getFarmProfile,
    updateFarmProfile,
  };
}