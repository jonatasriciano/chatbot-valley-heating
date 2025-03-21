import { Router } from "express";
import { handleChat } from "../controllers/chatController";

const router = Router();

// Route for handling chat requests
router.post("/", handleChat);

export default router;