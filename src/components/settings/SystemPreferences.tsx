import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Calendar, Bell, DollarSign } from 'lucide-react';
import { useSystemPreferences } from '../../hooks/useSystemPreferences';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type SystemPreference = Database['public']['Tables']['system_preferences']['Row'];

export const SystemPreferences: React.FC = () => {
  const { loading, getSystemPreferences, updateSystemPreferences } = useSystemPreferences();
  const [formData, setFormData] = useState<Partial<SystemPreference>>({
    language: 'tr',
    timezone: 'Europe/Istanbul',
    date_format: 'DD.MM.YYYY',
    time_format: '24',
    currency: 'TRY',
    currency_symbol: '₺',
    decimal_separator: ',',
    thousand_separator: '.',
    notification_email: true,
    notification_sms: false,
    notification_push: true,
    auto_backup: true,
    backup_frequency: 'daily',
    retention_period: 30,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const preferences = await getSystemPreferences();
      if (preferences) {
        setFormData(preferences);
      }
    } catch (error) {
      console.error('Tercihler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSystemPreferences(formData);
    } catch (error) {
      console.error('Form gönderilirken hata:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sistem Tercihleri</h1>
          <p className="text-gray-500 mt-1">Sistem genelinde kullanılacak tercihleri yönetin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bölgesel Ayarlar */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Bölgesel Ayarlar</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dil
                </label>
                <select
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Dilimi
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) =>
                    setFormData({ ...formData, timezone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                  <option value="Europe/London">London (UTC+0)</option>
                  <option value="America/New_York">New York (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tarih ve Saat Formatı */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Tarih ve Saat Formatı</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih Formatı
                </label>
                <select
                  value={formData.date_format}
                  onChange={(e) =>
                    setFormData({ ...formData, date_format: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DD.MM.YYYY">31.12.2024</option>
                  <option value="MM/DD/YYYY">12/31/2024</option>
                  <option value="YYYY-MM-DD">2024-12-31</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Formatı
                </label>
                <select
                  value={formData.time_format}
                  onChange={(e) =>
                    setFormData({ ...formData, time_format: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="24">24 Saat (14:30)</option>
                  <option value="12">12 Saat (2:30 PM)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Para Birimi Ayarları */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Para Birimi Ayarları</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TRY">Türk Lirası (TRY)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi Sembolü
                </label>
                <select
                  value={formData.currency_symbol}
                  onChange={(e) =>
                    setFormData({ ...formData, currency_symbol: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="₺">₺</option>
                  <option value="$">$</option>
                  <option value="€">€</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ondalık Ayracı
                </label>
                <select
                  value={formData.decimal_separator}
                  onChange={(e) =>
                    setFormData({ ...formData, decimal_separator: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=",">,</option>
                  <option value=".">.</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Binlik Ayracı
                </label>
                <select
                  value={formData.thousand_separator}
                  onChange={(e) =>
                    setFormData({ ...formData, thousand_separator: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=".">.</option>
                  <option value=",">,</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bildirim Ayarları */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Bildirim Ayarları</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notification_email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notification_email: e.target.checked,
                      })
                    }
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">E-posta Bildirimleri</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notification_sms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notification_sms: e.target.checked,
                      })
                    }
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">SMS Bildirimleri</span>
                </label>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.notification_push}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notification_push: e.target.checked,
                      })
                    }
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Push Bildirimleri</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Yedekleme Ayarları */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Yedekleme Ayarları</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.auto_backup}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        auto_backup: e.target.checked,
                      })
                    }
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Otomatik Yedekleme</span>
                </label>

                {formData.auto_backup && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yedekleme Sıklığı
                    </label>
                    <select
                      value={formData.backup_frequency}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backup_frequency: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                      <option value="monthly">Aylık</option>
                    </select>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yedek Saklama Süresi (Gün)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.retention_period}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      retention_period: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Kontrolleri */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Save className="w-5 h-5" />
            Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};