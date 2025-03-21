import { Request, Response, NextFunction } from "express";
import chatService from "../services/chatService";

export const handleChat = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId) {
      res.status(400).json({ error: "Session ID is required." });
      return;
    }

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    // Call chat service with sessionId and message
    const response = await chatService.getResponse(sessionId, message);
    res.status(200).json({ sessionId, response });
  } catch (error: any) {
    console.error("❌ Error in handleChat:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal server error.", details: error.message });
  }
};