"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import SeatMapManagement from "@/components/admin/SeatMapManagement";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AdminSeatsPage() {
  return (
    <AuthProvider>
      <AdminGuard>
        <SeatMapManagement />
      </AdminGuard>
    </AuthProvider>
  );
}
