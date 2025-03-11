import React from 'react';
import { Clock } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

interface ExpiryDateWarningsProps {
  items: StockItem[];
}

export const ExpiryDateWarnings: React.FC<ExpiryDateWarningsProps> = ({ items }) => {
  const calculateDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Son Kullanma Tarihi Yaklaşanlar</h2>
      </div>

      <div className="divide-y">
        {items.map((item) => {
          if (!item.expiry_date) return null;
          const daysUntilExpiry = calculateDaysUntilExpiry(item.expiry_date);

          return (
            <div key={item.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    daysUntilExpiry <= 30 ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    <Clock className={`w-5 h-5 ${
                      daysUntilExpiry <= 30 ? 'text-red-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    daysUntilExpiry <= 30 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {daysUntilExpiry} gün kaldı
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(item.expiry_date).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Miktar: {item.quantity} {item.unit}</span>
                <span>{item.location || '-'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Son kullanma tarihi yaklaşan ürün bulunmuyor
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