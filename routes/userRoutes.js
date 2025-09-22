import express from "express";
import { login, logout, refreshToken, signup } from "../controllers/userController.js";
import { signupSchema, loginSchema } from "../validation/validationSchema.js";
import { validate } from "../middlewares/validate.js";
import { getUsers, softDeleteUser, updateUser } from "../controllers/usersController.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.get("/", verifyToken, isAdmin, getUsers);            
router.put("/:id", verifyToken, isAdmin, updateUser);       
router.delete("/:id", verifyToken, isAdmin, softDeleteUser); 

export default router;
