import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const mockChecklist = [
  {
    id: '1',
    item: 'Araç Dezenfeksiyon',
    status: 'completed',
    lastCheck: '2024-03-14',
  },
  {
    id: '2',
    item: 'Personel Hijyen Kontrolü',
    status: 'pending',
    lastCheck: '2024-03-13',
  },
  {
    id: '3',
    item: 'Ziyaretçi Kaydı',
    status: 'attention',
    lastCheck: '2024-03-14',
  },
  {
    id: '4',
    item: 'Ekipman Sterilizasyonu',
    status: 'completed',
    lastCheck: '2024-03-14',
  },
  {
    id: '5',
    item: 'Ahır Dezenfeksiyonu',
    status: 'pending',
    lastCheck: '2024-03-12',
  },
];

const statusIcons = {
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  pending: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  attention: <XCircle className="w-5 h-5 text-red-500" />,
};

const statusColors = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  attention: 'bg-red-100 text-red-800',
};

export const BiosecurityChecklist: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Biyogüvenlik Kontrol Listesi</h2>
      <div className="space-y-4">
        {mockChecklist.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {statusIcons[item.status]}
                <span className="font-medium">{item.item}</span>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  statusColors[item.status]
                }`}
              >
                {item.status === 'completed'
                  ? 'Tamamlandı'
                  : item.status === 'pending'
                  ? 'Beklemede'
                  : 'Dikkat'}
              </span>
            </div>
            <div className="ml-8">
              <span className="text-sm text-gray-500">
                Son Kontrol: {item.lastCheck}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Biyogüvenlik kontrolleri günlük olarak yapılmalı ve kayıt altına
          alınmalıdır. Eksiklikler derhal giderilmelidir.
        </p>
      </div>
    </div>
  );
};