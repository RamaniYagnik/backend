import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import { errorMessages, successMessages } from "../utils/messagesHandler.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// ------------------ ADD PRODUCT ------------------ //
export const addProduct = async (req, res) => {
  try {
    const { products_name, price, colors, tags, category_id } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    if (!products_name || !price || !colors || !category_id || !imagePath) {
      return sendError(res, 401, errorMessages.REQUIRED_FIELDS);
    }

    const category = await categoryModel.findByPk(category_id);
    if (!category) {
      return sendError(res, 404, errorMessages.CATEGORY_NOT_FOUND);
    }

    const newProduct = await productModel.create({
      products_name,
      products_image: imagePath,
      price,
      colors: Array.isArray(colors) ? colors.join(",") : colors,
      tags: Array.isArray(tags) ? tags.join(",") : tags,
      category_id,
      created_by: req.user.id, // ✅ who added the product
    });

    return sendSuccess(res, 201, successMessages.PRODUCT_CREATED, newProduct);
  } catch (err) {
    console.error("Error adding product:", err);
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.findAll({
      where: { is_deleted: false },   // ✅ exclude soft-deleted
      include: [
        { model: categoryModel, attributes: ["id", "categories_name"] },
      ],
    });

    return sendSuccess(res, 200, successMessages.PRODUCTS_FETCHED, products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

export const getSubAdminProducts = async (req, res) => {
  try {
    // Only fetch products created by users with role 'sub-admin'
    const products = await productModel.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: categoryModel,
          attributes: ["id", "categories_name"],
        },
        {
          model: req.app.get("models").userModel, // assuming userModel is accessible
          as: "creator",
          attributes: ["id", "name", "role"],
          where: { role: "sub-admin" },
        },
      ],
    });

    return sendSuccess(res, 200, successMessages.PRODUCTS_FETCHED, products);
  } catch (err) {
    console.error("Error fetching sub-admin products:", err);
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

// ------------------ UPDATE PRODUCT ------------------ //
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { products_name, price, colors, tags, category_id } = req.body;

    const product = await productModel.findByPk(id);
    if (!product) {
      return sendError(res, 404, errorMessages.PRODUCT_NOT_FOUND);
    }

    // ✅ Restrict sub-admins to only edit their products
    if (req.user.role === "sub-admin" && product.created_by !== req.user.id) {
      return sendError(res, 403, "You are not allowed to edit this product");
    }

    if (category_id) {
      const category = await categoryModel.findByPk(category_id);
      if (!category) {
        return sendError(res, 404, errorMessages.CATEGORY_NOT_FOUND);
      }
    }

    let imagePath = req.file ? req.file.filename : product.products_image;
    product.products_name = products_name || product.products_name;
    product.products_image = imagePath;
    product.price = price || product.price;
    product.colors = colors ? (Array.isArray(colors) ? colors.join(",") : colors) : product.colors;
    product.tags = tags ? (Array.isArray(tags) ? tags.join(",") : tags) : product.tags;
    product.category_id = category_id || product.category_id;

    await product.save();

    return sendSuccess(res, 200, successMessages.PRODUCT_UPDATED, product);
  } catch (err) {
    console.error("Error updating product:", err);
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

// ------------------ DELETE PRODUCT (soft delete) ------------------ //
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByPk(id);
    if (!product) {
      return sendError(res, 404, errorMessages.PRODUCT_NOT_FOUND);
    }

    // Sub-admin can delete only their own products
    if (req.user.role === "sub-admin" && product.created_by !== req.user.id) {
      return sendError(res, 403, "You are not allowed to delete this product");
    }

    // Soft delete
    product.is_deleted = true;
    await product.save();

    return sendSuccess(res, 200, "Product Deleted Successfully");
  } catch (err) {
    console.error("Error deleting product:", err);
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

