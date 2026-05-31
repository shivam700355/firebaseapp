import { useAuth } from "@/context/AuthContext";
import { ROLE_ADMIN } from "@/utils/constants";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export function useProtectedRoute(requiredRole?: string) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      const redirectPath = user.role === ROLE_ADMIN ? "/admin/dashboard" : "/user/dashboard";
      router.replace(redirectPath);
    }
  }, [loading, requiredRole, router, user]);

  return { ready: !loading && !!user && (!requiredRole || user.role === requiredRole), user };
}
