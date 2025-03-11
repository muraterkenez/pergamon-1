import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar,
  Weight,
  Ruler,
  Heart,
  Activity,
  LineChart,
  AlertTriangle,
  Tag,
  Edit,
  Trash2,
  FileText,
  Share2,
  ArrowLeft,
} from 'lucide-react';
import { useAnimals } from '../../hooks/useAnimals';
import { useHealthRecords } from '../../hooks/useHealthRecords';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type Animal = Database['public']['Tables']['animals']['Row'];
type HealthRecord = Database['public']['Tables']['health_records']['Row'];

export const AnimalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnimal, deleteAnimal } = useAnimals();
  const { getAnimalHealthRecords } = useHealthRecords();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchAnimalData(id);
  }, [id]);

  const fetchAnimalData = async (animalId: string) => {
    try {
      setLoading(true);
      const [animalData, records] = await Promise.all([
        getAnimal(animalId),
        getAnimalHealthRecords(animalId)
      ]);

      setAnimal(animalData);
      setHealthRecords(records);
    } catch (error) {
      setError((error as Error).message);
      toast.error('Hayvan bilgileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!animal?.id) return;

    if (window.confirm('Bu hayvanı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAnimal(animal.id);
        navigate('/animals');
      } catch (error) {
        toast.error('Hayvan silinirken hata oluştu');
      }
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

  if (error || !animal) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <p className="font-medium">Hata</p>
          </div>
          <p className="mt-1 text-red-600">{error || 'Hayvan bulunamadı'}</p>
          <button
            onClick={() => navigate('/animals')}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Listeye Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Üst Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/animals')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">
              {animal.name || animal.national_id}
            </h1>
            <span className={`px-2 py-1 rounded-full text-sm ${
              animal.status === 'active' ? 'bg-green-100 text-green-800' :
              animal.status === 'sold' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {animal.status === 'active' ? 'Aktif' :
               animal.status === 'sold' ? 'Satıldı' : 'Ölüm'}
            </span>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Share2 className="w-5 h-5" />
              Paylaş
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <FileText className="w-5 h-5" />
              Rapor
            </button>
            <button
              onClick={() => navigate(`/animals/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-5 h-5" />
              Düzenle
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5" />
              Sil
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Sol Kolon */}
        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
            <div className="space-y-4">
              <div className="flex justify-center mb-6">
                {animal.image_url ? (
                  <img
                    src={animal.image_url}
                    alt={animal.name || animal.national_id}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Resim Yok
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Ulusal Kulak Numarası</p>
                <p className="font-medium">{animal.national_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Doğum Tarihi</p>
                <p className="font-medium">
                  {new Date(animal.birth_date).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Irk</p>
                <p className="font-medium">{animal.breed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cinsiyet</p>
                <p className="font-medium">
                  {animal.gender === 'female' ? 'Dişi' : 'Erkek'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grup</p>
                <p className="font-medium">
                  {animal.group_type === 'lactating' ? 'Laktasyonda' :
                   animal.group_type === 'dry' ? 'Kurudaki' :
                   animal.group_type === 'young' ? 'Genç' : 'Tedavide'}
                </p>
              </div>
            </div>
          </div>

          {/* QR Kod */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">QR Kod</h2>
            <div className="flex flex-col items-center">
              <QRCodeSVG value={animal.national_id} size={200} />
              <p className="text-sm text-gray-500 mt-4">
                Bu QR kodu tarayarak hızlı erişim sağlayabilirsiniz
              </p>
            </div>
          </div>
        </div>

        {/* Orta Kolon */}
        <div className="space-y-6">
          {/* Metrikler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Fiziksel Özellikler</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Weight className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium">Ağırlık</h3>
                </div>
                <p className="text-2xl font-bold">{animal.weight || '-'} kg</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Ruler className="w-5 h-5 text-green-500" />
                  <h3 className="font-medium">Boy</h3>
                </div>
                <p className="text-2xl font-bold">{animal.height || '-'} cm</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h3 className="font-medium">Vücut Kondisyonu</h3>
                </div>
                <p className="text-2xl font-bold">{animal.body_condition_score || '-'}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <h3 className="font-medium">Refah Puanı</h3>
                </div>
                <p className="text-2xl font-bold">{animal.welfare_score || '-'}</p>
              </div>
            </div>
          </div>

          {/* Üreme Bilgileri */}
          {animal.gender === 'female' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Üreme Bilgileri</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Üreme Durumu</p>
                  <p className="font-medium">
                    {animal.reproductive_status === 'open' ? 'Boşta' :
                     animal.reproductive_status === 'inseminated' ? 'Tohumlanmış' :
                     animal.reproductive_status === 'pregnant' ? 'Gebe' : 'Doğum'}
                  </p>
                </div>
                {animal.last_insemination_date && (
                  <div>
                    <p className="text-sm text-gray-500">Son Tohumlama Tarihi</p>
                    <p className="font-medium">
                      {new Date(animal.last_insemination_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}
                {animal.expected_calving_date && (
                  <div>
                    <p className="text-sm text-gray-500">Tahmini Doğum Tarihi</p>
                    <p className="font-medium">
                      {new Date(animal.expected_calving_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Laktasyon Sayısı</p>
                  <p className="font-medium">{animal.lactation_number}</p>
                </div>
              </div>
            </div>
          )}

          {/* Soy Bilgileri */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Soy Bilgileri</h2>
            <div className="space-y-4">
              {animal.mother_id && (
                <div>
                  <p className="text-sm text-gray-500">Anne</p>
                  <p className="font-medium">
                    {animal.mother?.name || animal.mother?.national_id || '-'}
                  </p>
                </div>
              )}
              {animal.father_id && (
                <div>
                  <p className="text-sm text-gray-500">Baba</p>
                  <p className="font-medium">
                    {animal.father?.name || animal.father?.national_id || '-'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Olay Zaman Çizelgesi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Olay Geçmişi</h2>
            <div className="space-y-4">
              {healthRecords.map((record) => (
                <div key={record.id} className="flex gap-4 items-start">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
                    record.record_type === 'health' ? 'bg-red-100' :
                    record.record_type === 'reproduction' ? 'bg-blue-100' :
                    record.record_type === 'transfer' ? 'bg-green-100' :
                    record.record_type === 'measurement' ? 'bg-purple-100' :
                    'bg-yellow-100'
                  }`}>
                    {record.record_type === 'health' && <Heart className="w-6 h-6 text-red-500" />}
                    {record.record_type === 'reproduction' && <Calendar className="w-6 h-6 text-blue-500" />}
                    {record.record_type === 'transfer' && <Tag className="w-6 h-6 text-green-500" />}
                    {record.record_type === 'measurement' && <LineChart className="w-6 h-6 text-purple-500" />}
                    {record.record_type === 'welfare' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
                  </div>
                  <div>
                    <p className="font-medium">{record.diagnosis || record.treatment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.record_date).toLocaleDateString('tr-TR')} - {record.performed_by}
                    </p>
                    {record.medication && (
                      <div className="mt-2 text-sm text-gray-600">
                        {Object.entries(record.medication as Record<string, unknown>).map(([key, value]) => (
                          <p key={key}>
                            {key}: {value as string}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {healthRecords.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Henüz kayıtlı olay bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};