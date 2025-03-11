import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

const mockData = [
  {
    id: 'LAB001',
    date: '2024-03-10',
    type: 'Kan Tahlili',
    animal: 'TR123',
    status: 'normal',
  },
  {
    id: 'LAB002',
    date: '2024-03-12',
    type: 'Süt Analizi',
    animal: 'TR456',
    status: 'attention',
  },
  {
    id: 'LAB003',
    date: '2024-03-13',
    type: 'Dışkı Analizi',
    animal: 'TR789',
    status: 'normal',
  },
];

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  attention: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

export const LabResults: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Laboratuvar Sonuçları</h2>
      <div className="space-y-4">
        {mockData.map((result) => (
          <div key={result.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{result.type}</span>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  statusColors[result.status]
                }`}
              >
                {result.status === 'normal'
                  ? 'Normal'
                  : result.status === 'attention'
                  ? 'Dikkat'
                  : 'Kritik'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>{result.animal}</span>
              <span className="text-gray-500">{result.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};