import React from 'react';
import { NavLink } from 'react-router-dom';

interface SettingsNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface SettingsNavigationProps {
  items: readonly SettingsNavigationItem[];
}

export const SettingsNavigation: React.FC<SettingsNavigationProps> = ({ items }) => {
  return (
    <nav className="w-64 bg-white border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Ayarlar</h2>
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};