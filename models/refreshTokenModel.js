import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import userModel from "./userModel.js"; // your user model

const refreshTokenModel = sequelize.define(
  "refreshTokenModel",
  {
    token: { type: DataTypes.TEXT, allowNull: false, },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: userModel, key: "id", }, onDelete: "CASCADE", },
  },
  {
    tableName: "refresh_tokens",
    timestamps: false,
  }
);

userModel.hasMany(refreshTokenModel, { foreignKey: "user_id", onDelete: "CASCADE" });
refreshTokenModel.belongsTo(userModel, { foreignKey: "user_id" });

export default refreshTokenModel;
