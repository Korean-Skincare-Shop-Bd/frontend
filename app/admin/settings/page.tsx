import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SettingsManager } from '@/components/admin/SettingsManagert';

export default function AdminSettingsPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <SettingsManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}