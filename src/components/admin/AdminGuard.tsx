"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "@/components/admin/LoginForm";
import AdminLayout from "./AdminLayout";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#f88134] border-t-transparent" />
          <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <LoginForm />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
