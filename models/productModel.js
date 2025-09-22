import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import categoryModel from "./categoryModel.js";
import userModel from "./userModel.js"; // ✅ import user model

const productModel = sequelize.define(
  "productModel",
  {
    products_name: { type: DataTypes.STRING, allowNull: false },
    products_image: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    colors: { type: DataTypes.STRING, allowNull: false },
    tags: { type: DataTypes.STRING, allowNull: true },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: categoryModel, key: "id" },
      onDelete: "CASCADE",
    },
    created_by: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: userModel, key: "id" },
    },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

// 🔹 Associations
categoryModel.hasMany(productModel, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});
productModel.belongsTo(categoryModel, {
  foreignKey: "category_id",
});

// ✅ Link product with user who created it
userModel.hasMany(productModel, { foreignKey: "created_by" });
productModel.belongsTo(userModel, { foreignKey: "created_by", as: "creator" });

export default productModel;
