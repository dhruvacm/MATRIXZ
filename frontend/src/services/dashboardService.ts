import { api } from "./api";
import { ApiResponse, DashboardStats } from "@/types";

export const dashboardService = {
  stats: () => api.get<ApiResponse<DashboardStats>>("/admin/dashboard"),
};
