import React from 'react';
import { QrCode } from 'lucide-react';

export const LabelSettings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Etiket ve Barkod Ayarları</h1>
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <p>Etiket ve barkod ayarları burada görüntülenecek</p>
        </div>
      </div>
    </div>
  );
};