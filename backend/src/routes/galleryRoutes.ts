import { Router } from "express";
import {
  getGalleryImages,
  getAllGalleryImagesAdmin,
  uploadGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from "../controllers/galleryController";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { galleryImageUpdateSchema } from "../validators/galleryValidators";
import { upload } from "../config/cloudinary";

const router = Router();

router.get("/", getGalleryImages);
router.get("/admin/all", requireAdmin, getAllGalleryImagesAdmin);
router.post("/", requireAdmin, upload.array("images", 20), uploadGalleryImages);
router.put("/reorder", requireAdmin, reorderGalleryImages);
router.put("/:id", requireAdmin, validateBody(galleryImageUpdateSchema), updateGalleryImage);
router.delete("/:id", requireAdmin, deleteGalleryImage);

export default router;
