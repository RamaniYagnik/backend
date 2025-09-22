// controllers/signupController.js
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { errorMessages, successMessages } from "../utils/messagesHandler.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import generateTokens from "../utils/tokenGenerater.js";
import refreshTokenModel from "../models/refreshTokenModel.js";
import logger from "../utils/logger.js";
import jwt from "jsonwebtoken";

// ----------------- SIGNUP -----------------
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // 1. Check required fields
    if (!name || !email || !password || !confirmPassword) {
      return sendError(res, 401, errorMessages.REQUIRED_FIELDS);
    }

    // 2. Password confirmation
    if (password !== confirmPassword) {
      return sendError(res, 400, errorMessages.PASSWORD_MISMATCH);
    }

    // 3. Check if email exists
    const existingUser = await userModel.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 409, errorMessages.EMAIL_EXISTS);
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Save new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role && ["admin", "user"].includes(role) ? role : "user",
    });

    return sendSuccess(res, 201, successMessages.REGISTRATION_SUCCESS, {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return sendError(res, 500, errorMessages.SERVER_ERROR, error.message);
  }
};

// ----------------- LOGIN -----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      logger.warn(`Login failed - user not found: ${email}`);
      return sendError(res, 401, errorMessages.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - invalid password for: ${email}`);
      return sendError(res, 401, errorMessages.INVALID_CREDENTIALS);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Clear old refresh tokens
    await refreshTokenModel.destroy({ where: { user_id: user.id } });
    await refreshTokenModel.create({ user_id: user.id, token: refreshToken });

    logger.info(`User logged in: ${email}`, { userId: user.id });

    return sendSuccess(res, 200, successMessages.LOGIN_SUCCESS, {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error("Login Error", { error: err.message, stack: err.stack });
    return sendError(res, 500, errorMessages.LOGIN_FAILED);
  }
};

// ----------------- REFRESH TOKEN -----------------
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      logger.warn("Refresh token missing in request");
      return sendError(res, 400, errorMessages.REFRESH_TOKEN_REQUIRED);
    }

    const storedToken = await refreshTokenModel.findOne({ where: { token } });
    if (!storedToken) {
      logger.warn("Invalid refresh token used");
      return sendError(res, 401, errorMessages.INVALID_REFRESH_TOKEN);
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) {
        logger.warn("Expired or invalid refresh token", { error: err.message });
        return sendError(res, 403, errorMessages.EXPIRED_REFRESH_TOKEN);
      }

      const user = await userModel.findByPk(decoded.id);
      if (!user) {
        logger.warn(`Refresh failed - user not found (ID: ${decoded.id})`);
        return sendError(res, 404, errorMessages.USER_NOT_FOUND);
      }

      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      await refreshTokenModel.destroy({ where: { user_id: user.id } });
      await refreshTokenModel.create({ user_id: user.id, token: newRefreshToken });

      logger.info(`Refresh token renewed for user: ${user.email}`, { userId: user.id });
      return sendSuccess(res, 200, successMessages.TOKEN_REFRESHED, {
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  } catch (err) {
    logger.error("Refresh Error", { error: err.message, stack: err.stack });
    return sendError(res, 500, errorMessages.SERVER_ERROR);
  }
};

// ----------------- LOGOUT -----------------
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // 1. Check if refresh token is provided
    if (!refreshToken) {
      logger.warn("Logout failed - refresh token missing");
      return sendError(res, 400, errorMessages.REFRESH_TOKEN_REQUIRED);
    }

    // 2. Find and delete the refresh token
    const deletedToken = await refreshTokenModel.destroy({
      where: { token: refreshToken }
    });

    if (deletedToken === 0) {
      logger.warn("Logout failed - invalid refresh token");
      return sendError(res, 401, errorMessages.INVALID_REFRESH_TOKEN);
    }

    logger.info("User logged out successfully", { refreshToken });

    return sendSuccess(res, 200, successMessages.LOGOUT_SUCCESS);
  } catch (err) {
    logger.error("Logout Error", { error: err.message, stack: err.stack });
    return sendError(res, 500, errorMessages.SERVER_ERROR);
  }
};