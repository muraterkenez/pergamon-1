import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { Database } from '../../lib/database.types';

type Animal = Database['public']['Tables']['animals']['Row'];

interface AnimalStatsProps {
  animals: Animal[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const AnimalStats: React.FC<AnimalStatsProps> = ({ animals }) => {
  // Irk dağılımını hesapla
  const breedData = animals.reduce((acc, animal) => {
    acc[animal.breed] = (acc[animal.breed] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const breedChartData = Object.entries(breedData).map(([name, value]) => ({
    name,
    value,
  }));

  // Yaş dağılımını hesapla
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 +
      today.getMonth() - birth.getMonth();
    return months;
  };

  const ageGroups = animals.reduce((acc, animal) => {
    const months = calculateAge(animal.birth_date);
    if (months <= 6) acc['0-6 ay']++;
    else if (months <= 12) acc['6-12 ay']++;
    else if (months <= 24) acc['1-2 yıl']++;
    else if (months <= 48) acc['2-4 yıl']++;
    else acc['4+ yıl']++;
    return acc;
  }, {
    '0-6 ay': 0,
    '6-12 ay': 0,
    '1-2 yıl': 0,
    '2-4 yıl': 0,
    '4+ yıl': 0,
  });

  const ageChartData = Object.entries(ageGroups).map(([name, count]) => ({
    name,
    count,
  }));

  // Grup dağılımını hesapla
  const groupData = animals.reduce((acc, animal) => {
    const groupNames = {
      lactating: 'Laktasyonda',
      dry: 'Kurudaki',
      young: 'Genç',
      treatment: 'Tedavide',
    };
    const groupName = groupNames[animal.group_type as keyof typeof groupNames];
    acc[groupName] = (acc[groupName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groupChartData = Object.entries(groupData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Irk Dağılımı */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Irk Dağılımı</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breedChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {breedChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Yaş Dağılımı */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Yaş Dağılımı</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" name="Hayvan Sayısı" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grup Dağılımı */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Grup Dağılımı</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={groupChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {groupChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};