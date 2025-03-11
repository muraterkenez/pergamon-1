import React from 'react';
import { Thermometer, Calendar } from 'lucide-react';

interface MilkTankStatusProps {
  capacity: number;
  current: number;
  temperature: number;
  lastCollection: string;
  nextCollection: string;
}

export const MilkTankStatus: React.FC<MilkTankStatusProps> = ({
  capacity,
  current,
  temperature,
  lastCollection,
  nextCollection,
}) => {
  const fillPercentage = (current / capacity) * 100;
  const formattedPercentage = Math.round(fillPercentage);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Süt Tankı Durumu</h2>
      <div className="space-y-6">
        {/* Tank Doluluk Göstergesi */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Tank Doluluk</span>
            <span className="text-sm font-medium">{formattedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                fillPercentage > 90
                  ? 'bg-red-500'
                  : fillPercentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>0 L</span>
            <span>{current} L</span>
            <span>{capacity} L</span>
          </div>
        </div>

        {/* Sıcaklık */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
          <Thermometer className="w-6 h-6 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Tank Sıcaklığı</p>
            <p className="text-xl font-bold text-blue-700">{temperature}°C</p>
          </div>
        </div>

        {/* Süt Toplama Bilgileri */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Son Toplama</p>
              <p className="font-medium">{lastCollection}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Sonraki Toplama</p>
              <p className="font-medium">{nextCollection}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};