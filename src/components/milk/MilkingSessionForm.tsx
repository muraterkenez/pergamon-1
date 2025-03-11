import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useSupabaseContext } from '../../contexts/SupabaseContext';
import { useAnimals } from '../../hooks/useAnimals';
import { useMilkProduction } from '../../hooks/useMilkProduction';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface MilkingSessionFormProps {
  sessionId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const MilkingSessionForm: React.FC<MilkingSessionFormProps> = ({
  sessionId,
  onClose,
  onSuccess
}) => {
  const { user } = useSupabaseContext();
  const { animals } = useAnimals();
  const { sessions, updateSession } = useMilkProduction();
  const [loading, setLoading] = useState(false);
  const [isGroupEntry, setIsGroupEntry] = useState(false);
  const [totalMilk, setTotalMilk] = useState<number | ''>('');
  const [selectedAnimals, setSelectedAnimals] = useState<{
    [key: string]: { quantity: number; temperature?: number };
  }>({});
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    session: 'morning' as 'morning' | 'evening',
    startTime: '',
    endTime: '',
    notes: '',
  });

  useEffect(() => {
    if (sessionId) {
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        setFormData({
          date: session.session_date,
          session: session.session_type,
          startTime: session.start_time ? new Date(session.start_time).toTimeString().slice(0, 5) : '',
          endTime: session.end_time ? new Date(session.end_time).toTimeString().slice(0, 5) : '',
          notes: session.notes || '',
        });

        const animalRecords = session.milk_records?.reduce((acc, record) => {
          acc[record.animal_id] = {
            quantity: record.quantity,
            temperature: record.temperature || undefined,
          };
          return acc;
        }, {} as typeof selectedAnimals) || {};

        setSelectedAnimals(animalRecords);
        setTotalMilk(session.total_milk || '');
      }
    }
  }, [sessionId, sessions]);

  const lactatingAnimals = animals.filter(animal => 
    animal.group_type === 'lactating' && animal.status === 'active'
  );

  const handleTotalMilkChange = (value: number) => {
    setTotalMilk(value);
    if (value && lactatingAnimals.length > 0) {
      // Her hayvana eşit miktarda dağıt
      const perAnimal = value / lactatingAnimals.length;
      const newSelectedAnimals = lactatingAnimals.reduce((acc, animal) => {
        acc[animal.id] = {
          quantity: Number(perAnimal.toFixed(1)),
          temperature: selectedAnimals[animal.id]?.temperature,
        };
        return acc;
      }, {} as typeof selectedAnimals);
      setSelectedAnimals(newSelectedAnimals);
    }
  };

  const handleAnimalSelect = (animalId: string, data: { quantity: number; temperature?: number }) => {
    if (isGroupEntry) {
      setIsGroupEntry(false);
      setTotalMilk('');
    }
    setSelectedAnimals(prev => ({
      ...prev,
      [animalId]: data,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);

      if (sessionId) {
        // Mevcut seansı güncelle
        await updateSession(sessionId, {
          session_date: formData.date,
          session_type: formData.session,
          start_time: formData.startTime ? `${formData.date}T${formData.startTime}:00` : null,
          end_time: formData.endTime ? `${formData.date}T${formData.endTime}:00` : null,
          notes: formData.notes,
          total_milk: Object.values(selectedAnimals).reduce(
            (sum, animal) => sum + (animal.quantity || 0),
            0
          ),
        });

        toast.success('Sağım seansı güncellendi');
      } else {
        // Yeni seans oluştur
        const { data: session, error: sessionError } = await supabase
          .from('milk_sessions')
          .insert({
            session_date: formData.date,
            session_type: formData.session,
            start_time: formData.startTime ? `${formData.date}T${formData.startTime}:00` : new Date().toISOString(),
            end_time: formData.endTime ? `${formData.date}T${formData.endTime}:00` : null,
            milker_id: user.id,
            notes: formData.notes,
            total_milk: Object.values(selectedAnimals).reduce(
              (sum, animal) => sum + (animal.quantity || 0),
              0
            ),
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        // Hayvan bazlı kayıtları oluştur
        const records = Object.entries(selectedAnimals).map(([animalId, data]) => ({
          session_id: session.id,
          animal_id: animalId,
          quantity: data.quantity,
          temperature: data.temperature,
        }));

        const { error: recordsError } = await supabase
          .from('milk_records')
          .insert(records);

        if (recordsError) throw recordsError;

        toast.success('Sağım kaydı başarıyla oluşturuldu');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Sağım kaydı işlemi sırasında hata:', error);
      toast.error(sessionId ? 'Sağım kaydı güncellenemedi' : 'Sağım kaydı oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {sessionId ? 'Sağım Kaydını Düzenle' : 'Yeni Sağım Kaydı'}
            </h2>
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
                  Tarih
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
                  Sağım Zamanı
                </label>
                <select
                  value={formData.session}
                  onChange={(e) =>
                    setFormData({ ...formData, session: e.target.value as 'morning' | 'evening' })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="morning">Sabah Sağımı</option>
                  <option value="evening">Akşam Sağımı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Saati
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş Saati
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Toplam Süt Miktarı */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isGroupEntry}
                    onChange={(e) => {
                      setIsGroupEntry(e.target.checked);
                      if (!e.target.checked) {
                        setTotalMilk('');
                        setSelectedAnimals({});
                      }
                    }}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Toplam miktar girişi
                  </span>
                </label>
                <div className="flex-1" />
                <div className="text-sm text-gray-500">
                  Laktasyonda {lactatingAnimals.length} hayvan
                </div>
              </div>

              {isGroupEntry && (
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Süt Miktarı (L)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={totalMilk}
                      onChange={(e) => handleTotalMilkChange(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-sm text-gray-500 pb-2">
                    Hayvan başına: {totalMilk && lactatingAnimals.length > 0
                      ? (Number(totalMilk) / lactatingAnimals.length).toFixed(1)
                      : '-'} L
                  </div>
                </div>
              )}
            </div>

            {/* Hayvan Listesi */}
            <div>
              <h3 className="text-lg font-medium mb-4">Sağılan Hayvanlar</h3>
              <div className="space-y-4">
                {lactatingAnimals.map((animal) => (
                  <div key={animal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {animal.name || animal.national_id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {animal.national_id}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Miktar (L)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={selectedAnimals[animal.id]?.quantity || ''}
                            onChange={(e) =>
                              handleAnimalSelect(animal.id, {
                                ...selectedAnimals[animal.id],
                                quantity: Number(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sıcaklık (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={selectedAnimals[animal.id]?.temperature || ''}
                            onChange={(e) =>
                              handleAnimalSelect(animal.id, {
                                ...selectedAnimals[animal.id],
                                temperature: Number(e.target.value),
                              })
                            }
                            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {lactatingAnimals.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    Laktasyonda hayvan bulunmuyor
                  </div>
                )}
              </div>
            </div>

            {/* Notlar */}
            <div>
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
                placeholder="Varsa özel durumları belirtin..."
              />
            </div>
          </div>

          {/* Form Kontrolleri */}
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                sessionId ? 'Güncelle' : 'Kaydet'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};