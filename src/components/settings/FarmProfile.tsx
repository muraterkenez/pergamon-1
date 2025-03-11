import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Mail, Globe, Save } from 'lucide-react';
import { useFarmProfile } from '../../hooks/useFarmProfile';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type FarmProfile = Database['public']['Tables']['farm_profile']['Row'];

export const FarmProfile: React.FC = () => {
  const { loading, getFarmProfile, updateFarmProfile } = useFarmProfile();
  const [formData, setFormData] = useState<Partial<FarmProfile>>({
    name: '',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    tax_id: '',
    registration_number: '',
    establishment_date: '',
    total_area: null,
    pasture_area: null,
    barn_capacity: null,
    milking_system_type: '',
    notes: '',
  });

  useEffect(() => {
    loadFarmProfile();
  }, []);

  const loadFarmProfile = async () => {
    try {
      const profile = await getFarmProfile();
      if (profile) {
        setFormData(profile);
      }
    } catch (error) {
      console.error('Çiftlik profili yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFarmProfile(formData);
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
          <h1 className="text-2xl font-bold">Çiftlik Profili</h1>
          <p className="text-gray-500 mt-1">Çiftlik bilgilerini yönetin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Temel Bilgiler</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Çiftlik Adı
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vergi Numarası
                </label>
                <input
                  type="text"
                  value={formData.tax_id || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, tax_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tesis Numarası
                </label>
                <input
                  type="text"
                  value={formData.registration_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, registration_number: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kuruluş Tarihi
                </label>
                <input
                  type="date"
                  value={formData.establishment_date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, establishment_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">İletişim Bilgileri</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adres
                </label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şehir
                </label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posta Kodu
                </label>
                <input
                  type="text"
                  value={formData.postal_code || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Web Sitesi
                </label>
                <input
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tesis Bilgileri */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Tesis Bilgileri</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toplam Alan (Dönüm)
                </label>
                <input
                  type="number"
                  value={formData.total_area || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, total_area: Number(e.target.value) || null })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mera Alanı (Dönüm)
                </label>
                <input
                  type="number"
                  value={formData.pasture_area || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, pasture_area: Number(e.target.value) || null })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ahır Kapasitesi
                </label>
                <input
                  type="number"
                  value={formData.barn_capacity || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, barn_capacity: Number(e.target.value) || null })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sağım Sistemi
                </label>
                <select
                  value={formData.milking_system_type || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, milking_system_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="pipeline">Boru Hattı</option>
                  <option value="parlor">Sağım Salonu</option>
                  <option value="robot">Robotik Sistem</option>
                  <option value="mobile">Seyyar Sistem</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notlar
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
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