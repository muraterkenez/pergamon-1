import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Milk,
  Thermometer,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Calendar,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Activity,
  Droplet,
  Scale,
  Percent,
} from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { MilkQualityCard } from './MilkQualityCard';
import { MilkTankStatus } from './MilkTankStatus';
import { MilkingSessionForm } from './MilkingSessionForm';
import { useMilkProduction } from '../../hooks/useMilkProduction';
import { useAnimals } from '../../hooks/useAnimals';
import toast from 'react-hot-toast';
import type { Database } from '../../lib/database.types';

type MilkSession = Database['public']['Tables']['milk_sessions']['Row'] & {
  milk_records?: Array<Database['public']['Tables']['milk_records']['Row'] & {
    animal?: Database['public']['Tables']['animals']['Row']
  }>
};

// Renk paleti
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const columnHelper = createColumnHelper<MilkSession>();

export const MilkProduction: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const { sessions, loading, error, fetchTodaySessions, deleteSession } = useMilkProduction();
  const { animals, getAnimalsByGroup } = useAnimals();
  const [lactatingAnimals, setLactatingAnimals] = useState<number>(0);

  useEffect(() => {
    loadLactatingAnimals();
  }, []);

  const loadLactatingAnimals = async () => {
    try {
      const lactating = await getAnimalsByGroup('lactating');
      setLactatingAnimals(lactating.length);
    } catch (error) {
      toast.error('Laktasyondaki hayvanlar yüklenirken hata oluştu');
    }
  };

  // Günlük toplam süt üretimini hesapla
  const dailyTotal = sessions.reduce((sum, session) => {
    const sessionTotal = session.milk_records?.reduce((recordSum, record) => 
      recordSum + (record.quantity || 0), 0) || 0;
    return sum + sessionTotal;
  }, 0);

  // Ortalama sağım süresini hesapla
  const averageMilkingTime = sessions.reduce((sum, session) => {
    if (session.start_time && session.end_time) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60); // dakika cinsinden
    }
    return sum;
  }, 0) / (sessions.length || 1);

  // Günlük geliri hesapla (ortalama süt fiyatı 7 TL/L)
  const dailyIncome = dailyTotal * 7;

  // Son 7 günlük üretim verisi (örnek)
  const weeklyData = [
    { date: '2024-03-10', morning: 620, evening: 580, total: 1200 },
    { date: '2024-03-11', morning: 640, evening: 590, total: 1230 },
    { date: '2024-03-12', morning: 610, evening: 570, total: 1180 },
    { date: '2024-03-13', morning: 650, evening: 600, total: 1250 },
    { date: '2024-03-14', morning: 630, evening: 585, total: 1215 },
    { date: '2024-03-15', morning: 645, evening: 595, total: 1240 },
    { date: '2024-03-16', morning: 635, evening: 590, total: 1225 },
  ];

  // Kalite metrikleri (örnek)
  const qualityData = {
    fatContent: { value: 3.8, min: 3.5, max: 4.5, trend: 0.2 },
    protein: { value: 3.2, min: 3.0, max: 3.8, trend: -0.1 },
    somaticCell: { value: 180, min: 0, max: 400, trend: -20 },
    bacterialCount: { value: 25, min: 0, max: 100, trend: 5 },
  };

  // Sağım performans metrikleri (örnek)
  const performanceData = [
    { name: 'Sabah', value: 55 },
    { name: 'Akşam', value: 45 },
  ];

  // Tablo sütunları
  const columns = [
    columnHelper.accessor('session_type', {
      header: 'Sağım',
      cell: info => info.getValue() === 'morning' ? 'Sabah' : 'Akşam',
    }),
    columnHelper.accessor('start_time', {
      header: 'Başlangıç',
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-',
    }),
    columnHelper.accessor('end_time', {
      header: 'Bitiş',
      cell: info => info.getValue() ? new Date(info.getValue()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-',
    }),
    columnHelper.accessor('milk_records', {
      header: 'Hayvan Sayısı',
      cell: info => info.getValue()?.length || 0,
    }),
    columnHelper.accessor('total_milk', {
      header: 'Toplam Süt (L)',
      cell: info => info.getValue()?.toFixed(1) || '-',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'İşlemler',
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingSession(info.row.original.id);
              setShowAddForm(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Düzenle"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDelete(info.row.original)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sil"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: sessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDelete = async (session: MilkSession) => {
    if (window.confirm('Bu sağım kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteSession(session.id);
        toast.success('Sağım kaydı silindi');
      } catch (error) {
        toast.error('Sağım kaydı silinirken hata oluştu');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">Hata</p>
          </div>
          <p className="mt-1 text-red-600">{error}</p>
          <button
            onClick={fetchTodaySessions}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Üst Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Süt Üretimi</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Yeni Sağım Kaydı
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Ana Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3 mb-2">
            <Milk className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Günlük Üretim</h3>
          </div>
          <p className="text-2xl font-bold">{dailyTotal.toFixed(1)} L</p>
          <p className="text-sm text-gray-500">Bugünkü toplam</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Sağılan Hayvan</h3>
          </div>
          <p className="text-2xl font-bold">{sessions.length}</p>
          <p className="text-sm text-gray-500">Toplam {lactatingAnimals} hayvandan</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <h3 className="font-medium">Ortalama Sağım Süresi</h3>
          </div>
          <p className="text-2xl font-bold">{averageMilkingTime.toFixed(1)} dk</p>
          <p className="text-sm text-gray-500">Hayvan başına</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">Günlük Gelir</h3>
          </div>
          <p className="text-2xl font-bold">₺{dailyIncome.toLocaleString()}</p>
          <p className="text-sm text-gray-500">7 TL/L ortalama</p>
        </div>
      </div>

      {/* Analiz Kartları - İlk Satır */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Üretim Trendi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Üretim Trendi
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="morning"
                  name="Sabah"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="evening"
                  name="Akşam"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Ortalama</p>
              <p className="text-lg font-semibold">1,220 L/gün</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">En Yüksek</p>
              <p className="text-lg font-semibold">1,250 L</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">En Düşük</p>
              <p className="text-lg font-semibold">1,180 L</p>
            </div>
          </div>
        </div>

        {/* Kalite Metrikleri */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Kalite Metrikleri
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MilkQualityCard
              title="Yağ Oranı"
              value={qualityData.fatContent.value}
              unit="%"
              min={qualityData.fatContent.min}
              max={qualityData.fatContent.max}
              trend={qualityData.fatContent.trend}
              icon={<Droplet className="w-5 h-5" />}
            />
            <MilkQualityCard
              title="Protein"
              value={qualityData.protein.value}
              unit="%"
              min={qualityData.protein.min}
              max={qualityData.protein.max}
              trend={qualityData.protein.trend}
              icon={<Scale className="w-5 h-5" />}
            />
            <MilkQualityCard
              title="Somatik Hücre"
              value={qualityData.somaticCell.value}
              unit="bin/ml"
              min={qualityData.somaticCell.min}
              max={qualityData.somaticCell.max}
              trend={qualityData.somaticCell.trend}
              icon={<Activity className="w-5 h-5" />}
            />
            <MilkQualityCard
              title="Bakteri Sayısı"
              value={qualityData.bacterialCount.value}
              unit="bin/ml"
              min={qualityData.bacterialCount.min}
              max={qualityData.bacterialCount.max}
              trend={qualityData.bacterialCount.trend}
              icon={<Percent className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Analiz Kartları - İkinci Satır */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sağım Dağılımı */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Sağım Dağılımı
          </h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Sabah Ortalaması</p>
              <p className="font-semibold">635 L</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Akşam Ortalaması</p>
              <p className="font-semibold">585 L</p>
            </div>
          </div>
        </div>

        {/* Tank Durumu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-blue-500" />
            Tank Durumu
          </h2>
          <MilkTankStatus
            capacity={5000}
            current={dailyTotal}
            temperature={4.2}
            lastCollection="2024-03-15 08:30"
            nextCollection="2024-03-16 08:30"
          />
        </div>

        {/* Verim Analizi */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Verim Analizi
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ortalama Günlük Verim</p>
              <p className="text-xl font-semibold">28.5 L/hayvan</p>
              <div className="flex items-center gap-2 mt-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600">%2.3 artış</span>
                <span className="text-gray-500">(son 7 gün)</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">En Yüksek Verim</p>
                <p className="font-semibold">35.2 L</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">En Düşük Verim</p>
                <p className="font-semibold">22.8 L</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sağım Kayıtları Tablosu */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Bugünkü Sağım Kayıtları</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-500 border-b"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-900 border-b"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Bugün için sağım kaydı bulunmuyor
          </div>
        )}
      </div>

      {/* Formlar ve Modallar */}
      {(showAddForm || editingSession) && (
        <MilkingSessionForm
          sessionId={editingSession}
          onClose={() => {
            setShowAddForm(false);
            setEditingSession(null);
          }}
          onSuccess={() => {
            setShowAddForm(false);
            setEditingSession(null);
            fetchTodaySessions();
          }}
        />
      )}
    </div>
  );
};