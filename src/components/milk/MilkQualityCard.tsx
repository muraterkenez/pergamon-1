import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MilkQualityCardProps {
  title: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  trend?: number;
  icon?: React.ReactNode;
}

export const MilkQualityCard: React.FC<MilkQualityCardProps> = ({
  title,
  value,
  unit,
  min,
  max,
  trend,
  icon,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const isInRange = value >= min && value <= max;

  return (
    <div className={`p-4 rounded-lg ${
      isInRange ? 'bg-green-50' : 'bg-red-50'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {Math.abs(trend)}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mb-2">
        {value} {unit}
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            isInRange ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};