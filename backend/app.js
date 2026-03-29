import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import roomRoutes from "./routes/room.routes.js";
import lockRoutes from "./routes/lock.routes.js";
import roomLockRoutes from "./routes/roomLock.routes.js";

import { createSuperAdmin } from "./middleware/createSuperAdmin.js";
import { connectDB } from "./config/connectDB.js";

const app = express();

// ✅ Middleware
app.use(express.json());

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight safely (FIXES YOUR 500 ERROR)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Routes
app.use("/", dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/properties", propertyRoutes);
app.use("/rooms", roomRoutes);
app.use("/locks", lockRoutes);
app.use("/room-lock", roomLockRoutes);

// ✅ Global error handler
app.use((error, req, res, next) => {
  console.error("ERROR:", error);

  const status = error.statusCode || 500;
  const message = error.message || "Something went wrong";
  const data = error.data || null;

  res.status(status).json({ message, data });
});

// ✅ Initialize DB + SuperAdmin ONCE (safe for serverless)
let isInitialized = false;

async function init() {
  if (isInitialized) return;

  try {
    await connectDB();

    try {
      await createSuperAdmin();
    } catch (err) {
      console.error("SuperAdmin error:", err.message);
    }

    isInitialized = true;
    console.log("✅ App initialized");
  } catch (err) {
    console.error("❌ Init failed:", err);
  }
}

// ✅ Run init on every request (safe pattern for Vercel)
app.use(async (req, res, next) => {
  await init();
  next();
});

// ❌ REMOVE app.listen (VERY IMPORTANT)
// ❌ DO NOT use startServer()

// ✅ Export app for Vercel
export default app;