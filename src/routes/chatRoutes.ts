import { Router } from "express";
import { handleChat } from "../controllers/chatController";
import { authenticateRequest } from "../middleware/authMiddleware";

const router = Router();

// Apply the authentication middleware on chat endpoint.
router.post("/chat", authenticateRequest, handleChat);

export default router;