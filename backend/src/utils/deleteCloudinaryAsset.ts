import { cloudinary } from "../config/cloudinary";

export async function deleteCloudinaryAsset(publicId?: string | null): Promise<void> {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[cloudinary] Failed to delete asset", publicId, error);
  }
}
