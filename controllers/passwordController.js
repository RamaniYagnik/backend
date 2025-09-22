import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import { errorMessages, successMessages } from "../utils/messagesHandler.js";

// ---------------- CHANGE PASSWORD (Forget Password) ---------------- //
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return sendError(res, 400, errorMessages.REQUIRED_FIELDS);
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 404, errorMessages.USER_NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return sendSuccess(res, 200, successMessages.PASSWORD_CHANGED );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, errorMessages.SERVER_ERROR, error.message);
  }
};

// ---------------- RESET PASSWORD (Current Password Required) ---------------- //
export const resetPassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    if (!email || !currentPassword || !newPassword) {
      return sendError(res, 400, errorMessages.REQUIRED_FIELDS);
    }

    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 404, errorMessages.USER_NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return sendError(res, 401, errorMessages.INVALID_CREDENTIALS);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return sendSuccess(res, 200, successMessages.PASSWORD_RESET );
  } catch (error) {
    console.error(error);
    return sendError(res, 500, errorMessages.SERVER_ERROR, error.message);
  }
};
