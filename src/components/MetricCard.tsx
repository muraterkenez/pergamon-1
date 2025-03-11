import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MetricCard as MetricCardType } from '../types';

const statusColors = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
};

const trendColors = {
  positive: 'text-green-600 bg-green-50',
  negative: 'text-red-600 bg-red-50',
};

export const MetricCard: React.FC<MetricCardType> = ({
  title,
  value,
  trend,
  status,
  icon,
}) => {
  return (
    <div className={`border rounded-lg ${statusColors[status]} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              trend >= 0 ? trendColors.positive : trendColors.negative
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}