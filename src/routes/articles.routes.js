import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { owner } from "../middlewares/owner.js";
import {
  createArticle,
  listArticles,
  getArticle,
  listMyArticles,
  getMyArticle,
  updateArticle,
  archiveArticle,
} from "../controllers/articles.controller.js";
import {
  articleCreateValidator,
  articleUpdateValidator,
  articleIdParamValidator,
} from "../middlewares/validations/validator.js";

const articlesRouter = Router();
articlesRouter.use(auth);

articlesRouter.post("/", articleCreateValidator, createArticle);
articlesRouter.get("/", listArticles);
articlesRouter.get("/:id", articleIdParamValidator, getArticle);
articlesRouter.get("/user/mine", listMyArticles);
articlesRouter.get("/user/:id", articleIdParamValidator, getMyArticle);
articlesRouter.put(
  "/:id",
  articleIdParamValidator,
  owner,
  articleUpdateValidator,
  updateArticle
);
articlesRouter.delete("/:id", articleIdParamValidator, owner, archiveArticle);

export default articlesRouter;
