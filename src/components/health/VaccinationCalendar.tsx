import React from 'react';
import { Syringe, Calendar, AlertCircle } from 'lucide-react';

const mockVaccinations = [
  {
    id: '1',
    date: '2024-03-15',
    vaccine: 'Şap Aşısı',
    animals: 15,
    status: 'pending',
  },
  {
    id: '2',
    date: '2024-03-18',
    vaccine: 'Brusella Aşısı',
    animals: 8,
    status: 'pending',
  },
  {
    id: '3',
    date: '2024-03-20',
    vaccine: 'IBR Aşısı',
    animals: 22,
    status: 'pending',
  },
];

export const VaccinationCalendar: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Aşılama Takvimi</h2>
      <div className="space-y-4">
        {mockVaccinations.map((vaccination) => (
          <div
            key={vaccination.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" />
                <span className="font-medium">{vaccination.date}</span>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                {vaccination.animals} Hayvan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Syringe className="w-5 h-5 text-gray-400" />
              <span>{vaccination.vaccine}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Aşı takvimine uygun olarak planlanan aşılamalar otomatik olarak
          oluşturulur. Veteriner hekim tarafından onaylanması gerekir.
        </p>
      </div>
    </div>
  );
};