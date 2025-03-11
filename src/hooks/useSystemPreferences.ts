import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type SystemPreference = Database['public']['Tables']['system_preferences']['Row'];

export function useSystemPreferences() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getSystemPreferences() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_preferences')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Sistem tercihleri yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateSystemPreferences(updates: Partial<SystemPreference>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('system_preferences')
        .update(updates)
        .eq('id', 1) // Tek bir tercih kaydı olacağı için id=1
        .select()
        .single();

      if (error) throw error;

      toast.success('Sistem tercihleri güncellendi');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Sistem tercihleri güncellenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getSystemPreferences,
    updateSystemPreferences,
  };
}