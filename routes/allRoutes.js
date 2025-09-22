import express from "express";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import productRoutes from "./productRoutes.js";
import passwordRoutes from "./passwordRoutes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes); // Example for category routes
router.use("/products", productRoutes); // Example for product routes
router.use("/password", passwordRoutes); // Password routes

export default router;
