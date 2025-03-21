import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/chatRoutes";
import path from "path";
dotenv.config();

const app = express();

// Important: Allows JSON body parsing
app.use(cors());
app.use(express.json());

// Health check endpoint (useful for debugging)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Register chat routes
app.use("/api/chat", router);

// Serve static widget files
app.use("/static", express.static(path.join(__dirname, "widget")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 3000;

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  console.error("❌ Server error:", err);
});

// Capture unhandled exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled promise rejection:", err);
});