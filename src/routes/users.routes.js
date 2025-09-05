import { Router } from "express";
import {
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";
import { auth } from "../middlewares/auth.js";
import { admin } from "../middlewares/admin.js";
import { param, body } from "express-validator";

const userRouter = Router();
userRouter.use(auth, admin);

userRouter.get("/", listUsers);
userRouter.get("/:id", [param("id").isInt().toInt()], getUser);
userRouter.put(
  "/:id",
  [
    param("id").isInt().toInt(),
    body("role").optional().isIn(["user", "admin"]),
  ],
  updateUser
);
userRouter.delete("/:id", [param("id").isInt().toInt()], deleteUser);

export default userRouter;
