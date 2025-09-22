import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; 

const userModel = sequelize.define("userModel",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user", "sub-admin"), defaultValue: "user" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false }, // 🔑 Soft delete
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

export default userModel;
