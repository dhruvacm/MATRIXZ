import { api } from "./api";
import { ApiResponse, Achievement } from "@/types";

export const achievementService = {
  list: (category?: string) =>
    api.get<ApiResponse<Achievement[]>>("/achievements", { params: category ? { category } : {} }),
  listAdmin: () => api.get<ApiResponse<Achievement[]>>("/achievements/admin/all"),
  create: (formData: FormData) =>
    api.post<ApiResponse<Achievement>>("/achievements", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, formData: FormData) =>
    api.put<ApiResponse<Achievement>>(`/achievements/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/achievements/${id}`),
};
