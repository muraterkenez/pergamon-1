import React from 'react';
import { Bell } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bildirim Ayarları</h1>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <p>Bildirim ayarları burada görüntülenecek</p>
        </div>
      </div>
    </div>
  );
};