import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onClose: () => void;
  onScan?: (data: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onClose, onScan }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        formatsToSupport: ['QR_CODE', 'CODE_128', 'EAN_13', 'CODE_39'], // Yaygın küpe barkod formatları
      },
      false
    );

    scanner.render(
      (decodedText) => {
        // Farklı küpe formatlarını kontrol et
        const tagPatterns = {
          standard: /^TR\d{12}$/, // TR + 12 rakam (il kodu + işletme no + hayvan no)
          legacy: /^TR\d{10}$/, // TR + 10 rakam (eski format)
          rawNumeric: /^\d{12}$/, // Sadece 12 rakam
        };
        
        let normalizedTag = decodedText.trim().toUpperCase();
        
        // Sadece rakamdan oluşan kodlara TR prefix'i ekle
        if (tagPatterns.rawNumeric.test(normalizedTag)) {
          normalizedTag = `TR${normalizedTag}`;
        }

        // Geçerli bir küpe formatı mı kontrol et
        if (tagPatterns.standard.test(normalizedTag) || tagPatterns.legacy.test(normalizedTag)) {
          // Aynı küpenin tekrar okunmasını önle
          if (lastScanned === normalizedTag) {
            return;
          }
          
          setLastScanned(normalizedTag);
          
          // Küpe detaylarını çıkar
          const numericPart = normalizedTag.substring(2);
          const provinceCode = numericPart.substring(0, 2);
          const farmCode = numericPart.substring(2, 8);
          const animalCode = numericPart.substring(8);

          // Başarılı okuma bildirimi
          toast.success('Küpe başarıyla okundu', {
            description: `İl: ${provinceCode}, İşletme: ${farmCode}, Hayvan: ${animalCode}`
          });

          // Özel işlem callback'i varsa çağır
          if (onScan) {
            onScan(normalizedTag);
          } else {
            // Hayvanın detay sayfasına yönlendir
            navigate(`/animals/${normalizedTag}`);
          }
          
          onClose();
        } else {
          setError('Geçersiz küpe formatı. TR ile başlayan 10-12 haneli bir numara olmalıdır.');
        }
      },
      (error) => {
        console.error('Tarama hatası:', error);
        setError('Küpe okunamadı. Lütfen tekrar deneyin.');
      }
    );

    return () => {
      scanner.clear();
    };
  }, [lastScanned]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Küpe Okuyucu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Talimatlar */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Küpe Okutma Talimatları:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Küpeyi kameraya yaklaştırın (15-20 cm mesafe)</li>
                  <li>Küpe üzerindeki barkodu/numarayı net gösterin</li>
                  <li>Yeterli ışık olduğundan emin olun</li>
                  <li>Küpeyi sabit tutun</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Küpe Format Bilgisi */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Küpe Formatı:</p>
                <p><span className="font-mono">TR</span> - Ülke kodu</p>
                <p><span className="font-mono">XX</span> - İl kodu (2 hane)</p>
                <p><span className="font-mono">XXXXXX</span> - İşletme no (6 hane)</p>
                <p><span className="font-mono">XXXX</span> - Hayvan no (4 hane)</p>
              </div>
            </div>
          </div>

          {/* Tarayıcı */}
          <div id="qr-reader" className="w-full"></div>
          
          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <p className="text-sm text-gray-500">
            Okuma başarısız olursa küpe numarasını manuel olarak girebilirsiniz
          </p>
        </div>
      </div>
    </div>
  );
};