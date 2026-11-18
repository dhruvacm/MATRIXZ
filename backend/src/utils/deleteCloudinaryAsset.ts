
import { cloudinary } from "../config/cloudinary";

type CloudinaryResourceType = "image" | "raw";

export async function deleteCloudinaryAsset(
  publicId?: string | null,
  resourceType: CloudinaryResourceType = "image"
): Promise<void> {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `[cloudinary] Failed to delete ${resourceType} asset`,
      publicId,
      error
    );
  }
}
