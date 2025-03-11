import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type BackupConfig = Database['public']['Tables']['backup_config']['Row'];
type BackupHistory = Database['public']['Tables']['backup_history']['Row'];

export function useBackupSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getBackupConfig() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('backup_config')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedekleme ayarları yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateBackupConfig(updates: Partial<BackupConfig>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('backup_config')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();

      if (error) throw error;

      toast.success('Yedekleme ayarları güncellendi');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedekleme ayarları güncellenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getBackupHistory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('backup_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedekleme geçmişi yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function createBackup() {
    try {
      setLoading(true);
      // Burada gerçek yedekleme işlemi yapılacak
      const { data, error } = await supabase.rpc('create_backup');

      if (error) throw error;

      toast.success('Yedekleme başarıyla oluşturuldu');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedekleme oluşturulurken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function restoreBackup(backupId: string) {
    try {
      setLoading(true);
      // Burada gerçek geri yükleme işlemi yapılacak
      const { data, error } = await supabase.rpc('restore_backup', {
        backup_id: backupId,
      });

      if (error) throw error;

      toast.success('Yedek başarıyla geri yüklendi');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedek geri yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteBackup(backupId: string) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('backup_history')
        .delete()
        .eq('id', backupId);

      if (error) throw error;

      toast.success('Yedek başarıyla silindi');
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Yedek silinirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getBackupConfig,
    updateBackupConfig,
    getBackupHistory,
    createBackup,
    restoreBackup,
    deleteBackup,
  };
}