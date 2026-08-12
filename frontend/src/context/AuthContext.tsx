import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Admin } from "@/types";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/services/api";

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("matrixz_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then((res) => setAdmin(res.data.data))
      .catch(() => {
        localStorage.removeItem("matrixz_admin_token");
        localStorage.removeItem("matrixz_admin_info");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await authService.login(email, password);
      const { token, admin: adminInfo } = res.data.data;
      localStorage.setItem("matrixz_admin_token", token);
      localStorage.setItem("matrixz_admin_info", JSON.stringify(adminInfo));
      setAdmin(adminInfo);
    } catch (err) {
      throw new Error(getApiErrorMessage(err));
    }
  }

  function logout() {
    localStorage.removeItem("matrixz_admin_token");
    localStorage.removeItem("matrixz_admin_info");
    setAdmin(null);
  }

  return <AuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
