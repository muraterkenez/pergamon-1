import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

const mockVisits = [
  {
    id: '1',
    date: '2024-03-15',
    time: '09:00',
    veterinarian: 'Dr. Ahmet Yılmaz',
    purpose: 'Rutin Kontrol',
    animals: 12,
  },
  {
    id: '2',
    date: '2024-03-16',
    time: '14:30',
    veterinarian: 'Dr. Ayşe Demir',
    purpose: 'Aşılama',
    animals: 25,
  },
  {
    id: '3',
    date: '2024-03-18',
    time: '10:00',
    veterinarian: 'Dr. Mehmet Kaya',
    purpose: 'Gebelik Kontrolü',
    animals: 8,
  },
];

export const VetVisitSchedule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Veteriner Ziyaret Planı</h2>
      <div className="space-y-4">
        {mockVisits.map((visit) => (
          <div
            key={visit.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{visit.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>{visit.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-gray-400" />
              <span>{visit.veterinarian}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{visit.purpose}</span>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {visit.animals} Hayvan
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};