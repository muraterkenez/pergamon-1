import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type MilkSession = Database['public']['Tables']['milk_sessions']['Row'];
type MilkRecord = Database['public']['Tables']['milk_records']['Row'];
type MilkQualityTest = Database['public']['Tables']['milk_quality_tests']['Row'];
type MilkTank = Database['public']['Tables']['milk_tanks']['Row'];

export function useMilkProduction() {
  const [sessions, setSessions] = useState<MilkSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  async function fetchTodaySessions() {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('milk_sessions')
        .select(`
          *,
          milk_records (
            *,
            animal:animal_id (
              national_id,
              name
            )
          )
        `)
        .eq('session_date', today)
        .order('start_time', { ascending: false });

      if (error) throw error;

      setSessions(data);
    } catch (error) {
      setError((error as Error).message);
      toast.error('Sağım seansları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }

  async function startSession(sessionType: 'morning' | 'evening') {
    try {
      const { data, error } = await supabase
        .from('milk_sessions')
        .insert({
          session_date: new Date().toISOString().split('T')[0],
          session_type: sessionType,
          start_time: new Date().toISOString(),
          milker_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setSessions([data, ...sessions]);
      toast.success('Sağım seansı başlatıldı');
      return data;
    } catch (error) {
      toast.error('Sağım seansı başlatılamadı');
      throw error;
    }
  }

  async function endSession(sessionId: string, totalMilk: number) {
    try {
      const { data, error } = await supabase
        .from('milk_sessions')
        .update({
          end_time: new Date().toISOString(),
          total_milk: totalMilk
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      setSessions(sessions.map(session =>
        session.id === sessionId ? data : session
      ));
      
      toast.success('Sağım seansı tamamlandı');
      return data;
    } catch (error) {
      toast.error('Sağım seansı tamamlanamadı');
      throw error;
    }
  }

  async function updateSession(sessionId: string, updates: Partial<MilkSession>) {
    try {
      const { data, error } = await supabase
        .from('milk_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select(`
          *,
          milk_records (
            *,
            animal:animal_id (
              national_id,
              name
            )
          )
        `)
        .single();

      if (error) throw error;

      setSessions(sessions.map(session =>
        session.id === sessionId ? data : session
      ));

      toast.success('Sağım seansı güncellendi');
      return data;
    } catch (error) {
      toast.error('Sağım seansı güncellenemedi');
      throw error;
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      // Önce ilişkili kayıtları sil
      const { error: recordsError } = await supabase
        .from('milk_records')
        .delete()
        .eq('session_id', sessionId);

      if (recordsError) throw recordsError;

      // Sonra seansı sil
      const { error: sessionError } = await supabase
        .from('milk_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) throw sessionError;

      setSessions(sessions.filter(session => session.id !== sessionId));
      toast.success('Sağım seansı silindi');
    } catch (error) {
      toast.error('Sağım seansı silinemedi');
      throw error;
    }
  }

  async function updateMilkRecord(recordId: string, updates: Partial<MilkRecord>) {
    try {
      const { data, error } = await supabase
        .from('milk_records')
        .update(updates)
        .eq('id', recordId)
        .select(`
          *,
          animal:animal_id (
            national_id,
            name
          )
        `)
        .single();

      if (error) throw error;

      // Kayıtları güncelle
      setSessions(sessions.map(session => ({
        ...session,
        milk_records: session.milk_records?.map(record =>
          record.id === recordId ? data : record
        )
      })));

      toast.success('Süt kaydı güncellendi');
      return data;
    } catch (error) {
      toast.error('Süt kaydı güncellenemedi');
      throw error;
    }
  }

  async function deleteMilkRecord(recordId: string, sessionId: string) {
    try {
      const { error } = await supabase
        .from('milk_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      // Kayıtları güncelle
      setSessions(sessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            milk_records: session.milk_records?.filter(record => record.id !== recordId)
          };
        }
        return session;
      }));

      toast.success('Süt kaydı silindi');
    } catch (error) {
      toast.error('Süt kaydı silinemedi');
      throw error;
    }
  }

  return {
    sessions,
    loading,
    error,
    fetchTodaySessions,
    startSession,
    endSession,
    updateSession,
    deleteSession,
    updateMilkRecord,
    deleteMilkRecord
  };
}