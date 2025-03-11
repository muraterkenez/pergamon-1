import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Database } from '../../lib/database.types';

type StockItem = Database['public']['Tables']['stock_items']['Row'];

interface StockValueChartProps {
  items: StockItem[];
}

export const StockValueChart: React.FC<StockValueChartProps> = ({ items }) => {
  // Stok değerlerini kategorilere göre grupla
  const categoryValues = items.reduce((acc, item) => {
    const category = item.category;
    acc[category] = (acc[category] || 0) + (item.quantity * item.price);
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryValues).map(([category, value]) => ({
    category,
    value,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Stok Değer Dağılımı</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis
              tickFormatter={(value) =>
                `₺${(value / 1000).toFixed(0)}K`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₺${Number(value).toLocaleString()}`
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="#93c5fd"
              name="Stok Değeri"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};