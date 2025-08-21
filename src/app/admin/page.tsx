"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminGuard>
        <AdminDashboard />
      </AdminGuard>
    </AuthProvider>
  );
}
