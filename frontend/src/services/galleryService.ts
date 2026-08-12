import { api } from "./api";
import { ApiResponse, GalleryImage } from "@/types";

export const galleryService = {
  list: (category?: string) =>
    api.get<ApiResponse<GalleryImage[]>>("/gallery", { params: category ? { category } : {} }),
  listAdmin: () => api.get<ApiResponse<GalleryImage[]>>("/gallery/admin/all"),
  upload: (formData: FormData) =>
    api.post<ApiResponse<GalleryImage[]>>("/gallery", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, payload: Partial<GalleryImage>) => api.put<ApiResponse<GalleryImage>>(`/gallery/${id}`, payload),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/gallery/${id}`),
};
