import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  AlertTriangle,
  TrendingUp,
  BarChart,
  Download,
  Plus,
  Filter,
  QrCode,
  Search,
} from 'lucide-react';
import { StockMetrics } from './StockMetrics';
import { StockLevels } from './StockLevels';
import { StockMovements } from './StockMovements';
import { LowStockAlerts } from './LowStockAlerts';
import { ExpiryDateWarnings } from './ExpiryDateWarnings';
import { StockValueChart } from './StockValueChart';
import { QRScanner } from './QRScanner';
import { AddStockForm } from './AddStockForm';
import { useStock } from '../../hooks/useStock';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

export const StockDashboard: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
  const [expiringItems, setExpiringItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    getStockItems,
    getLowStockItems,
    getExpiringItems,
  } = useStock();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [items, lowItems, expiring] = await Promise.all([
        getStockItems(),
        getLowStockItems(),
        getExpiringItems(),
      ]);

      setStockItems(items || []);
      setLowStockItems(lowItems || []);
      setExpiringItems(expiring || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      toast.error('Stok verileri yüklenirken hata: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.barcode && item.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            onClick={fetchData}
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
        <h1 className="text-2xl font-bold">Stok Yönetimi</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Yeni Stok Girişi
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <QrCode className="w-5 h-5" />
            QR Kod Tara
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Stok adı, barkod veya SKU ile ara..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Ana Metrikler */}
      <StockMetrics items={stockItems} />

      {/* Alt Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Stok Seviyeleri */}
        <StockLevels items={filteredItems} />

        {/* Stok Hareketleri */}
        <StockMovements />

        {/* Düşük Stok Uyarıları */}
        <LowStockAlerts items={lowStockItems} />

        {/* Son Kullanma Tarihi Yaklaşanlar */}
        <ExpiryDateWarnings items={expiringItems} />

        {/* Stok Değer Grafiği */}
        <StockValueChart items={stockItems} />
      </div>

      {/* Formlar ve Modallar */}
      {showAddForm && (
        <AddStockForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchData();
          }}
        />
      )}
      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onScan={(data) => {
            console.log('Taranan veri:', data);
            setShowScanner(false);
          }}
        />
      )}
    </div>
  );
};