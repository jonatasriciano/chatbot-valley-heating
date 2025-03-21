import { Request, Response, NextFunction } from "express";
import User from "../models/User";

/**
 * Middleware to authenticate requests using sessionId and IP.
 * @param req The HTTP request object.
 * @param res The HTTP response object.
 * @param next The next middleware function in the stack.
 * @returns A response with an error message if authentication fails, or calls the next middleware on success.
 */
export const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = req.body.sessionId;
    const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!sessionId) {
      return res.status(401).json({ error: "Unauthorized: sessionId is required." });
    }
    if (!clientIp) {
      return res.status(401).json({ error: "Unauthorized: IP address is required." });
    }

    const user = await User.findOne({ sessionId });
    if (!user) {
      console.warn(`⚠️ User not found for sessionId: ${sessionId}`);
      return res.status(401).json({ error: "Unauthorized: User not found." });
    }

    if (user.ip !== clientIp) {
      console.warn(`⚠️ IP mismatch: Expected ${user.ip}, got ${clientIp}`);
      return res.status(401).json({ error: "Unauthorized: IP address mismatch." });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error: any) {
    console.error("❌ Authentication error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Internal authentication error.", details: error.message });
  }
};