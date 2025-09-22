import express from "express";
import {
  addProduct,
  deleteProduct,
  getProducts,
  getSubAdminProducts,
  updateProduct,
} from "../controllers/productController.js";
import { isAdminOrSubAdmin, verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/", verifyToken,isAdminOrSubAdmin,upload.single("products_image"), addProduct);
router.get("/",verifyToken, getProducts);
router.get("/",verifyToken,isAdminOrSubAdmin,getSubAdminProducts);
router.put("/:id", verifyToken,isAdminOrSubAdmin,upload.single("products_image"), updateProduct);
router.delete("/:id", verifyToken,isAdminOrSubAdmin, deleteProduct);

export default router;
