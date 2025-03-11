import React from 'react';
import {
  Activity,
  AlertTriangle,
  Thermometer,
  Stethoscope,
} from 'lucide-react';

export const HealthMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-medium">Aktif Vakalar</h3>
        </div>
        <p className="text-2xl font-bold">12</p>
        <p className="text-sm text-gray-500">3 kritik vaka</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Stethoscope className="w-5 h-5 text-blue-500" />
          <h3 className="font-medium">Planlı Muayeneler</h3>
        </div>
        <p className="text-2xl font-bold">8</p>
        <p className="text-sm text-gray-500">Bugün</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-green-500" />
          <h3 className="font-medium">Sağlık Skoru</h3>
        </div>
        <p className="text-2xl font-bold">85%</p>
        <p className="text-sm text-green-600">%2.5 artış</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-3 mb-2">
          <Thermometer className="w-5 h-5 text-purple-500" />
          <h3 className="font-medium">Mastitis Vakaları</h3>
        </div>
        <p className="text-2xl font-bold">5</p>
        <p className="text-sm text-gray-500">Son 30 gün</p>
      </div>
    </div>
  );
};