import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Animal = Database['public']['Tables']['animals']['Row'];
type MilkSession = Database['public']['Tables']['milk_sessions']['Row'];
type HealthRecord = Database['public']['Tables']['health_records']['Row'];

export function useDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    dailyMilk: 0,
    totalAnimals: 0,
    avgYield: 0,
    monthlyIncome: 0,
  });
  const [alerts, setAlerts] = useState<{
    id: string;
    title: string;
    description: string;
    type: 'health' | 'birth' | 'vaccination';
    priority: 'high' | 'medium' | 'low';
    date: string;
  }[]>([]);
  const [stockAlerts, setStockAlerts] = useState<{
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    unit: string;
  }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Bugünün başlangıç ve bitiş tarihleri
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

      // Tüm verileri paralel olarak çek
      const [animalsResponse, milkSessionsResponse, healthRecordsResponse, stockItemsResponse] = await Promise.all([
        // Hayvan sayısı ve durumları
        supabase
          .from('animals')
          .select('*')
          .eq('status', 'active'),

        // Günlük süt üretimi
        supabase
          .from('milk_sessions')
          .select(`
            *,
            milk_records (
              quantity
            )
          `)
          .gte('session_date', startOfDay)
          .lt('session_date', endOfDay),

        // Sağlık kayıtları ve uyarılar
        supabase
          .from('health_records')
          .select('*')
          .order('record_date', { ascending: false })
          .limit(10),

        // Stok durumu - tüm öğeleri çekip JavaScript'te filtrele
        supabase
          .from('stock_items')
          .select('*')
      ]);

      // Hata kontrolü
      if (animalsResponse.error) throw new Error(animalsResponse.error.message);
      if (milkSessionsResponse.error) throw new Error(milkSessionsResponse.error.message);
      if (healthRecordsResponse.error) throw new Error(healthRecordsResponse.error.message);
      if (stockItemsResponse.error) throw new Error(stockItemsResponse.error.message);

      const animals = animalsResponse.data || [];
      const milkSessions = milkSessionsResponse.data || [];
      const healthRecords = healthRecordsResponse.data || [];
      const stockItems = stockItemsResponse.data || [];

      // Günlük süt üretimini hesapla
      const dailyMilk = milkSessions.reduce((sum, session) => {
        const sessionTotal = session.milk_records?.reduce((recordSum, record) => 
          recordSum + (record.quantity || 0), 0) || 0;
        return sum + sessionTotal;
      }, 0);

      // Metrikleri hesapla
      const totalAnimals = animals.length;
      const avgYield = totalAnimals > 0 ? dailyMilk / totalAnimals : 0;
      const monthlyIncome = dailyMilk * 7 * 30; // Ortalama süt fiyatı 7 TL/L

      setMetrics({
        dailyMilk,
        totalAnimals,
        avgYield,
        monthlyIncome,
      });

      // Sağlık uyarılarını dönüştür
      const healthAlerts = healthRecords.map(record => ({
        id: record.id,
        title: record.diagnosis || 'Sağlık Kontrolü',
        description: record.treatment || '',
        type: record.record_type === 'vaccination' ? 'vaccination' : 'health',
        priority: record.priority as 'high' | 'medium' | 'low',
        date: new Date(record.record_date).toLocaleDateString('tr-TR'),
      }));

      setAlerts(healthAlerts);

      // Stok uyarılarını JavaScript'te filtrele ve dönüştür
      const stockWarnings = stockItems
        .filter(item => item.quantity < item.min_quantity)
        .map(item => ({
          id: item.id,
          name: item.name,
          currentStock: item.quantity,
          minStock: item.min_quantity,
          unit: item.unit,
        }));

      setStockAlerts(stockWarnings);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gösterge paneli verileri yüklenirken hata oluştu';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    metrics,
    alerts,
    stockAlerts,
    refresh: fetchDashboardData,
  };
}