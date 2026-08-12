import { Request, Response } from "express";
import { GalleryImage } from "../models/GalleryImage";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

export const getGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
  const images = await GalleryImage.find(filter).sort({ displayOrder: 1, createdAt: -1 });
  sendSuccess(res, images);
});

export const getAllGalleryImagesAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const images = await GalleryImage.find().populate("event", "title").sort({ createdAt: -1 });
  sendSuccess(res, images);
});

export const uploadGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (files.length === 0) throw ApiError.badRequest("No images uploaded");

  const category = req.body.category || "Other";
  const event = req.body.event || undefined;

  const created = await GalleryImage.insertMany(
    files.map((file) => ({
      title: req.body.title,
      description: req.body.description,
      category,
      event,
      image: { url: file.path, publicId: file.filename },
    }))
  );
  sendSuccess(res, created, "Images uploaded successfully", 201);
});

export const updateGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!image) throw ApiError.notFound("Gallery image not found");
  sendSuccess(res, image, "Gallery image updated successfully");
});

export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) throw ApiError.notFound("Gallery image not found");
  await deleteCloudinaryAsset(image.image?.publicId);
  sendSuccess(res, null, "Gallery image deleted successfully");
});

export const reorderGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const { order } = req.body as { order: { id: string; displayOrder: number }[] };
  await Promise.all(
    order.map((item) => GalleryImage.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }))
  );
  sendSuccess(res, null, "Order updated");
});
