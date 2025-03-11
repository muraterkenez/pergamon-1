import React from 'react';
import { Package } from 'lucide-react';
import type { StockItem } from '../types';

export const StockStatus: React.FC<{ items: StockItem[] }> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Kritik Stok Seviyeleri</h2>
      <div className="space-y-4">
        {items.map((item) => {
          const stockPercentage = (item.currentStock / item.minStock) * 100;
          const isLow = stockPercentage < 50;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-500" />
                <div className="ml-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.currentStock} {item.unit} kaldı
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isLow
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isLow ? 'Düşük Stok' : 'Orta Stok'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}