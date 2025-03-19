import { Request, Response, NextFunction } from "express";
import chatService from "../services/chatService";

export const handleChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
        return;
    }

    // Call chat service to generate a response
    const response = await chatService.getResponse(message);
    res.json({ response });
  } catch (error) {
    next(error);
  }
};