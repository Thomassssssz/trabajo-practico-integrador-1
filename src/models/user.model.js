import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { UserProfileModel } from "./user.profile.model.js";
import { ArticleModel } from "./article.model.js";

export const UserModel = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);
