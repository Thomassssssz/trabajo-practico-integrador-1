import { sequelize } from "../config/database.js";
import { UserModel } from "./user.model.js";
import { UserProfileModel } from "./user.profile.model.js";
import { ArticleModel } from "./article.model.js";
import { TagModel } from "./tag.model.js";
import { ArticleTagModel } from "./articleTag.model.js";

//----------------Relaciones 1:1--------------//
UserModel.hasOne(UserProfileModel, {
  as: "profile",
  foreignKey: { name: "user_id", unique: true },
  onDelete: "CASCADE",
});
UserProfileModel.belongsTo(UserModel, {
  as: "user",
  foreignKey: { name: "user_id", allowNull: false },
});

//---------------Relaciones1:N------------------//
UserModel.hasMany(ArticleModel, {
  as: "articles",
  foreignKey: { name: "user_id", allowNull: false },
  onDelete: "CASCADE",
});
ArticleModel.belongsTo(UserModel, {
  as: "author",
  foreignKey: { name: "user_id", allowNull: false },
});

//------------RelacionesN:M--------------//
ArticleModel.belongsToMany(TagModel, {
  through: { model: ArticleTagModel, unique: false },
  as: "tags",
  foreignKey: "article_id",
  otherKey: "tag_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

TagModel.belongsToMany(ArticleModel, {
  through: { model: ArticleTagModel, unique: false },
  as: "articles",
  foreignKey: "tag_id",
  otherKey: "article_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export {
  sequelize,
  UserModel,
  UserProfileModel,
  ArticleModel,
  TagModel,
  ArticleTagModel,
};
