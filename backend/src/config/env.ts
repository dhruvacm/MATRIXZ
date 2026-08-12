import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing environment variable: ${name}`);
    return "";
  }
  return value;
}

export const env = {
  port: parseInt(required("PORT", "5000"), 10),
  nodeEnv: required("NODE_ENV", "development"),
  clientUrl: required("CLIENT_URL", "http://localhost:5173"),
  mongodbUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: required("JWT_EXPIRES_IN", "7d"),
  authRateLimitMax: parseInt(required("AUTH_RATE_LIMIT_MAX", "10"), 10),
  formRateLimitMax: parseInt(required("FORM_RATE_LIMIT_MAX", "20"), 10),
  cloudinary: {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
};
