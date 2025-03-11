import React from 'react';
import { TrendingUp } from 'lucide-react';

const mockData = [
  { id: 'TR123', score: 2, date: '2024-03-10', location: 'Sol Ön' },
  { id: 'TR456', score: 3, date: '2024-03-12', location: 'Sağ Arka' },
  { id: 'TR789', score: 1, date: '2024-03-13', location: 'Sol Arka' },
];

export const LamenessTracking: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Topallık Takibi</h2>
      <div className="space-y-4">
        {mockData.map((record) => (
          <div key={record.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{record.id}</span>
              <span className="text-sm text-gray-500">{record.date}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{record.location}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="font-medium">
                  Topallık Skoru: {record.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};