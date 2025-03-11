import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

const mockData = [
  {
    name: 'Antibiyotik A',
    stock: 25,
    unit: 'şişe',
    minStock: 30,
    expiryDate: '2024-12',
  },
  {
    name: 'Vitamin B',
    stock: 15,
    unit: 'kutu',
    minStock: 20,
    expiryDate: '2024-09',
  },
  {
    name: 'Ağrı Kesici',
    stock: 40,
    unit: 'ampul',
    minStock: 50,
    expiryDate: '2025-03',
  },
];

export const MedicationInventory: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">İlaç Envanteri</h2>
      <div className="space-y-4">
        {mockData.map((item) => {
          const isLow = item.stock < item.minStock;
          return (
            <div key={item.name} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isLow && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                    Düşük Stok
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {item.stock} {item.unit}
                </span>
                <span className="text-gray-500">
                  Son Kullanma: {item.expiryDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};