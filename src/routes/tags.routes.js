import { Router } from "express";
import {
  listTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tags.controller.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import {
  tagCreateUpdateValidator,
  tagIdParamValidator,
} from "../middlewares/validations/validator.js";

const tagsRouter = Router();

tagsRouter.get("/", auth, listTags);
tagsRouter.get("/:id", auth, admin, tagIdParamValidator, getTag);
tagsRouter.post("/", auth, admin, tagCreateUpdateValidator, createTag);
tagsRouter.put(
  "/:id",
  auth,
  admin,
  tagIdParamValidator,
  tagCreateUpdateValidator,
  updateTag
);
tagsRouter.delete("/:id", auth, admin, tagIdParamValidator, deleteTag);

export default tagsRouter;
