import React from 'react';
import { Plus, Activity, Milk } from 'lucide-react';

interface QuickActionButtonsProps {
  animalId: string;
  onAddHealth: () => void;
  onAddMilk: () => void;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  animalId,
  onAddHealth,
  onAddMilk,
}) => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4">
      <button
        onClick={onAddHealth}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
      >
        <Activity className="w-5 h-5" />
        <span>Sağlık Kaydı Ekle</span>
      </button>
      <button
        onClick={onAddMilk}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg"
      >
        <Milk className="w-5 h-5" />
        <span>Süt Kaydı Ekle</span>
      </button>
    </div>
  );
};