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
      // sin validate aquí (lo haces con express-validator)
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      // sin validate aquí
    },

    password: {
      type: DataTypes.STRING(255), // guardás el hash de bcrypt
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
    timestamps: true, // created_at / updated_at
    underscored: true, // snake_case
    paranoid: true, // deleted_at (soft delete)
  }
);
