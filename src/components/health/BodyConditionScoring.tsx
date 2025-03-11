import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = [
  { date: '2024-01', score: 3.0 },
  { date: '2024-02', score: 3.2 },
  { date: '2024-03', score: 3.5 },
];

export const BodyConditionScoring: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Vücut Kondisyon Skorlaması</h2>
      <div className="h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">Ortalama VKS</p>
          <p className="font-semibold">3.2</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Hedef</p>
          <p className="font-semibold">3.5</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">Değişim</p>
          <p className="font-semibold">+0.3</p>
        </div>
      </div>
    </div>
  );
};