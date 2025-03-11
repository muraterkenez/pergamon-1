import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Calendar,
  FileText,
  Filter,
  Plus,
  Search,
  Stethoscope,
  Thermometer,
  Download,
} from 'lucide-react';
import { HealthMetrics } from './HealthMetrics';
import { VetVisitSchedule } from './VetVisitSchedule';
import { VaccinationCalendar } from './VaccinationCalendar';
import { TreatmentForm } from './TreatmentForm';
import { DiseaseStats } from './DiseaseStats';
import { MastitisMonitoring } from './MastitisMonitoring';
import { LamenessTracking } from './LamenessTracking';
import { MetabolicDisorders } from './MetabolicDisorders';
import { BodyConditionScoring } from './BodyConditionScoring';
import { MedicationInventory } from './MedicationInventory';
import { LabResults } from './LabResults';
import { BiosecurityChecklist } from './BiosecurityChecklist';

export const HealthDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showTreatmentForm, setShowTreatmentForm] = React.useState(false);

  return (
    <div className="p-6">
      {/* Üst Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sağlık Takibi</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowTreatmentForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Yeni Tedavi Kaydı
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filtrele
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download className="w-5 h-5" />
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Ana Metrikler */}
      <HealthMetrics />

      {/* Alt Modüller */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Veteriner Ziyaret Planı */}
        <VetVisitSchedule />

        {/* Aşılama Takvimi */}
        <VaccinationCalendar />

        {/* Hastalık İstatistikleri */}
        <DiseaseStats />

        {/* Mastitis Takibi */}
        <MastitisMonitoring />

        {/* Topallık Takibi */}
        <LamenessTracking />

        {/* Metabolik Hastalıklar */}
        <MetabolicDisorders />

        {/* Vücut Kondisyon Skorlaması */}
        <BodyConditionScoring />

        {/* İlaç Envanteri */}
        <MedicationInventory />

        {/* Laboratuvar Sonuçları */}
        <LabResults />

        {/* Biyogüvenlik Kontrol Listesi */}
        <BiosecurityChecklist />
      </div>

      {/* Tedavi Kayıt Formu Modal */}
      {showTreatmentForm && (
        <TreatmentForm onClose={() => setShowTreatmentForm(false)} />
      )}
    </div>
  );
};