export interface MetricCard {
  title: string;
  value: string | number;
  trend?: number;
  status: 'success' | 'warning' | 'danger';
  icon: React.ReactNode;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'health' | 'birth' | 'vaccination';
  priority: 'high' | 'medium' | 'low';
  date: string;
}

export interface Task {
  id: string;
  title: string;
  date: string;
  type: 'vet' | 'insemination' | 'maintenance';
  status: 'pending' | 'completed';
}

export interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  unit: string;
}