import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { ETHIOPIAN_REGIONS } from "@zero-delala/shared";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Isolated Health Check Endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    supportedRegions: ETHIOPIAN_REGIONS.length,
  });
});

app.listen(PORT, () => {
  console.log(
    `[Zero Delala Backend] Server running on http://localhost:${PORT}`,
  );
});
