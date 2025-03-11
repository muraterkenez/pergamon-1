import React, { useState, useEffect } from 'react';
import { Shield, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useRoles } from '../../hooks/useRoles';
import type { Database } from '../../lib/database.types';
import toast from 'react-hot-toast';

type Role = Database['public']['Tables']['roles']['Row'];
type Permission = Database['public']['Tables']['permissions']['Row'];

export const RoleManagement: React.FC = () => {
  const {
    loading,
    error,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions,
    assignPermissionToRole,
    removePermissionFromRole,
  } = useRoles();

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rolesData, permissionsData] = await Promise.all([
        getRoles(),
        getPermissions(),
      ]);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (selectedRole) {
        await updateRole(selectedRole.id, formData);
      } else {
        await createRole(formData);
      }

      setShowAddModal(false);
      setSelectedRole(null);
      setFormData({ name: '', description: '' });
      loadData();
    } catch (error) {
      console.error('Form gönderilirken hata:', error);
    }
  };

  const handleDelete = async (role: Role) => {
    if (window.confirm(`${role.name} rolünü silmek istediğinizden emin misiniz?`)) {
      try {
        await deleteRole(role.id);
        loadData();
      } catch (error) {
        console.error('Rol silinirken hata:', error);
      }
    }
  };

  const handlePermissionToggle = async (roleId: string, permissionId: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await removePermissionFromRole(roleId, permissionId);
      } else {
        await assignPermissionToRole(roleId, permissionId);
      }
      loadData();
    } catch (error) {
      console.error('İzin güncellenirken hata:', error);
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Veriler yüklenirken bir hata oluştu</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Başlık ve Butonlar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rol ve İzin Yönetimi</h1>
          <p className="text-gray-500 mt-1">Sistem rollerini ve izinlerini yönetin</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSelectedRole(null);
              setFormData({ name: '', description: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            Yeni Rol
          </button>
        </div>
      </div>

      {/* Rol Listesi */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role.id} className="border rounded-lg">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRole(role);
                        setFormData({
                          name: role.name,
                          description: role.description || '',
                        });
                        setShowAddModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* İzin Listesi */}
                <div className="border-t p-4">
                  <h4 className="font-medium mb-3">İzinler</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {permissions.map((permission) => {
                      const hasPermission = role.permissions?.some(
                        (p) => p.permission.id === permission.id
                      );

                      return (
                        <button
                          key={permission.id}
                          onClick={() =>
                            handlePermissionToggle(role.id, permission.id, !!hasPermission)
                          }
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            hasPermission
                              ? 'bg-green-50 border-green-200 text-green-700'
                              : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                        >
                          {hasPermission ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          <span className="text-sm">{permission.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rol Ekleme/Düzenleme Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">
                {selectedRole ? 'Rol Düzenle' : 'Yeni Rol Ekle'}
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rol Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
              </div>
              <div className="p-6 border-t flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedRole(null);
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {selectedRole ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};