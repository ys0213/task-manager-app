import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import pillRoutes from "./routes/pillRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT ?? "5000", 10);

const allowedOrigins = [
  "http://localhost:5000",
  "http://localhost:5173",
  "https://ys0213.github.io"
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/pills", pillRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req: Request, res: Response): void => {
  res.send("API is running...");
});

app.get('/health', (req, res) => {
  console.log('Health check ping received at', new Date());
  res.status(200).send('OK');
});

// MongoDB connection
const mongoUri: string = process.env.MONGO_URI ?? "";
if (!mongoUri) {
  console.error("Missing MONGO_URI in environment");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅  MongoDB connected");
    app.listen(PORT, (): void => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
