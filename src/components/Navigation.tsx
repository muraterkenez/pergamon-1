import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface NavigationProps {
  items: NavigationItem[];
  isOpen: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ items, isOpen }) => {
  const location = useLocation();

  return (
    <nav
      className={`bg-white border-r transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-center h-12">
          {isOpen ? (
            <span className="text-lg font-semibold">Süt Çiftliği</span>
          ) : (
            <span className="text-lg font-semibold">SÇ</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.href ? 'bg-blue-50 text-blue-700' : ''
            }`}
          >
            <span className="flex items-center justify-center w-8">
              {item.icon}
            </span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}