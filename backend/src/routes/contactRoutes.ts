import { Router } from "express";
import rateLimit from "express-rate-limit";
import { submitContactMessage, getContactMessages, markMessageRead, deleteContactMessage } from "../controllers/contactController";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { contactMessageSchema } from "../validators/contactValidators";
import { env } from "../config/env";

const router = Router();

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.formRateLimitMax,
  message: { success: false, message: "Too many submissions. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", formLimiter, validateBody(contactMessageSchema), submitContactMessage);
router.get("/", requireAdmin, getContactMessages);
router.put("/:id/read", requireAdmin, markMessageRead);
router.delete("/:id", requireAdmin, deleteContactMessage);

export default router;
