import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type Role = Database['public']['Tables']['roles']['Row'];
type Permission = Database['public']['Tables']['permissions']['Row'];
type RolePermission = Database['public']['Tables']['role_permissions']['Row'];

export function useRoles() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getRoles() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .select(`
          *,
          permissions:role_permissions(
            permission:permission_id(*)
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Roller yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function createRole(role: Omit<Role, 'id' | 'created_at' | 'updated_at'>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .insert(role)
        .select()
        .single();

      if (error) throw error;

      toast.success('Rol oluşturuldu');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Rol oluşturulurken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id: string, updates: Partial<Role>) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Rol güncellendi');
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Rol güncellenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteRole(id: string) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Rol silindi');
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('Rol silinirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getPermissions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('İzinler yüklenirken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function assignPermissionToRole(roleId: string, permissionId: string) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('role_permissions')
        .insert({ role_id: roleId, permission_id: permissionId });

      if (error) throw error;

      toast.success('İzin role atandı');
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('İzin atanırken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removePermissionFromRole(roleId: string, permissionId: string) {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId)
        .eq('permission_id', permissionId);

      if (error) throw error;

      toast.success('İzin rolden kaldırıldı');
    } catch (error) {
      const message = (error as Error).message;
      setError(message);
      toast.error('İzin kaldırılırken hata oluştu');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions,
    assignPermissionToRole,
    removePermissionFromRole,
  };
}