import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface TreatmentFormProps {
  onClose: () => void;
}

type TreatmentType = 'medication' | 'vaccination' | 'surgery' | 'routine' | 'emergency';

interface TreatmentFormData {
  animalId: string;
  date: string;
  type: TreatmentType;
  diagnosis: string;
  treatment: string;
  // İlaç tedavisi için alanlar
  medication?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
    withdrawalPeriod: string;
  };
  // Aşılama için alanlar
  vaccination?: {
    vaccineName: string;
    batchNumber: string;
    site: string;
    nextDueDate: string;
  };
  // Cerrahi için alanlar
  surgery?: {
    procedure: string;
    anesthesia: string;
    duration: string;
    complications: string;
  };
  followUpDate: string;
  veterinarian: string;
  notes: string;
  cost: string;
}

const initialFormData: TreatmentFormData = {
  animalId: '',
  date: new Date().toISOString().split('T')[0],
  type: 'medication',
  diagnosis: '',
  treatment: '',
  followUpDate: '',
  veterinarian: '',
  notes: '',
  cost: '',
};

const treatmentTypes = [
  { value: 'medication', label: 'İlaç Tedavisi' },
  { value: 'vaccination', label: 'Aşılama' },
  { value: 'surgery', label: 'Cerrahi Müdahale' },
  { value: 'routine', label: 'Rutin Kontrol' },
  { value: 'emergency', label: 'Acil Müdahale' },
] as const;

const medicationRoutes = [
  { value: 'oral', label: 'Oral' },
  { value: 'injection_im', label: 'Kas İçi Enjeksiyon' },
  { value: 'injection_iv', label: 'Damar İçi Enjeksiyon' },
  { value: 'injection_sc', label: 'Deri Altı Enjeksiyon' },
  { value: 'topical', label: 'Topikal' },
  { value: 'intrammary', label: 'Meme İçi' },
] as const;

const injectionSites = [
  { value: 'neck', label: 'Boyun' },
  { value: 'shoulder', label: 'Omuz' },
  { value: 'thigh', label: 'But' },
  { value: 'rump', label: 'Sağrı' },
] as const;

const vaccineTypes = [
  { 
    value: 'fmd', 
    label: 'Şap Aşısı',
    description: 'Şap hastalığına karşı koruma',
    frequency: '6 ayda bir'
  },
  { 
    value: 'brucella', 
    label: 'Brusella Aşısı',
    description: 'Brusella hastalığına karşı koruma',
    frequency: 'Tek doz (4-8 aylık dişi danalar)'
  },
  { 
    value: 'anthrax', 
    label: 'Şarbon Aşısı',
    description: 'Şarbon hastalığına karşı koruma',
    frequency: 'Yılda bir'
  },
  { 
    value: 'blackleg', 
    label: 'Yanıkara Aşısı',
    description: 'Yanıkara hastalığına karşı koruma',
    frequency: 'Yılda bir'
  },
  { 
    value: 'ibr', 
    label: 'IBR Aşısı',
    description: 'Infectious Bovine Rhinotracheitis',
    frequency: 'Yılda bir'
  },
  { 
    value: 'bvd', 
    label: 'BVD Aşısı',
    description: 'Bovine Viral Diarrhea',
    frequency: 'Yılda bir'
  },
  { 
    value: 'pasteurella', 
    label: 'Pasteurella Aşısı',
    description: 'Solunum yolu enfeksiyonlarına karşı koruma',
    frequency: 'Yılda bir'
  },
  { 
    value: 'clostridial', 
    label: 'Clostridial Aşı',
    description: 'Çoklu clostridial hastalıklara karşı koruma',
    frequency: 'Yılda bir'
  },
  { 
    value: 'leptospirosis', 
    label: 'Leptospirosis Aşısı',
    description: 'Leptospirosis hastalığına karşı koruma',
    frequency: '6 ayda bir'
  },
  { 
    value: 'rabies', 
    label: 'Kuduz Aşısı',
    description: 'Kuduz hastalığına karşı koruma',
    frequency: 'Yılda bir'
  }
] as const;

export const TreatmentForm: React.FC<TreatmentFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<TreatmentFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TreatmentFormData, string>>>({});
  const [selectedVaccine, setSelectedVaccine] = useState<typeof vaccineTypes[0] | null>(null);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TreatmentFormData, string>> = {};

    if (!formData.animalId) newErrors.animalId = 'Hayvan numarası gerekli';
    if (!formData.diagnosis) newErrors.diagnosis = 'Tanı gerekli';
    if (!formData.treatment) newErrors.treatment = 'Tedavi gerekli';
    if (!formData.veterinarian) newErrors.veterinarian = 'Veteriner hekim gerekli';

    if (formData.type === 'medication' && formData.medication) {
      if (!formData.medication.name) newErrors['medication.name'] = 'İlaç adı gerekli';
      if (!formData.medication.dosage) newErrors['medication.dosage'] = 'Doz gerekli';
    }

    if (formData.type === 'vaccination' && formData.vaccination) {
      if (!formData.vaccination.vaccineName) newErrors['vaccination.vaccineName'] = 'Aşı adı gerekli';
      if (!formData.vaccination.batchNumber) newErrors['vaccination.batchNumber'] = 'Parti numarası gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
      onClose();
    }
  };

  const handleVaccineChange = (vaccineValue: string) => {
    const vaccine = vaccineTypes.find(v => v.value === vaccineValue);
    setSelectedVaccine(vaccine || null);
    
    if (vaccine) {
      setFormData({
        ...formData,
        vaccination: {
          ...formData.vaccination,
          vaccineName: vaccine.label
        },
        diagnosis: `${vaccine.label} uygulaması`,
        treatment: `${vaccine.label} uygulandı. ${vaccine.description}. Uygulama sıklığı: ${vaccine.frequency}`
      });
    }
  };

  const renderMedicationFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İlaç Adı *
        </label>
        <input
          type="text"
          value={formData.medication?.name || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: { ...formData.medication, name: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors['medication.name'] && (
          <p className="text-red-500 text-sm mt-1">{errors['medication.name']}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Uygulama Yolu *
        </label>
        <select
          value={formData.medication?.route || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: { ...formData.medication, route: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seçiniz</option>
          {medicationRoutes.map((route) => (
            <option key={route.value} value={route.value}>
              {route.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Doz *
        </label>
        <input
          type="text"
          value={formData.medication?.dosage || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: { ...formData.medication, dosage: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: 10ml"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Uygulama Sıklığı *
        </label>
        <input
          type="text"
          value={formData.medication?.frequency || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: { ...formData.medication, frequency: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: Günde 2 kez"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tedavi Süresi *
        </label>
        <input
          type="text"
          value={formData.medication?.duration || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: { ...formData.medication, duration: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: 5 gün"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İlaç Arınma Süresi
        </label>
        <input
          type="text"
          value={formData.medication?.withdrawalPeriod || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              medication: {
                ...formData.medication,
                withdrawalPeriod: e.target.value,
              },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: Süt için 3 gün"
        />
      </div>
    </div>
  );

  const renderVaccinationFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aşı Türü *
          </label>
          <select
            value={selectedVaccine?.value || ''}
            onChange={(e) => handleVaccineChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Aşı Seçiniz</option>
            {vaccineTypes.map((vaccine) => (
              <option key={vaccine.value} value={vaccine.value}>
                {vaccine.label}
              </option>
            ))}
          </select>
        </div>

        {selectedVaccine && (
          <div className="col-span-2 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{selectedVaccine.label}</h4>
            <p className="text-sm text-blue-800 mb-1">{selectedVaccine.description}</p>
            <p className="text-sm text-blue-800">Uygulama sıklığı: {selectedVaccine.frequency}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parti Numarası *
          </label>
          <input
            type="text"
            value={formData.vaccination?.batchNumber || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                vaccination: {
                  ...formData.vaccination,
                  batchNumber: e.target.value,
                },
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Uygulama Bölgesi *
          </label>
          <select
            value={formData.vaccination?.site || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                vaccination: { ...formData.vaccination, site: e.target.value },
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seçiniz</option>
            {injectionSites.map((site) => (
              <option key={site.value} value={site.value}>
                {site.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sonraki Aşı Tarihi
          </label>
          <input
            type="date"
            value={formData.vaccination?.nextDueDate || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                vaccination: {
                  ...formData.vaccination,
                  nextDueDate: e.target.value,
                },
              })
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSurgeryFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cerrahi İşlem *
        </label>
        <input
          type="text"
          value={formData.surgery?.procedure || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              surgery: { ...formData.surgery, procedure: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anestezi Yöntemi *
        </label>
        <input
          type="text"
          value={formData.surgery?.anesthesia || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              surgery: { ...formData.surgery, anesthesia: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İşlem Süresi
        </label>
        <input
          type="text"
          value={formData.surgery?.duration || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              surgery: { ...formData.surgery, duration: e.target.value },
            })
          }
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Örn: 45 dakika"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Komplikasyonlar
        </label>
        <textarea
          value={formData.surgery?.complications || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              surgery: { ...formData.surgery, complications: e.target.value },
            })
          }
          rows={3}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Yeni Tedavi Kaydı</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hayvan No *
                </label>
                <input
                  type="text"
                  value={formData.animalId}
                  onChange={(e) =>
                    setFormData({ ...formData, animalId: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="TR123456789"
                />
                {errors.animalId && (
                  <p className="text-red-500 text-sm mt-1">{errors.animalId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tedavi Türü *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as TreatmentType,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {treatmentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Veteriner Hekim *
                </label>
                <input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) =>
                    setFormData({ ...formData, veterinarian: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Veteriner hekim adı"
                />
                {errors.veterinarian && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.veterinarian}
                  </p>
                )}
              </div>
            </div>

            {/* Tanı ve Tedavi */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanı *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hastalık tanısı"
                />
                {errors.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">{errors.diagnosis}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tedavi Planı *
                </label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Uygulanan tedavi..."
                />
                {errors.treatment && (
                  <p className="text-red-500 text-sm mt-1">{errors.treatment}</p>
                )}
              </div>
            </div>

            {/* Tedavi Türüne Göre Ek Alanlar */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">
                {formData.type === 'medication'
                  ? 'İlaç Bilgileri'
                  : formData.type === 'vaccination'
                  ? 'Aşı Bilgileri'
                  : formData.type === 'surgery'
                  ? 'Cerrahi Bilgiler'
                  : 'Ek Bilgiler'}
              </h3>
              {formData.type === 'medication' && renderMedicationFields()}
              {formData.type === 'vaccination' && renderVaccinationFields()}
              {formData.type === 'surgery' && renderSurgeryFields()}
            </div>

            {/* Takip ve Maliyet */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontrol Tarihi
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) =>
                    setFormData({ ...formData, followUpDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maliyet (TL)
                </label>
                <input
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Notlar */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notlar
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ek notlar..."
              />
            </div>
          </div>

          {/* Form Kontrolleri */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};