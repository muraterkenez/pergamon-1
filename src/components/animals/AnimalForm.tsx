import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Save, X } from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type Animal = Database['public']['Tables']['animals']['Insert'];

const initialFormData: Animal = {
  national_id: '',
  name: '',
  birth_date: new Date().toISOString().split('T')[0],
  gender: 'female',
  breed: '',
  status: 'active',
  group_type: 'young',
  weight: null,
  height: null,
  body_condition_score: 3.0,
  lactation_number: 0,
  welfare_score: 85,
  reproductive_status: 'open',
  notes: '',
};

export const AnimalForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getAnimal, createAnimal, updateAnimal } = useAnimals();
  
  const [formData, setFormData] = useState<Animal>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Animal, string>>>({});

  useEffect(() => {
    if (id) {
      loadAnimal(id);
    }
  }, [id]);

  const loadAnimal = async (animalId: string) => {
    try {
      setLoading(true);
      const animal = await getAnimal(animalId);
      if (animal) {
        setFormData({
          ...animal,
          birth_date: new Date(animal.birth_date).toISOString().split('T')[0],
          last_insemination_date: animal.last_insemination_date 
            ? new Date(animal.last_insemination_date).toISOString().split('T')[0]
            : undefined,
          expected_calving_date: animal.expected_calving_date
            ? new Date(animal.expected_calving_date).toISOString().split('T')[0]
            : undefined,
        });
      }
    } catch (error) {
      toast.error('Hayvan bilgileri yüklenirken hata oluştu');
      navigate('/animals');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Animal, string>> = {};

    if (!formData.national_id) newErrors.national_id = 'Ulusal kulak numarası gerekli';
    if (!formData.birth_date) newErrors.birth_date = 'Doğum tarihi gerekli';
    if (!formData.breed) newErrors.breed = 'Irk gerekli';
    if (!formData.gender) newErrors.gender = 'Cinsiyet gerekli';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await updateAnimal(id, formData);
        toast.success('Hayvan kaydı güncellendi');
      } else {
        await createAnimal(formData);
        toast.success('Hayvan kaydı oluşturuldu');
      }

      navigate('/animals');
    } catch (error) {
      toast.error('Kayıt işlemi başarısız oldu');
    } finally {
      setLoading(false);
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
    <form onSubmit={handleSubmit} className="p-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {id ? 'Hayvan Düzenle' : 'Yeni Hayvan Ekle'}
            </h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/animals')}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {id ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sol Kolon */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Temel Bilgiler</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ulusal Kulak Numarası *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.national_id}
                      onChange={(e) =>
                        setFormData({ ...formData, national_id: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="TR123456789"
                    />
                    {errors.national_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.national_id}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İsim
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="İsteğe bağlı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doğum Tarihi *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.birth_date}
                      onChange={(e) =>
                        setFormData({ ...formData, birth_date: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.birth_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Irk *
                    </label>
                    <select
                      required
                      value={formData.breed}
                      onChange={(e) =>
                        setFormData({ ...formData, breed: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Holstein">Holstein</option>
                      <option value="Simental">Simental</option>
                      <option value="Jersey">Jersey</option>
                      <option value="Brown Swiss">Brown Swiss</option>
                    </select>
                    {errors.breed && (
                      <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Durum Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cinsiyet *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.gender === 'female'}
                          onChange={() =>
                            setFormData({ ...formData, gender: 'female' })
                          }
                          className="mr-2"
                        />
                        Dişi
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={formData.gender === 'male'}
                          onChange={() =>
                            setFormData({ ...formData, gender: 'male' })
                          }
                          className="mr-2"
                        />
                        Erkek
                      </label>
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grup *
                    </label>
                    <select
                      required
                      value={formData.group_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          group_type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="young">Genç</option>
                      <option value="lactating">Laktasyonda</option>
                      <option value="dry">Kurudaki</option>
                      <option value="treatment">Tedavide</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ Kolon */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Fiziksel Özellikler</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ağırlık (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.weight || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: Number(e.target.value) || null })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Boy (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.height || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, height: Number(e.target.value) || null })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vücut Kondisyon Skoru (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.body_condition_score || 3.0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          body_condition_score: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {formData.gender === 'female' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Üreme Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Üreme Durumu
                      </label>
                      <select
                        value={formData.reproductive_status || 'open'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reproductive_status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="open">Boşta</option>
                        <option value="inseminated">Tohumlanmış</option>
                        <option value="pregnant">Gebe</option>
                        <option value="calving">Doğum</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Son Tohumlama Tarihi
                      </label>
                      <input
                        type="date"
                        value={formData.last_insemination_date || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_insemination_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tahmini Doğum Tarihi
                      </label>
                      <input
                        type="date"
                        value={formData.expected_calving_date || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            expected_calving_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Laktasyon Sayısı
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.lactation_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lactation_number: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Ek Bilgiler</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RFID/Elektronik Küpe No
                    </label>
                    <input
                      type="text"
                      value={formData.rfid_tag || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, rfid_tag: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="İsteğe bağlı"
                    />
                  </div>

                  <div>
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
                      placeholder="Özel notlar..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fotoğraf
                    </label>
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
                      <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Fotoğraf Yükle</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                            />
                          </label>
                          <p className="pl-1">veya sürükleyip bırakın</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF max 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};