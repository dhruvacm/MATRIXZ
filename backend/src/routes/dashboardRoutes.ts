import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { requireAdmin } from "../middleware/auth";

const router = Router();
router.get("/", requireAdmin, getDashboardStats);

export default router;
