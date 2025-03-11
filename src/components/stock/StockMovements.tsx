import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { StockMovement } from '../../types/stock';

const mockMovements: StockMovement[] = [
  {
    id: '1',
    itemId: '1',
    type: 'in',
    quantity: 1000,
    date: new Date('2024-03-15'),
    reference: 'GIR-001',
    price: 12500,
    performedBy: 'Ahmet Yılmaz',
    description: 'Tedarikçiden alım',
  },
  {
    id: '2',
    itemId: '2',
    type: 'out',
    quantity: 500,
    date: new Date('2024-03-14'),
    reference: 'CIK-001',
    price: 1750,
    performedBy: 'Mehmet Demir',
    description: 'Günlük yem tüketimi',
  },
  {
    id: '3',
    itemId: '3',
    type: 'in',
    quantity: 50,
    date: new Date('2024-03-13'),
    reference: 'GIR-002',
    price: 12500,
    performedBy: 'Ayşe Kaya',
    description: 'Acil ilaç alımı',
  },
];

export const StockMovements: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Son Stok Hareketleri</h2>
      </div>

      <div className="divide-y">
        {mockMovements.map((movement) => (
          <div key={movement.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {movement.type === 'in' ? (
                  <div className="p-2 bg-green-100 rounded-full">
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 rounded-full">
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  </div>
                )}
                <div>
                  <p className="font-medium">
                    {movement.type === 'in' ? 'Giriş' : 'Çıkış'}
                  </p>
                  <p className="text-sm text-gray-500">{movement.reference}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  movement.type === 'in' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movement.type === 'in' ? '+' : '-'}{movement.quantity}
                </p>
                <p className="text-sm text-gray-500">
                  ₺{movement.price.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{movement.description}</span>
              <span>{new Date(movement.date).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <button className="w-full py-2 text-center text-sm text-blue-600 hover:text-blue-700">
          Tüm Hareketleri Gör
        </button>
      </div>
    </div>
  );
};