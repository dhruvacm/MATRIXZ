import { api } from "./api";
import { ApiResponse, Admin } from "@/types";

export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; admin: Admin }>>("/auth/login", { email, password }),
  me: () => api.get<ApiResponse<Admin>>("/auth/me"),
};
