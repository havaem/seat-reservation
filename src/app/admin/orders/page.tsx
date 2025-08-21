"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import OrderManagement from "@/components/admin/OrderManagement";
import { AuthProvider } from "@/contexts/AuthContext";

export default function AdminOrdersPage() {
  return (
    <AuthProvider>
      <AdminGuard>
        <OrderManagement />
      </AdminGuard>
    </AuthProvider>
  );
}
