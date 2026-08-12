import { Router } from "express";
import {
  getTeams, getAllTeamsAdmin, createTeam, updateTeam, deleteTeam,
  getTeamMembers, getAllTeamMembersAdmin, createTeamMember, updateTeamMember, deleteTeamMember,
} from "../controllers/teamController";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { teamSchema, teamUpdateSchema, teamMemberSchema, teamMemberUpdateSchema } from "../validators/teamValidators";
import { upload } from "../config/cloudinary";

const router = Router();

router.get("/", getTeams);
router.get("/admin/all", requireAdmin, getAllTeamsAdmin);
router.post("/", requireAdmin, validateBody(teamSchema), createTeam);
router.put("/:id", requireAdmin, validateBody(teamUpdateSchema), updateTeam);
router.delete("/:id", requireAdmin, deleteTeam);

export default router;

export const teamMembersRouter = Router();
teamMembersRouter.get("/", getTeamMembers);
teamMembersRouter.get("/admin/all", requireAdmin, getAllTeamMembersAdmin);
teamMembersRouter.post("/", requireAdmin, upload.single("profileImage"), validateBody(teamMemberSchema), createTeamMember);
teamMembersRouter.put("/:id", requireAdmin, upload.single("profileImage"), validateBody(teamMemberUpdateSchema), updateTeamMember);
teamMembersRouter.delete("/:id", requireAdmin, deleteTeamMember);
