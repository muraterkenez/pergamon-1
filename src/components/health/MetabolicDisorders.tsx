import React from 'react';
import { AlertTriangle } from 'lucide-react';

const mockData = [
  {
    id: 'TR123',
    condition: 'Ketozis',
    risk: 'high',
    symptoms: 'İştah kaybı, Süt veriminde düşüş',
  },
  {
    id: 'TR456',
    condition: 'Asidoz',
    risk: 'medium',
    symptoms: 'Rumen aktivitesinde azalma',
  },
  {
    id: 'TR789',
    condition: 'Hipokalsemi',
    risk: 'low',
    symptoms: 'Hafif titreme',
  },
];

const riskColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export const MetabolicDisorders: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Metabolik Hastalıklar</h2>
      <div className="space-y-4">
        {mockData.map((record) => (
          <div key={record.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{record.id}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  riskColors[record.risk]
                }`}
              >
                {record.risk === 'high'
                  ? 'Yüksek Risk'
                  : record.risk === 'medium'
                  ? 'Orta Risk'
                  : 'Düşük Risk'}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>{record.condition}</span>
            </div>
            <p className="text-sm text-gray-500">{record.symptoms}</p>
          </div>
        ))}
      </div>
    </div>
  );
};