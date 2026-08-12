import { api } from "./api";
import { ApiResponse, ContactMessage } from "@/types";

export const contactService = {
  submit: (payload: { name: string; email: string; subject: string; message: string }) =>
    api.post<ApiResponse<ContactMessage>>("/contact", payload),
  list: () => api.get<ApiResponse<ContactMessage[]>>("/contact"),
  markRead: (id: string) => api.put<ApiResponse<ContactMessage>>(`/contact/${id}/read`),
  remove: (id: string) => api.delete<ApiResponse<null>>(`/contact/${id}`),
};
