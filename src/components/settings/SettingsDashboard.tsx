import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import {
  Users,
  Shield,
  Building,
  Settings as SettingsIcon,
  Bell,
  Database,
  FileDown,
  Link,
  FileText,
  QrCode,
  Hash,
  List,
  Archive,
  FileCode,
  Clock,
} from 'lucide-react';
import { SettingsNavigation } from './SettingsNavigation';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { FarmProfile } from './FarmProfile';
import { SystemPreferences } from './SystemPreferences';
import { NotificationSettings } from './NotificationSettings';
import { BackupSettings } from './BackupSettings';
import { DataImportExport } from './DataImportExport';
import { IntegrationSettings } from './IntegrationSettings';
import { ReportTemplates } from './ReportTemplates';
import { LabelSettings } from './LabelSettings';
import { NumberingSettings } from './NumberingSettings';
import { CategoryManagement } from './CategoryManagement';
import { DataRetention } from './DataRetention';
import { SystemLogs } from './SystemLogs';

const settingsMenu = [
  {
    id: 'users',
    label: 'Kullanıcı Yönetimi',
    icon: <Users className="w-5 h-5" />,
    path: 'users',
  },
  {
    id: 'roles',
    label: 'Rol ve İzinler',
    icon: <Shield className="w-5 h-5" />,
    path: 'roles',
  },
  {
    id: 'farm',
    label: 'Çiftlik Profili',
    icon: <Building className="w-5 h-5" />,
    path: 'farm',
  },
  {
    id: 'preferences',
    label: 'Sistem Tercihleri',
    icon: <SettingsIcon className="w-5 h-5" />,
    path: 'preferences',
  },
  {
    id: 'notifications',
    label: 'Bildirim Ayarları',
    icon: <Bell className="w-5 h-5" />,
    path: 'notifications',
  },
  {
    id: 'backup',
    label: 'Yedekleme',
    icon: <Database className="w-5 h-5" />,
    path: 'backup',
  },
  {
    id: 'data',
    label: 'Veri İçe/Dışa Aktarma',
    icon: <FileDown className="w-5 h-5" />,
    path: 'data',
  },
  {
    id: 'integrations',
    label: 'Entegrasyonlar',
    icon: <Link className="w-5 h-5" />,
    path: 'integrations',
  },
  {
    id: 'reports',
    label: 'Rapor Şablonları',
    icon: <FileText className="w-5 h-5" />,
    path: 'reports',
  },
  {
    id: 'labels',
    label: 'Etiket ve Barkod',
    icon: <QrCode className="w-5 h-5" />,
    path: 'labels',
  },
  {
    id: 'numbering',
    label: 'Numara Formatları',
    icon: <Hash className="w-5 h-5" />,
    path: 'numbering',
  },
  {
    id: 'categories',
    label: 'Kategori Yönetimi',
    icon: <List className="w-5 h-5" />,
    path: 'categories',
  },
  {
    id: 'retention',
    label: 'Veri Saklama',
    icon: <Archive className="w-5 h-5" />,
    path: 'retention',
  },
  {
    id: 'logs',
    label: 'Sistem Günlükleri',
    icon: <Clock className="w-5 h-5" />,
    path: 'logs',
  },
] as const;

export const SettingsDashboard: React.FC = () => {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sol Menü */}
      <SettingsNavigation items={settingsMenu} />

      {/* İçerik */}
      <div className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="farm" element={<FarmProfile />} />
          <Route path="preferences" element={<SystemPreferences />} />
          <Route path="notifications" element={<NotificationSettings />} />
          <Route path="backup" element={<BackupSettings />} />
          <Route path="data" element={<DataImportExport />} />
          <Route path="integrations" element={<IntegrationSettings />} />
          <Route path="reports" element={<ReportTemplates />} />
          <Route path="labels" element={<LabelSettings />} />
          <Route path="numbering" element={<NumberingSettings />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="retention" element={<DataRetention />} />
          <Route path="logs" element={<SystemLogs />} />
        </Routes>
      </div>
    </div>
  );
};