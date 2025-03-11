import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

interface QRScannerProps {
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onClose }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">QR Kod Tarayıcı</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div id="qr-reader" className="w-full"></div>
          {scanResult && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-700">Kod başarıyla tarandı:</p>
              <p className="font-medium mt-1">{scanResult}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <p className="text-sm text-gray-500">
            Stok kartı veya ürün üzerindeki QR kodu kamera ile tarayın
          </p>
        </div>
      </div>
    </div>
  );
};