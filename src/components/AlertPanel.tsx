import React from 'react';
import { AlertCircle, Baby, Syringe } from 'lucide-react';
import type { Alert } from '../types';

const alertIcons = {
  health: <AlertCircle className="w-5 h-5" />,
  birth: <Baby className="w-5 h-5" />,
  vaccination: <Syringe className="w-5 h-5" />,
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

export const AlertPanel: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Uyarılar ve Bildirimler</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start p-4 border rounded-lg"
          >
            <div className={`p-2 rounded-full ${priorityColors[alert.priority]}`}>
              {alertIcons[alert.type]}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">{alert.title}</h3>
              <p className="text-gray-600">{alert.description}</p>
              <p className="text-sm text-gray-500 mt-1">{alert.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}