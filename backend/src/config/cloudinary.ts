
import { v2 as cloudinary } from "cloudinary";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express";
import { extname, basename } from "node:path";
import convert from "heic-convert";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const allowedImageMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

const allowedImageExtensions = new Set([
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
    const isReport = file.fieldname === "report";

    if (isReport) {
      const safeName = basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .slice(0, 80);

      const chunks: Buffer[] = [];

      file.stream.on("data", (chunk: Buffer | string) => {
        chunks.push(
          Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        );
      });

      file.stream.on("error", (error) => cb(error));

      file.stream.on("end", () => {
        const uploadBuffer = Buffer.concat(chunks);

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "matrixz/event-reports",
            resource_type: "raw",
            access_mode: "public",
            public_id: `${safeName}-${Date.now()}.pdf`,
          },
          (error, result) => {
            if (error || !result) {
              cb(error || new Error("PDF upload failed"));
              return;
            }

            cb(null, {
              path: result.secure_url,
              filename: result.public_id,
              size: result.bytes,
              mimetype: "application/pdf",
            });
          }
        );

        uploadStream.end(uploadBuffer);
      });

      return;
    }

    const isHeic =
      heicTypes.has(mimeType) ||
      extension === ".heic" ||
      extension === ".heif";

    const chunks: Buffer[] = [];

    file.stream.on("data", (chunk: Buffer | string) => {
      chunks.push(
        Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
      );
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

          uploadBuffer = Buffer.isBuffer(converted)
            ? converted
            : Buffer.from(new Uint8Array(converted));
        } else {
          uploadBuffer = input;
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "matrixz",
            resource_type: "image",
            transformation: [
              { quality: "auto", fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) {
              cb(error || new Error("Image upload failed"));
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
            });
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
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const mimeType = file.mimetype.toLowerCase();
    const extension = extname(file.originalname).toLowerCase();

    if (file.fieldname === "report") {
      const isPdf =
        mimeType === "application/pdf" && extension === ".pdf";

      if (!isPdf) {
        cb(new Error("Event report must be a PDF file."));
        return;
      }

      cb(null, true);
      return;
    }

    if (
      allowedImageMimeTypes.has(mimeType) ||
      allowedImageExtensions.has(extension)
    ) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Unsupported image format. Allowed formats: JPG, PNG, WEBP, HEIC and HEIF."
      )
    );
  },
});

export { cloudinary };
