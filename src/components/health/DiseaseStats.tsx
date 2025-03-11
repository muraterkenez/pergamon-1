import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { name: 'Mastitis', count: 15 },
  { name: 'Topallık', count: 8 },
  { name: 'Metabolik', count: 6 },
  { name: 'Solunum', count: 4 },
  { name: 'Sindirim', count: 7 },
];

export const DiseaseStats: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Hastalık İstatistikleri</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">En Sık Görülen</p>
          <p className="font-semibold">Mastitis</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">İyileşme Oranı</p>
          <p className="font-semibold">%85</p>
        </div>
      </div>
    </div>
  );
};