import { Router } from "express";
import { getEvents, getAllEventsAdmin, getEventById, createEvent, updateEvent, deleteEvent, duplicateEvent } from "../controllers/eventController";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { eventSchema, eventUpdateSchema } from "../validators/eventValidators";
import { upload } from "../config/cloudinary";

const router = Router();

router.get("/", getEvents);
router.get("/admin/all", requireAdmin, getAllEventsAdmin);
router.get("/:id", getEventById);
router.post("/", requireAdmin, upload.single("banner"), validateBody(eventSchema), createEvent);
router.post("/:id/duplicate", requireAdmin, duplicateEvent);
router.put("/:id", requireAdmin, upload.single("banner"), validateBody(eventUpdateSchema), updateEvent);
router.delete("/:id", requireAdmin, deleteEvent);

export default router;
