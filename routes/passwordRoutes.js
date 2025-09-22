import express from "express";
import { changePassword, resetPassword } from "../controllers/passwordController.js";
import { validate } from "../middlewares/validate.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../validation/validationSchema.js";

const router = express.Router();

router.post("/change-password", validate(forgotPasswordSchema),changePassword);
router.post("/reset-password", validate(resetPasswordSchema),resetPassword);

export default router;
