import categoryModel from "../models/categoryModel.js";
import { sendSuccess, sendError } from "../utils/responseHandler.js";
import logger from "../utils/logger.js";
import { errorMessages, successMessages } from "../utils/messagesHandler.js";
import productModel from "../models/productModel.js";

// ----------------- ADD CATEGORY -----------------
export const addCategory = async (req, res) => {
  try {
    const { categories_name } = req.body;
    let categories_image = req.file ? req.file.filename : null; // store only file name

    // Validation
    if (!categories_name || !categories_image) {
      return sendError(res, 400, errorMessages.CATEGORY_REQUIRED_FIELDS);
    }
    // Create category
    const category = await categoryModel.create({ categories_name, categories_image });
    return sendSuccess(res, 201, successMessages.CATEGORY_CREATED, category);
  } catch (err) {
    logger.error("Add Category Error", { error: err.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

export const getCategories = async (req, res) => {
  try {
    // Fetch all active categories
    const categories = await categoryModel.findAll({
      where: { is_deleted: false },
    });

    // Attach product count to each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productsCount = await productModel.count({
          where: { category_id: cat.id, is_deleted: false },
        });
        return {
          ...cat.toJSON(),
          productsCount,
        };
      })
    );

    return sendSuccess(res, 200, successMessages.CATEGORY_FETCHED,
      categoriesWithCount.map(cat => ({
        ...cat,
        categories_image: cat.categories_image ? `/uploads/${cat.categories_image}` : null
      })));
  } catch (err) {
    logger.error("Get Categories Error", { error: err.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

// ----------------- UPDATE CATEGORY -----------------
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categories_name } = req.body;

    const category = await categoryModel.findOne({
      where: { id, is_deleted: false },
    });
    if (!category) {
      return sendError(res, 404, errorMessages.CATEGORY_NOT_FOUND);
    }

    let categories_image = req.file ? req.file.filename : category.categories_image;
    category.categories_name = categories_name || category.categories_name;
    category.categories_image = categories_image || category.categories_image;

    await category.save();
    logger.info(`Category updated: ${id}`);

    return sendSuccess(res, 200, successMessages.CATEGORY_UPDATED, category);
  } catch (err) {
    logger.error("Update Category Error", { error: err.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findOne({
      where: { id, is_deleted: false },
    });

    if (!category) {
      return sendError(res, 404, errorMessages.CATEGORY_NOT_FOUND);
    }

    // Check if category has products
    const productsCount = await productModel.count({
      where: { category_id: id, is_deleted: false }, // assuming foreign key is categoryId
    });

    if (productsCount > 0) {
      return sendError(
        res,
        400,
        "Category cannot be deleted because it has associated products."
      );
    }

    // Soft delete category
    category.is_deleted = true;
    await category.save();
    logger.info(`Category soft deleted: ${id}`);

    return sendSuccess(res, 200, successMessages.CATEGORY_DELETED);
  } catch (err) {
    logger.error("Delete Category Error", { error: err.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};

// ----------------- RESTORE CATEGORY -----------------
export const restoreCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await categoryModel.findOne({
      where: { id, is_deleted: true },
    });
    if (!category) {
      return sendError(res, 404, errorMessages.CATEGORY_NOT_FOUND);
    }

    category.is_deleted = false;
    await category.save();
    logger.info(`Category restored: ${id}`);

    return sendSuccess(res, 200, successMessages.CATEGORY_RESTORED, category);
  } catch (err) {
    logger.error("Restore Category Error", { error: err.message });
    return sendError(res, 500, errorMessages.SERVER_ERROR, err.message);
  }
};
