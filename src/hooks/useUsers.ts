import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type User = Database['public']['Tables']['users']['Row'];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data);
    } catch (error) {
      setError((error as Error).message);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string, updates: Partial<User>) {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      ));
      
      toast.success('Kullanıcı güncellendi');
    } catch (error) {
      toast.error('Kullanıcı güncellenirken hata oluştu');
      throw error;
    }
  }

  async function deleteUser(id: string) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== id));
      toast.success('Kullanıcı silindi');
    } catch (error) {
      toast.error('Kullanıcı silinirken hata oluştu');
      throw error;
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    deleteUser
  };
}