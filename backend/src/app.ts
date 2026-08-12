import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import teamRoutes, { teamMembersRouter } from "./routes/teamRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import galleryRoutes from "./routes/galleryRoutes";
import contactRoutes from "./routes/contactRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
if (env.nodeEnv === "development") app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "MATRIXZ API is running." }));

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/team-members", teamMembersRouter);
app.use("/api/achievements", achievementRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
