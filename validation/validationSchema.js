// src/validations/validationSchema.js
import Joi from "joi";

// 🔹 Reusable field-level schemas
const nameSchema = Joi.string().min(3).max(50).required().messages({
  "string.empty": "Name is required",
  "string.min": "Name must be at least 3 characters",
  "string.max": "Name must be less than 50 characters",
});

const emailSchema = Joi.string().email().required().messages({
  "string.empty": "Email is required",
  "string.email": "Invalid email format",
});

const passwordSchema = Joi.string().min(6).required().messages({
  "string.empty": "Password is required",
  "string.min": "Password must be at least 6 characters",
});

// ✅ Forgot Password
export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
  newPassword: passwordSchema,
});

// ✅ Reset Password
export const resetPasswordSchema = Joi.object({
  email: emailSchema,
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

// ✅ Signup
export const signupSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Confirm password is required",
    }),
  role: Joi.string().valid("admin", "user").default("user"),
});

// ✅ Login
export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

