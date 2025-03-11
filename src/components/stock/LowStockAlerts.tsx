import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

interface LowStockAlertsProps {
  items: StockItem[];
}

export const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Düşük Stok Uyarıları</h2>
      </div>

      <div className="divide-y">
        {items.map((item) => {
          const stockPercentage = (item.quantity / item.min_quantity) * 100;
          const isCritical = stockPercentage < 50;

          return (
            <div key={item.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isCritical ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      isCritical ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    isCritical ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {item.quantity} / {item.min_quantity} {item.unit}
                  </p>
                  <p className="text-sm text-gray-500">{item.location || '-'}</p>
                </div>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      isCritical ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{
                      width: `${stockPercentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Düşük stok uyarısı bulunmuyor
        </div>
      )}

      <div className="p-4 border-t">
        <button className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-700">
          Tüm Uyarıları Gör
        </button>
      </div>
    </div>
  );
};