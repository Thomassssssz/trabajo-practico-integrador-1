import { Router } from "express";
import {
  register,
  login,
  profile,
  updateProfile,
  logout,
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
import {
  registerValidator,
  loginValidator,
  profileUpdateValidator,
} from "../middlewares/validations/validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);
authRouter.post("/login", loginValidator, login);
authRouter.put("/profile", auth, profileUpdateValidator, updateProfile);
authRouter.put("/profile", auth, profileUpdateValidator, updateProfile);
authRouter.post("/logout", auth, logout);

export default authRouter;
