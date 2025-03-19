import { Request, Response, NextFunction } from "express";
import User from "../models/User";

/**
 * Middleware to authenticate requests using sessionId and IP.
 */
export const authenticateRequest = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.body.sessionId;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  if (!sessionId) {
    return res.status(401).json({ error: "Unauthorized: sessionId is required." });
  }
  if (!clientIp) {
    return res.status(401).json({ error: "Unauthorized: IP address is required." });
  }

  try {
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found." });
    }

    // Optionally, enforce that the client's IP matches the stored IP.
    if (user.ip !== clientIp) {
      return res.status(401).json({ error: "Unauthorized: IP address mismatch." });
    }

    // If needed, attach the user to the request for later use:
    // (Remember to extend the Express Request interface to include a "user" property.)
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};