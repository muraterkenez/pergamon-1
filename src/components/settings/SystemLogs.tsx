import React from 'react';
import { Clock } from 'lucide-react';

export const SystemLogs: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sistem Günlükleri</h1>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <p>Sistem günlükleri burada görüntülenecek</p>
        </div>
      </div>
    </div>
  );
};