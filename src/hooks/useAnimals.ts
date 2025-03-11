import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Animal = Database['public']['Tables']['animals']['Row'];
type AnimalInsert = Database['public']['Tables']['animals']['Insert'];
type AnimalUpdate = Database['public']['Tables']['animals']['Update'];

export function useAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('animals')
        .select(`
          *,
          mother:mother_id(*),
          father:father_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAnimals(data || []);
    } catch (error) {
      setError((error as Error).message);
      toast.error('Hayvanlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function getAnimal(id: string) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select(`
          *,
          mother:mother_id(*),
          father:father_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error('Hayvan bilgileri yüklenirken hata oluştu');
      throw error;
    }
  }

  async function createAnimal(animal: AnimalInsert) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .insert(animal)
        .select()
        .single();

      if (error) throw error;

      setAnimals([data, ...animals]);
      toast.success('Hayvan kaydı oluşturuldu');
      return data;
    } catch (error) {
      toast.error('Hayvan kaydı oluşturulurken hata oluştu');
      throw error;
    }
  }

  async function updateAnimal(id: string, updates: AnimalUpdate) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          mother:mother_id(*),
          father:father_id(*)
        `)
        .single();

      if (error) throw error;

      setAnimals(animals.map(animal => 
        animal.id === id ? data : animal
      ));
      
      toast.success('Hayvan kaydı güncellendi');
      return data;
    } catch (error) {
      toast.error('Hayvan kaydı güncellenirken hata oluştu');
      throw error;
    }
  }

  async function deleteAnimal(id: string) {
    try {
      const { error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAnimals(animals.filter(animal => animal.id !== id));
      toast.success('Hayvan kaydı silindi');
    } catch (error) {
      toast.error('Hayvan kaydı silinirken hata oluştu');
      throw error;
    }
  }

  async function getAnimalsByGroup(group: string) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('group_type', group)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error('Hayvanlar yüklenirken hata oluştu');
      throw error;
    }
  }

  async function getAnimalsByStatus(status: string) {
    try {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      toast.error('Hayvanlar yüklenirken hata oluştu');
      throw error;
    }
  }

  return {
    animals,
    loading,
    error,
    fetchAnimals,
    getAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalsByGroup,
    getAnimalsByStatus
  };
}