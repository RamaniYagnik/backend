// routes/categoryRoutes.js
import express from "express";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { isAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/",verifyToken, isAdmin, upload.single("categories_image"), addCategory);
router.get("/",verifyToken, getCategories);
router.put("/:id",verifyToken, isAdmin, upload.single("categories_image"), updateCategory);
router.delete("/:id",verifyToken, isAdmin, deleteCategory);

export default router;
