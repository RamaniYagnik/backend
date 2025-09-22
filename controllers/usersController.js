// controllers/usersController.js
import userModel from "../models/userModel.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import logger from "../utils/logger.js";
import { errorMessages, successMessages } from "../utils/messagesHandler.js";
import { Op } from "sequelize";

// ----------------- GET USERS & SUB-ADMINS -----------------
export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const users = await userModel.findAll({
      where: { 
        is_deleted: false,
        id: { [Op.ne]: loggedInUserId },
       },
      attributes: ["id", "name", "email", "role"],

    });

    return sendSuccess(res,200, users, successMessages.USERS_FETCHED);
  } catch (error) {
    logger.error("Error fetching users:", error);
    return sendError(res,500, errorMessages.SERVER_ERROR);
  }
};

// ----------------- UPDATE USER / SUB-ADMIN -----------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await userModel.findByPk(id);
    if (!user || user.is_deleted) {
      return sendError(res,404, errorMessages.USER_NOT_FOUND_OR_DELETED);
    }

    await user.update({ name, email, role });

    return sendSuccess(res,200, user, successMessages.USER_UPDATED);
  } catch (error) {
    logger.error("Error updating user:", error);
    return sendError(res, errorMessages.USER_UPDATE_FAILED, 500);
  }
};

// ----------------- SOFT DELETE USER / SUB-ADMIN -----------------
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findByPk(id);
    if (!user || user.is_deleted) {
      return sendError(res,404, errorMessages.USER_NOT_FOUND_OR_DELETED);
    }

    await user.update({ is_deleted: true });

    return sendSuccess(res,202, null, successMessages.USER_DELETED);
  } catch (error) {
    logger.error("Error deleting user:", error);
    return sendError(res,500, errorMessages.USER_DELETE_FAILED);
  }
};
