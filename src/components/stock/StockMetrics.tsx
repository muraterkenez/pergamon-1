import React from 'react';
import { Package, AlertTriangle, TrendingUp, Truck } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

interface StockMetricsProps {
  items: StockItem[];
}

export const StockMetrics: React.FC<StockMetricsProps> = ({ items }) => {
  // Toplam stok değerini hesapla
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Kritik stok sayısını hesapla
  const criticalItems = items.filter(item => item.quantity <= item.min_quantity);

  // Kategori bazında grupla
  const categories = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Toplam Stok Değeri</h3>
        </div>
        <p className="text-2xl font-bold">₺{totalValue.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Güncel değer</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="font-medium">Kritik Stoklar</h3>
        </div>
        <p className="text-2xl font-bold">{criticalItems.length}</p>
        <p className="text-sm text-gray-500">
          {Object.entries(categories)
            .filter(([_, count]) => count > 0)
            .map(([category, count]) => `${count} ${category}`)
            .join(', ')}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Bekleyen Siparişler</h3>
        </div>
        <p className="text-2xl font-bold">-</p>
        <p className="text-sm text-gray-500">Sipariş bilgisi yok</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Package className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">Stok Çeşidi</h3>
        </div>
        <p className="text-2xl font-bold">{items.length}</p>
        <p className="text-sm text-gray-500">Aktif ürün</p>
      </div>
    </div>
  );
};