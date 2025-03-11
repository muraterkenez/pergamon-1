import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Milk, Users, TrendingUp, DollarSign, Calendar, AlertTriangle, LayoutDashboard, Cog as Cow, Stethoscope, Warehouse, Settings, Menu } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { AlertPanel } from './components/AlertPanel';
import { Calendar as CalendarComponent } from './components/Calendar';
import { StockStatus } from './components/StockStatus';
import { Navigation } from './components/Navigation';
import { AnimalList } from './components/animals/AnimalList';
import { AnimalDetail } from './components/animals/AnimalDetail';
import { AnimalForm } from './components/animals/AnimalForm';
import { MilkProduction } from './components/milk/MilkProduction';
import { HealthDashboard } from './components/health/HealthDashboard';
import { StockDashboard } from './components/stock/StockDashboard';
import { SettingsDashboard } from './components/settings/SettingsDashboard';
import { LoginForm } from './components/auth/LoginForm';
import { AuthGuard } from './components/auth/AuthGuard';
import { useSupabaseContext } from './contexts/SupabaseContext';
import { Dashboard } from './components/Dashboard';

const mockAlerts = [
  {
    id: '1',
    title: 'Acil Sağlık Kontrolü Gerekli',
    description: 'İnek #245 mastit belirtileri gösteriyor',
    type: 'health',
    priority: 'high',
    date: '15.03.2024',
  },
  {
    id: '2',
    title: 'Yaklaşan Doğum',
    description: 'İnek #178 2 gün içinde doğum yapacak',
    type: 'birth',
    priority: 'medium',
    date: '17.03.2024',
  },
  {
    id: '3',
    title: 'Aşılama Zamanı',
    description: '12 inek için rutin aşılama',
    type: 'vaccination',
    priority: 'low',
    date: '20.03.2024',
  },
] as const;

const mockStockItems = [
  {
    id: '1',
    name: 'Yem Karışımı A',
    currentStock: 250,
    minStock: 1000,
    unit: 'kg',
  },
  {
    id: '2',
    name: 'Antibiyotikler',
    currentStock: 45,
    minStock: 100,
    unit: 'adet',
  },
  {
    id: '3',
    name: 'Süt Filtreleri',
    currentStock: 80,
    minStock: 200,
    unit: 'adet',
  },
] as const;

const navigationItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Gösterge Paneli', href: '/' },
  { icon: <Cow size={20} />, label: 'Hayvan Yönetimi', href: '/animals' },
  { icon: <Milk size={20} />, label: 'Süt Üretimi', href: '/milk-production' },
  { icon: <Stethoscope size={20} />, label: 'Sağlık Takibi', href: '/health' },
  { icon: <Warehouse size={20} />, label: 'Stok Yönetimi', href: '/stock' },
  { icon: <Settings size={20} />, label: 'Ayarlar', href: '/settings' },
] as const;

function App() {
  const [isNavOpen, setIsNavOpen] = React.useState(true);
  const { user } = useSupabaseContext();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginForm />
        } />
        
        <Route path="/*" element={
          <AuthGuard>
            <div className="min-h-screen bg-gray-100 flex">
              {/* Navigation */}
              <Navigation items={navigationItems} isOpen={isNavOpen} />

              {/* Main Content */}
              <div className="flex-1">
                <div className="p-4 border-b bg-white flex items-center">
                  <button
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Menu size={24} />
                  </button>
                  <h1 className="text-xl font-semibold ml-4">Çiftlik Yönetim Sistemi</h1>
                </div>

                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/animals" element={<AnimalList />} />
                  <Route path="/animals/new" element={<AnimalForm />} />
                  <Route path="/animals/:id" element={<AnimalDetail />} />
                  <Route path="/animals/:id/edit" element={<AnimalForm />} />
                  <Route path="/milk-production" element={<MilkProduction />} />
                  <Route path="/health/*" element={<HealthDashboard />} />
                  <Route path="/stock" element={<StockDashboard />} />
                  <Route path="/settings/*" element={<SettingsDashboard />} />
                </Routes>
              </div>
            </div>
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}

export default App;