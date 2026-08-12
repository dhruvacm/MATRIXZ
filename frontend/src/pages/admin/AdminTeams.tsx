import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { teamService } from "@/services/teamService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Team, TeamMember } from "@/types";

const teamSchema = z.object({
  name: z.string().min(2, "Team name is required."),
  description: z.string().optional(),
  displayOrder: z.string().optional(),
  isActive: z.boolean().optional(),
});
type TeamFormData = z.infer<typeof teamSchema>;

const memberSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role is required."),
  team: z.string().min(1, "Please select a team."),
  bio: z.string().optional(),
  skills: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  displayOrder: z.string().optional(),
  isActive: z.boolean().optional(),
});
type MemberFormData = z.infer<typeof memberSchema>;

export default function AdminTeams() {
  useDocumentTitle("Teams");
  const { showToast } = useToast();

  const { data: teams, refetch: refetchTeams } = useFetch(() => teamService.listTeamsAdmin());
  const { data: members, loading, refetch: refetchMembers } = useFetch(() => teamService.listMembersAdmin());

  const [activeTeamFilter, setActiveTeamFilter] = useState<string>("all");
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (activeTeamFilter === "all") return members;
    return members.filter((m) => (typeof m.team === "string" ? m.team === activeTeamFilter : m.team._id === activeTeamFilter));
  }, [members, activeTeamFilter]);

  /* -------- Team modal state -------- */
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deleteTeamTarget, setDeleteTeamTarget] = useState<Team | null>(null);
  const teamForm = useForm<TeamFormData>({ resolver: zodResolver(teamSchema) });

  function openCreateTeam() {
    setEditingTeam(null);
    teamForm.reset({ name: "", description: "", displayOrder: "0", isActive: true });
    setTeamModalOpen(true);
  }
  function openEditTeam(team: Team) {
    setEditingTeam(team);
    teamForm.reset({ name: team.name, description: team.description ?? "", displayOrder: String(team.displayOrder), isActive: team.isActive });
    setTeamModalOpen(true);
  }
  async function onSubmitTeam(values: TeamFormData) {
    try {
      const payload = { ...values, displayOrder: Number(values.displayOrder || 0) };
      if (editingTeam) {
        await teamService.updateTeam(editingTeam._id, payload);
        showToast("Team updated successfully", "success");
      } else {
        await teamService.createTeam(payload);
        showToast("Team created successfully", "success");
      }
      setTeamModalOpen(false);
      refetchTeams();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }
  async function handleDeleteTeam() {
    if (!deleteTeamTarget) return;
    try {
      await teamService.removeTeam(deleteTeamTarget._id);
      showToast("Team deleted successfully", "success");
      setDeleteTeamTarget(null);
      refetchTeams();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  /* -------- Member modal state -------- */
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const [deleteMemberTarget, setDeleteMemberTarget] = useState<TeamMember | null>(null);
  const memberForm = useForm<MemberFormData>({ resolver: zodResolver(memberSchema) });

  function openCreateMember() {
    setEditingMember(null);
    setMemberImage(null);
    memberForm.reset({ name: "", role: "", team: teams?.[0]?._id ?? "", bio: "", skills: "", linkedin: "", github: "", instagram: "", displayOrder: "0", isActive: true });
    setMemberModalOpen(true);
  }
  function openEditMember(member: TeamMember) {
    setEditingMember(member);
    setMemberImage(null);
    memberForm.reset({
      name: member.name,
      role: member.role,
      team: typeof member.team === "string" ? member.team : member.team._id,
      bio: member.bio ?? "",
      skills: member.skills?.join(", ") ?? "",
      linkedin: member.socials?.linkedin ?? "",
      github: member.socials?.github ?? "",
      instagram: member.socials?.instagram ?? "",
      displayOrder: String(member.displayOrder),
      isActive: member.isActive,
    });
    setMemberModalOpen(true);
  }
  async function onSubmitMember(values: MemberFormData) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, key === "isActive" ? String(!!value) : String(value));
      });
      if (memberImage) formData.append("profileImage", memberImage);

      if (editingMember) {
        await teamService.updateMember(editingMember._id, formData);
        showToast("Team member updated successfully", "success");
      } else {
        await teamService.createMember(formData);
        showToast("Team member added successfully", "success");
      }
      setMemberModalOpen(false);
      refetchMembers();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }
  async function handleDeleteMember() {
    if (!deleteMemberTarget) return;
    try {
      await teamService.removeMember(deleteMemberTarget._id);
      showToast("Team member deleted successfully", "success");
      setDeleteMemberTarget(null);
      refetchMembers();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Teams</h1>
          <p className="mt-1 text-sm text-slate-500">Manage team categories and members.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openCreateTeam} className="btn-secondary text-sm">
            <Plus className="h-4 w-4" /> Add Team
          </button>
          <button onClick={openCreateMember} className="btn-primary text-sm">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>
      </div>

      {teams && teams.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setActiveTeamFilter("all")} className={`rounded-full px-4 py-2 text-xs font-medium ${activeTeamFilter === "all" ? "bg-violet-glow text-white" : "border border-white/10 text-slate-400"}`}>All</button>
          {teams.map((t) => (
            <div key={t._id} className="group relative">
              <button onClick={() => setActiveTeamFilter(t._id)} className={`rounded-full px-4 py-2 text-xs font-medium ${activeTeamFilter === t._id ? "bg-violet-glow text-white" : "border border-white/10 text-slate-400"}`}>
                {t.name}
              </button>
              <span className="absolute -right-1 -top-1 hidden gap-1 group-hover:flex">
                <button onClick={() => openEditTeam(t)} aria-label={`Edit ${t.name}`} className="rounded-full bg-void-raised p-1 text-slate-400 hover:text-slate-100"><Pencil className="h-3 w-3" /></button>
                <button onClick={() => setDeleteTeamTarget(t)} aria-label={`Delete ${t.name}`} className="rounded-full bg-void-raised p-1 text-slate-400 hover:text-rose-400"><Trash2 className="h-3 w-3" /></button>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading team members" />
        ) : filteredMembers.length === 0 ? (
          <EmptyState title="No team members yet." description="Add your first team member above." />
        ) : (
          <div className="glass-panel overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Role</th>
                  <th className="px-5 py-4 font-medium">Team</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => (
                  <tr key={m._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-slate-200">{m.name}</td>
                    <td className="px-5 py-4 text-slate-400">{m.role}</td>
                    <td className="px-5 py-4 text-slate-400">{typeof m.team === "string" ? m.team : m.team.name}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${m.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                        {m.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditMember(m)} aria-label="Edit member" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteMemberTarget(m)} aria-label="Delete member" className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team modal */}
      <Modal open={teamModalOpen} onClose={() => setTeamModalOpen(false)} title={editingTeam ? "Edit Team" : "Add Team"}>
        <form onSubmit={teamForm.handleSubmit(onSubmitTeam)} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Team Name</label>
            <input {...teamForm.register("name")} className="input" placeholder="Web Development" />
            {teamForm.formState.errors.name && <p className="mt-1 text-xs text-rose-400">{teamForm.formState.errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
            <textarea rows={2} {...teamForm.register("description")} className="input resize-none" placeholder="Building responsive and dynamic websites." />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Display Order</label>
            <input type="number" {...teamForm.register("displayOrder")} className="input" />
          </div>
          <label className="flex items-center gap-2 text-xs text-slate-400">
            <input type="checkbox" {...teamForm.register("isActive")} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-glow" />
            Visible on public site
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setTeamModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={teamForm.formState.isSubmitting} className="btn-primary">
              {editingTeam ? "Save Changes" : "Create Team"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Member modal */}
      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title={editingMember ? "Edit Member" : "Add Member"} maxWidth="max-w-xl">
        <form onSubmit={memberForm.handleSubmit(onSubmitMember)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
              <input {...memberForm.register("name")} className="input" />
              {memberForm.formState.errors.name && <p className="mt-1 text-xs text-rose-400">{memberForm.formState.errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Role</label>
              <input {...memberForm.register("role")} className="input" placeholder="President" />
              {memberForm.formState.errors.role && <p className="mt-1 text-xs text-rose-400">{memberForm.formState.errors.role.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Team</label>
              <select {...memberForm.register("team")} className="input">
                {teams?.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
              {memberForm.formState.errors.team && <p className="mt-1 text-xs text-rose-400">{memberForm.formState.errors.team.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Bio</label>
              <textarea rows={2} {...memberForm.register("bio")} className="input resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Skills (comma separated)</label>
              <input {...memberForm.register("skills")} className="input" placeholder="React, Node.js, MongoDB" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">LinkedIn</label>
              <input {...memberForm.register("linkedin")} className="input" placeholder="https://linkedin.com/in/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">GitHub</label>
              <input {...memberForm.register("github")} className="input" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Instagram</label>
              <input {...memberForm.register("instagram")} className="input" placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Display Order</label>
              <input type="number" {...memberForm.register("displayOrder")} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-slate-400 hover:border-violet-glow/40">
                <ImagePlus className="h-4 w-4" />
                {memberImage ? memberImage.name : editingMember?.profileImage?.url ? "Replace profile image" : "Upload profile image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setMemberImage(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-400 sm:col-span-2">
              <input type="checkbox" {...memberForm.register("isActive")} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-glow" />
              Visible on public site
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setMemberModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={memberForm.formState.isSubmitting} className="btn-primary">
              {editingMember ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTeamTarget}
        title="Delete team"
        message={`Delete "${deleteTeamTarget?.name}"? Teams with existing members cannot be deleted.`}
        onCancel={() => setDeleteTeamTarget(null)}
        onConfirm={handleDeleteTeam}
      />
      <ConfirmDialog
        open={!!deleteMemberTarget}
        title="Delete member"
        message={`Are you sure you want to remove "${deleteMemberTarget?.name}" from the team?`}
        onCancel={() => setDeleteMemberTarget(null)}
        onConfirm={handleDeleteMember}
      />
    </div>
  );
}
