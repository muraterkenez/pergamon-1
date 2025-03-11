import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'] as const;

const mockEvents = [
  { date: 15, title: 'Veteriner Kontrolü', type: 'health' },
  { date: 17, title: 'İnek #178 Doğum', type: 'birth' },
  { date: 20, title: 'Toplu Aşılama', type: 'vaccination' },
  { date: 22, title: 'Yem Siparişi', type: 'stock' },
  { date: 25, title: 'Ekipman Bakımı', type: 'maintenance' },
] as const;

const eventTypeColors = {
  health: 'bg-blue-100 text-blue-800 border-blue-200',
  birth: 'bg-purple-100 text-purple-800 border-purple-200',
  vaccination: 'bg-green-100 text-green-800 border-green-200',
  stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  maintenance: 'bg-gray-100 text-gray-800 border-gray-200',
} as const;

export const Calendar: React.FC = () => {
  const [currentMonth] = React.useState('Mart 2024');
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Etkinlik Takvimi</h2>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium">{currentMonth}</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Boş günler için offset */}
        <div className="h-24" /> {/* 1 Mart Cuma */}
        <div className="h-24" /> {/* 2 Mart Cumartesi */}
        <div className="h-24" /> {/* 3 Mart Pazar */}
        {days.map((day) => {
          const events = mockEvents.filter((event) => event.date === day);
          return (
            <div
              key={day}
              className="h-24 border rounded-lg p-1 hover:bg-gray-50"
            >
              <div className="text-sm font-medium mb-1">{day}</div>
              <div className="space-y-1">
                {events.map((event) => (
                  <div
                    key={event.title}
                    className={`text-xs p-1 rounded border ${
                      eventTypeColors[event.type]
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="text-sm font-medium">Etkinlik Türleri:</div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded border bg-blue-100 text-blue-800 border-blue-200">
            Sağlık
          </span>
          <span className="text-xs px-2 py-1 rounded border bg-purple-100 text-purple-800 border-purple-200">
            Doğum
          </span>
          <span className="text-xs px-2 py-1 rounded border bg-green-100 text-green-800 border-green-200">
            Aşılama
          </span>
          <span className="text-xs px-2 py-1 rounded border bg-yellow-100 text-yellow-800 border-yellow-200">
            Stok
          </span>
          <span className="text-xs px-2 py-1 rounded border bg-gray-100 text-gray-800 border-gray-200">
            Bakım
          </span>
        </div>
      </div>
    </div>
  );
}