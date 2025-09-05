import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const ArticleModel = sequelize.define(
  "Article",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: false },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [50] },
    },
    excerpt: { type: DataTypes.STRING(500) },
    status: {
      type: DataTypes.ENUM("published", "archived"),
      defaultValue: "published",
    },
  },
  {
    tableName: "articles",
    underscored: true,
    timestamps: true,
  }
);
