import React, { useState } from 'react';
import { X, AlertTriangle, QrCode } from 'lucide-react';
import type { StockItem, StockCategory, UnitType } from '../../types/stock';
import toast from 'react-hot-toast';

interface AddStockFormProps {
  onClose: () => void;
}

const categories = [
  { value: 'feed', label: 'Yem' },
  { value: 'raw_material', label: 'Hammadde' },
  { value: 'veterinary', label: 'Veteriner Malzemesi' },
  { value: 'dairy_product', label: 'Süt Ürünü' },
  { value: 'equipment', label: 'Ekipman' },
] as const;

const units = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'liter', label: 'Litre' },
  { value: 'piece', label: 'Adet' },
  { value: 'box', label: 'Kutu' },
  { value: 'package', label: 'Paket' },
] as const;

const feedTypes = [
  { value: 'concentrate', label: 'Konsantre Yem' },
  { value: 'roughage', label: 'Kaba Yem' },
  { value: 'mineral', label: 'Mineral' },
  { value: 'supplement', label: 'Takviye' },
] as const;

const rawMaterialTypes = [
  { value: 'silage', label: 'Silaj' },
  { value: 'hay', label: 'Kuru Ot' },
  { value: 'grain', label: 'Tahıl' },
  { value: 'additive', label: 'Katkı Maddesi' },
] as const;

const veterinaryTypes = [
  { value: 'medicine', label: 'İlaç' },
  { value: 'vaccine', label: 'Aşı' },
  { value: 'supply', label: 'Sarf Malzemesi' },
  { value: 'equipment', label: 'Ekipman' },
] as const;

const dairyProductTypes = [
  { value: 'milk', label: 'Süt' },
  { value: 'cheese', label: 'Peynir' },
  { value: 'yogurt', label: 'Yoğurt' },
  { value: 'butter', label: 'Tereyağı' },
] as const;

interface FormData extends Partial<StockItem> {
  type?: string;
  nutritionalValue?: {
    protein: number;
    energy: number;
    fiber: number;
    moisture: number;
  };
  activeIngredient?: string;
  dosageForm?: string;
  storageConditions?: string;
  prescriptionRequired?: boolean;
  fatContent?: number;
  processingDate?: string;
  batchNumber?: string;
}

const initialFormData: FormData = {
  name: '',
  category: 'feed',
  sku: '',
  barcode: '',
  unit: 'kg',
  quantity: 0,
  minQuantity: 0,
  maxQuantity: 0,
  location: '',
  price: 0,
  description: '',
};

export const AddStockForm: React.FC<AddStockFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name) newErrors.name = 'Ürün adı gerekli';
    if (!formData.sku) newErrors.sku = 'Stok kodu gerekli';
    if (!formData.quantity) newErrors.quantity = 'Miktar gerekli';
    if (!formData.minQuantity) newErrors.minQuantity = 'Minimum stok seviyesi gerekli';
    if (!formData.location) newErrors.location = 'Konum gerekli';
    if (!formData.price) newErrors.price = 'Fiyat gerekli';

    if (formData.category === 'veterinary') {
      if (!formData.expiryDate) newErrors.expiryDate = 'Son kullanma tarihi gerekli';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form data:', formData);
      toast.success('Stok başarıyla eklendi');
      onClose();
    }
  };

  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'feed':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yem Türü
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {feedTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protein (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionalValue?.protein || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalValue: {
                        ...formData.nutritionalValue,
                        protein: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enerji (ME/kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nutritionalValue?.energy || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nutritionalValue: {
                        ...formData.nutritionalValue,
                        energy: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'veterinary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Türü
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {veterinaryTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etken Madde
              </label>
              <input
                type="text"
                value={formData.activeIngredient || ''}
                onChange={(e) =>
                  setFormData({ ...formData, activeIngredient: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Son Kullanma Tarihi *
              </label>
              <input
                type="date"
                value={formData.expiryDate?.toISOString().split('T')[0] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate: new Date(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.prescriptionRequired || false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prescriptionRequired: e.target.checked,
                    })
                  }
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Reçete Gerekli</span>
              </label>
            </div>
          </div>
        );

      case 'dairy_product':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ürün Türü
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçiniz</option>
                {dairyProductTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yağ Oranı (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fatContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fatContent: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Üretim Tarihi
                </label>
                <input
                  type="date"
                  value={formData.processingDate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      processingDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parti Numarası
              </label>
              <input
                type="text"
                value={formData.batchNumber || ''}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Yeni Stok Girişi</h2>
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
                  Ürün Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as StockCategory,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stok Kodu (SKU) *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.sku && (
                  <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barkod
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      setFormData({ ...formData, barcode: e.target.value })
                    }
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Miktar ve Birim */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birim *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value as UnitType })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Miktar *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stok *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.minQuantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.minQuantity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Stok
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.maxQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Konum ve Fiyat */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depo Konumu *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birim Fiyat (TL) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            {/* Kategori Özel Alanları */}
            {renderCategorySpecificFields()}

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Açıklama
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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