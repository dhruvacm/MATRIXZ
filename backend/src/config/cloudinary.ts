
import { v2 as cloudinary } from "cloudinary";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Custom multer storage engine that streams the incoming file directly
 * to Cloudinary without writing it to local disk.
 */
class CloudinaryEngine implements StorageEngine {
  _handleFile(
    _req: Request,
    file: Express.Multer.File & { stream: NodeJS.ReadableStream },
    cb: (error?: unknown, info?: Partial<Express.Multer.File>) => void
  ) {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "matrixz",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error || !result) {
          cb(error || new Error("Cloudinary upload failed"));
          return;
        }

        cb(null, {
          path: result.secure_url,
          filename: result.public_id,
          size: result.bytes,
        } as Partial<Express.Multer.File>);
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null) => void
  ) {
    cb(null);
  }
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
]);

export const upload = multer({
  storage: new CloudinaryEngine(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const mimeType = file.mimetype.toLowerCase();

    console.log("[upload] Received file:", {
      originalname: file.originalname,
      mimetype: mimeType,
    });

    if (allowedMimeTypes.has(mimeType)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${mimeType}. Only JPG, PNG and WEBP are allowed.`
        )
      );
    }
  },
});

export { cloudinary };
