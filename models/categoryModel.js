import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";  // adjust path to your DB config

const categoryModel = sequelize.define(
  "categoryModel",
  {
    categories_name: { type: DataTypes.STRING, allowNull: false, unique: true, },
    categories_image: { type: DataTypes.STRING, allowNull: true, },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }
  },
  {
    tableName: "categories", 
    timestamps: false,        
  }
);



export default categoryModel;
