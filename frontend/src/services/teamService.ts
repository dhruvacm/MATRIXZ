import { api } from "./api";
import { ApiResponse, Team, TeamMember } from "@/types";

export const teamService = {
  listTeams: () => api.get<ApiResponse<Team[]>>("/teams"),
  listTeamsAdmin: () => api.get<ApiResponse<Team[]>>("/teams/admin/all"),
  createTeam: (payload: Partial<Team>) => api.post<ApiResponse<Team>>("/teams", payload),
  updateTeam: (id: string, payload: Partial<Team>) => api.put<ApiResponse<Team>>(`/teams/${id}`, payload),
  removeTeam: (id: string) => api.delete<ApiResponse<null>>(`/teams/${id}`),

  listMembers: (team?: string) =>
    api.get<ApiResponse<TeamMember[]>>("/team-members", { params: team ? { team } : {} }),
  listMembersAdmin: () => api.get<ApiResponse<TeamMember[]>>("/team-members/admin/all"),
  createMember: (formData: FormData) =>
    api.post<ApiResponse<TeamMember>>("/team-members", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  updateMember: (id: string, formData: FormData) =>
    api.put<ApiResponse<TeamMember>>(`/team-members/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }),
  removeMember: (id: string) => api.delete<ApiResponse<null>>(`/team-members/${id}`),
};
