"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import SettingsManagement from "@/components/admin/SettingsManagement";

export default function AdminSettingsPage() {
  return (
    <AuthProvider>
      <AdminGuard>
        <SettingsManagement />
      </AdminGuard>
    </AuthProvider>
  );
}
