import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import {
  addTagToArticle,
  removeTagFromArticle,
} from "../controllers/articlesTags.controller.js";
import {
  articleTagCreateValidator,
  articleTagIdParamValidator,
} from "../middlewares/validations/validator.js";

const articlesTagsRouter = Router();
articlesTagsRouter.use(auth);

articlesTagsRouter.post("/", articleTagCreateValidator, addTagToArticle);
articlesTagsRouter.delete(
  "/:articleTagId",
  articleTagIdParamValidator,
  removeTagFromArticle
);

export default articlesTagsRouter;
