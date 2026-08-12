import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, getMe } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { loginSchema } from "../validators/authValidators";
import { requireAdmin } from "../middleware/auth";
import { env } from "../config/env";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.authRateLimitMax,
  message: { success: false, message: "Too many login attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", authLimiter, validateBody(loginSchema), login);
router.get("/me", requireAdmin, getMe);

export default router;
