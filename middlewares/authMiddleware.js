import jwt from "jsonwebtoken";
import { sendError } from "../utils/responseHandler.js";
import { errorMessages } from "../utils/messagesHandler.js";
import logger from "../utils/logger.js";

export const verifyToken = (req, res, next) => {
  try {
    // Get token from headers: "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      logger.warn("Access denied - no token provided");
      return sendError(res, 403, errorMessages.TOKEN_REQUIRED);
    }

    console.log("Token received:", token);
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn("Invalid or expired token", { error: err.message });
        return sendError(res, 401, errorMessages.INVALID_TOKEN);
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error("Token verification error", { error: error.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, error.message);
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    logger.warn("Access denied - Admins only", { userId: req.user?.id });
    return sendError(res, 403, errorMessages.UNAUTHORIZED);
  }
  next();
};

export const isAdminOrSubAdmin = (req, res, next) => {
  const allowedRoles = ["admin", "sub-admin"];

  if (!allowedRoles.includes(req.user?.role)) {
    logger.warn("Access denied - Admin/Sub-Admin only", { userId: req.user?.id });
    return sendError(res, 403, errorMessages.UNAUTHORIZED);
  }
  next();
};  