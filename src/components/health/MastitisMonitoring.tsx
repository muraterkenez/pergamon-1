import React from 'react';
import { Activity } from 'lucide-react';

const mockData = [
  { id: 'TR123', quarter: 'Sol Ön', score: 2, date: '2024-03-10' },
  { id: 'TR456', quarter: 'Sağ Arka', score: 3, date: '2024-03-12' },
  { id: 'TR789', quarter: 'Sol Arka', score: 1, date: '2024-03-13' },
];

export const MastitisMonitoring: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Mastitis Takibi</h2>
      <div className="space-y-4">
        {mockData.map((record) => (
          <div
            key={record.id + record.quarter}
            className="border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{record.id}</span>
              <span className="text-sm text-gray-500">{record.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{record.quarter}</span>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                <span className="font-medium">CMT Skoru: {record.score}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};