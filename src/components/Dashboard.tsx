import React, { useState } from 'react';
import { Milk, Users, TrendingUp, DollarSign, Calendar, AlertTriangle, QrCode } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { AlertPanel } from './AlertPanel';
import { Calendar as CalendarComponent } from './Calendar';
import { StockStatus } from './StockStatus';
import { QRScanner } from './QRScanner';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard: React.FC = () => {
  const { loading, error, metrics, alerts, stockAlerts, refresh } = useDashboard();
  const [showScanner, setShowScanner] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">Hata</p>
          </div>
          <p className="mt-1 text-red-600">{error}</p>
          <button
            onClick={refresh}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Üst Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gösterge Paneli</h1>
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <QrCode className="w-5 h-5" />
          QR Kod Tara
        </button>
      </div>

      {/* Ana Metrikler */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Günlük Süt Üretimi"
          value={`${metrics.dailyMilk.toFixed(1)} L`}
          status="success"
          icon={<Milk className="w-5 h-5" />}
        />
        <MetricCard
          title="Toplam Hayvan"
          value={metrics.totalAnimals.toString()}
          status="success"
          icon={<Users className="w-5 h-5" />}
        />
        <MetricCard
          title="Ortalama Verim"
          value={`${metrics.avgYield.toFixed(1)} L/gün`}
          status="success"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <MetricCard
          title="Aylık Gelir"
          value={`₺${metrics.monthlyIncome.toLocaleString()}`}
          status="success"
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Takvim */}
      <div className="mb-6">
        <CalendarComponent />
      </div>

      {/* Alt Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Görevler */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Yaklaşan Görevler</h2>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 text-yellow-700 border-yellow-200">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3" />
              <div>
                <p className="font-semibold">12 Görev</p>
                <p className="text-sm">Önümüzdeki 7 gün içinde</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uyarılar */}
        <AlertPanel alerts={alerts} />

        {/* Stok Durumu */}
        <StockStatus items={stockAlerts} />
      </div>

      {/* QR Kod Tarayıcı Modal */}
      {showScanner && (
        <QRScanner onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
};