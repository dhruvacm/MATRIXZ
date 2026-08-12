import { Router } from "express";
import { getAchievements, getAllAchievementsAdmin, createAchievement, updateAchievement, deleteAchievement } from "../controllers/achievementController";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { achievementSchema, achievementUpdateSchema } from "../validators/achievementValidators";
import { upload } from "../config/cloudinary";

const router = Router();

router.get("/", getAchievements);
router.get("/admin/all", requireAdmin, getAllAchievementsAdmin);
router.post("/", requireAdmin, upload.single("image"), validateBody(achievementSchema), createAchievement);
router.put("/:id", requireAdmin, upload.single("image"), validateBody(achievementUpdateSchema), updateAchievement);
router.delete("/:id", requireAdmin, deleteAchievement);

export default router;
