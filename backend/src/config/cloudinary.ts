
import { v2 as cloudinary } from "cloudinary";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import { extname } from "node:path";
import convert from "heic-convert";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

const heicTypes = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

class CloudinaryEngine implements StorageEngine {
  _handleFile(
    _req: Request,
    file: Express.Multer.File & { stream: NodeJS.ReadableStream },
    cb: (
      error?: unknown,
      info?: Partial<Express.Multer.File>
    ) => void
  ) {
    const mimeType = file.mimetype.toLowerCase();
    const extension = extname(file.originalname).toLowerCase();
    const isHeic =
      heicTypes.has(mimeType) ||
      extension === ".heic" ||
      extension === ".heif";

    const chunks: Buffer[] = [];

    file.stream.on("data", (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    file.stream.on("error", (error) => cb(error));

    file.stream.on("end", async () => {
      try {
        const input = Buffer.concat(chunks);


        let uploadBuffer: Buffer;

        if (isHeic) {
          const converted = await convert({
            buffer: input,
            format: "JPEG",
            quality: 0.9,
          });

          if (Buffer.isBuffer(converted)) {
            uploadBuffer = converted;
          } else {
            uploadBuffer = Buffer.from(new Uint8Array(converted));
          }
        } else {
          uploadBuffer = input;
        }

        const uploadOptions = {
          folder: "matrixz",
          resource_type: "image" as const,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        };

        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error || !result) {
              cb(error || new Error("Cloudinary upload failed"));
              return;
            }

            cb(null, {
              path: result.secure_url,
              filename: result.public_id,
              size: result.bytes,
              mimetype: isHeic
                ? "image/jpeg"
                : result.format === "jpg"
                  ? "image/jpeg"
                  : `image/${result.format}`,
            } as Partial<Express.Multer.File>);
          }
        );

        uploadStream.end(uploadBuffer);
      } catch (error) {
        cb(
          error instanceof Error
            ? error
            : new Error("Image conversion failed")
        );
      }
    });
  }

  _removeFile(
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null) => void
  ) {
    cb(null);
  }
}

export const upload = multer({
  storage: new CloudinaryEngine(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const mimeType = file.mimetype.toLowerCase();
    const extension = extname(file.originalname).toLowerCase();

    console.log("[upload] Received file:", {
      originalname: file.originalname,
      mimetype: mimeType,
    });

    if (
      allowedMimeTypes.has(mimeType) ||
      allowedExtensions.has(extension)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file type: ${mimeType}. ` +
          "Allowed formats: JPG, PNG, WEBP, HEIC and HEIF."
        )
      );
    }
  },
});

export { cloudinary };
