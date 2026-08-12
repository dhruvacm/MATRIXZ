import { api } from "./api";
import { ApiResponse, MatrixzEvent } from "@/types";

export const eventService = {
  list: (type?: "upcoming" | "past") =>
    api.get<ApiResponse<MatrixzEvent[]>>("/events", { params: type ? { type } : {} }),
  listAllAdmin: () => api.get<ApiResponse<MatrixzEvent[]>>("/events/admin/all"),
  getById: (id: string) => api.get<ApiResponse<MatrixzEvent>>(`/events/${id}`),
  create: (formData: FormData) =>
    api.post<ApiResponse<MatrixzEvent>>("/events", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, formData: FormData) =>
    api.put<ApiResponse<MatrixzEvent>>(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  duplicate: (id: string) => api.post<ApiResponse<MatrixzEvent>>(`/events/${id}/duplicate`),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/events/${id}`),
};
