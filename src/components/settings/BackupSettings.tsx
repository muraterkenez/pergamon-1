import React, { useState, useEffect } from 'react';
import { Database, Save, Trash2, RotateCcw, Download, AlertTriangle } from 'lucide-react';
import { useBackupSettings } from '../../hooks/useBackupSettings';
import type { Database as DatabaseTypes } from '../../lib/database.types';
import toast from 'react-hot-toast';

type BackupConfig = DatabaseTypes['public']['Tables']['backup_config']['Row'];
type BackupHistory = DatabaseTypes['public']['Tables']['backup_history']['Row'];

export const BackupSettings: React.FC = () => {
  const {
    loading,
    getBackupConfig,
    updateBackupConfig,
    getBackupHistory,
    createBackup,
    restoreBackup,
    deleteBackup,
  } = useBackupSettings();

  const [config, setConfig] = useState<BackupConfig | null>(null);
  const [history, setHistory] = useState<BackupHistory[]>([]);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configData, historyData] = await Promise.all([
        getBackupConfig(),
        getBackupHistory(),
      ]);
      setConfig(configData);
      setHistory(historyData || []);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      await updateBackupConfig(config);
      loadData();
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      await createBackup();
      loadData();
    } catch (error) {
      console.error('Yedek oluşturulurken hata:', error);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    try {
      await restoreBackup(backupId);
      setShowRestoreConfirm(false);
      setSelectedBackupId(null);
      loadData();
    } catch (error) {
      console.error('Yedek geri yüklenirken hata:', error);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (window.confirm('Bu yedeği silmek istediğinizden emin misiniz?')) {
      try {
        await deleteBackup(backupId);
        loadData();
      } catch (error) {
        console.error('Yedek silinirken hata:', error);
      }
    }
  };

  if (loading && !config) {
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
          <h1 className="text-2xl font-bold">Yedekleme Ayarları</h1>
          <p className="text-gray-500 mt-1">Veritabanı yedekleme ve geri yükleme işlemlerini yönetin</p>
        </div>
        <button
          onClick={handleCreateBackup}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Save className="w-5 h-5" />
          Yeni Yedek Oluştur
        </button>
      </div>

      {/* Yedekleme Ayarları */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Otomatik Yedekleme Ayarları</h2>
          </div>
        </div>
        <form onSubmit={handleConfigSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config?.auto_backup || false}
                  onChange={(e) =>
                    setConfig(config ? { ...config, auto_backup: e.target.checked } : null)
                  }
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Otomatik Yedekleme</span>
              </label>
            </div>

            {config?.auto_backup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yedekleme Sıklığı
                  </label>
                  <select
                    value={config.backup_frequency}
                    onChange={(e) =>
                      setConfig(config ? { ...config, backup_frequency: e.target.value } : null)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yedekleme Saati
                  </label>
                  <input
                    type="time"
                    value={config.backup_time || ''}
                    onChange={(e) =>
                      setConfig(config ? { ...config, backup_time: e.target.value } : null)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maksimum Yedek Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.max_backups || ''}
                    onChange={(e) =>
                      setConfig(config ? { ...config, max_backups: Number(e.target.value) } : null)
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Ayarları Kaydet
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Yedekleme Geçmişi */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Yedekleme Geçmişi</h2>
        </div>
        <div className="p-6">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((backup) => (
                <div
                  key={backup.id}
                  className="border rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">
                        {new Date(backup.created_at).toLocaleString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Boyut: {(backup.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedBackupId(backup.id);
                        setShowRestoreConfirm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Geri Yükle"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Sil"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        // İndirme işlemi
                        window.open(backup.file_url, '_blank');
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                      title="İndir"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Henüz yedekleme yapılmamış
            </div>
          )}
        </div>
      </div>

      {/* Geri Yükleme Onay Modalı */}
      {showRestoreConfirm && selectedBackupId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 text-yellow-600 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Dikkat</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bu yedeği geri yüklemek, mevcut verilerin üzerine yazılmasına neden olacak.
                Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowRestoreConfirm(false);
                    setSelectedBackupId(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleRestoreBackup(selectedBackupId)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                >
                  Geri Yükle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};