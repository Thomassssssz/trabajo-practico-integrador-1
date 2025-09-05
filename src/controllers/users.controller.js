import { validationResult } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/user.profile.model.js";
import { ArticleModel } from "../models/article.model.js";

export const listUsers = async (_req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
      include: [{ model: UserProfileModel, as: "profile" }],
    });
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: UserProfileModel, as: "profile" },
        { model: ArticleModel, as: "articles" },
      ],
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    //----------solo se permite actualizar role user/admin o otros campos no sensibles----------//
    await user.update(req.body);
    const { password, ...safe } = user.toJSON();
    return res.status(200).json({ message: "Usuario actualizado", user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();
    return res.status(200).json({ message: "Usuario eliminado (lógico)" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default { listUsers, getUser, updateUser, deleteUser };
