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

const data = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}/3`,
  production: Math.floor(Math.random() * (1200 - 800) + 800),
}));

export const ProductionChart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Süt Üretimi (Son 30 Gün)</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Üretim (L)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}