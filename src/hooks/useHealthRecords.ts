import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type HealthRecord = Database['public']['Tables']['health_records']['Row'];
type Vaccination = Database['public']['Tables']['vaccinations']['Row'];
type DiseaseCase = Database['public']['Tables']['disease_cases']['Row'];
type BodyScore = Database['public']['Tables']['body_scores']['Row'];
type BiosecurityCheck = Database['public']['Tables']['biosecurity_checks']['Row'];

export function useHealthRecords() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function getAnimalHealthRecords(animalId: string) {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select(`
          *,
          performer:user_details!health_records_performed_by_fkey (
            full_name,
            role
          )
        `)
        .eq('animal_id', animalId)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Sağlık kayıtları yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addHealthRecord(record: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert(record)
        .select()
        .single();

      if (error) throw error;

      toast.success('Sağlık kaydı eklendi');
      return data;
    } catch (error) {
      toast.error('Sağlık kaydı eklenirken hata oluştu');
      throw error;
    }
  }

  async function getVaccinations(animalId: string) {
    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .select(`
          *,
          performer:user_details!vaccinations_performed_by_fkey (
            full_name,
            role
          )
        `)
        .eq('animal_id', animalId)
        .order('application_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Aşı kayıtları yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addVaccination(vaccination: Omit<Vaccination, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .insert(vaccination)
        .select()
        .single();

      if (error) throw error;

      toast.success('Aşı kaydı eklendi');
      return data;
    } catch (error) {
      toast.error('Aşı kaydı eklenirken hata oluştu');
      throw error;
    }
  }

  async function getDiseaseCases(animalId: string) {
    try {
      const { data, error } = await supabase
        .from('disease_cases')
        .select('*')
        .eq('animal_id', animalId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Hastalık kayıtları yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addDiseaseCase(diseaseCase: Omit<DiseaseCase, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('disease_cases')
        .insert(diseaseCase)
        .select()
        .single();

      if (error) throw error;

      toast.success('Hastalık kaydı eklendi');
      return data;
    } catch (error) {
      toast.error('Hastalık kaydı eklenirken hata oluştu');
      throw error;
    }
  }

  async function getBodyScores(animalId: string) {
    try {
      const { data, error } = await supabase
        .from('body_scores')
        .select(`
          *,
          scorer:user_details!body_scores_scored_by_fkey (
            full_name,
            role
          )
        `)
        .eq('animal_id', animalId)
        .order('score_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Vücut kondisyon skorları yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addBodyScore(score: Omit<BodyScore, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('body_scores')
        .insert(score)
        .select()
        .single();

      if (error) throw error;

      toast.success('Vücut kondisyon skoru eklendi');
      return data;
    } catch (error) {
      toast.error('Vücut kondisyon skoru eklenirken hata oluştu');
      throw error;
    }
  }

  async function getBiosecurityChecks() {
    try {
      const { data, error } = await supabase
        .from('biosecurity_checks')
        .select(`
          *,
          performer:user_details!biosecurity_checks_performed_by_fkey (
            full_name,
            role
          )
        `)
        .order('check_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Biyogüvenlik kontrolleri yüklenirken hata oluştu');
      throw error;
    }
  }

  async function addBiosecurityCheck(check: Omit<BiosecurityCheck, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('biosecurity_checks')
        .insert(check)
        .select()
        .single();

      if (error) throw error;

      toast.success('Biyogüvenlik kontrolü eklendi');
      return data;
    } catch (error) {
      toast.error('Biyogüvenlik kontrolü eklenirken hata oluştu');
      throw error;
    }
  }

  return {
    loading,
    error,
    getAnimalHealthRecords,
    addHealthRecord,
    getVaccinations,
    addVaccination,
    getDiseaseCases,
    addDiseaseCase,
    getBodyScores,
    addBodyScore,
    getBiosecurityChecks,
    addBiosecurityCheck
  };
}