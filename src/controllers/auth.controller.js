import { validationResult } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { UserProfileModel } from "../models/user.profile.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { JWT_SECRET = "s3cr3t", COOKIE_NAME = "token" } = process.env;

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { username, email, password, role } = req.body;

    //------------validacion de unicidad de email-------//
    const existingEmail = await UserModel.findOne({ where: { email } });
    if (existingEmail)
      return res.status(400).json({ errofr: "Email ya registrado" });

    const existingUser = await UserModel.findOne({ where: { username } });
    if (existingUser)
      return res.status(400).json({ error: "Username ya registrado" });
    let finalRole = "user";
    if (role === "admin") {
      //-------permite crear admin solo si todabia no hay uno--------//
      const adminCount = await UserModel.count({ where: { role: "admin" } });
      if (adminCount === 0) finalRole = "admin";
    }

    //----------Hash y creación----------------//
    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      email,
      password: hashed,
      role: finalRole,
    });

    //-----------Crear perfil vacío------------------//
    await UserProfileModel.create({
      user_id: user.id,
      first_name: "",
      last_name: "",
      biography: null,
      avatar_url: null,
      birth_date: null,
    });

    //--------------JWT y cookie---------------------//
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    setAuthCookie(res, token);

    const payload = {
      message: "Registro exitoso",
      user: { id: user.id, username, email, role: user.role },
    };
    if (role === "admin" && finalRole !== "admin") {
      payload.note = "Se creó como 'user' porque ya existe un admin.";
    }

    return res.status(201).json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    setAuthCookie(res, token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [{ model: UserProfileModel, as: "profile" }],
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const profile = await UserProfileModel.findOne({
      where: { user_id: req.user.id },
    });
    if (!profile)
      return res.status(404).json({ error: "Perfil no encontrado" });

    await profile.update(req.body);
    return res.status(200).json({ message: "Perfil actualizado", profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (_req, res) => {
  try {
    res.clearCookie(COOKIE_NAME);
    return res.status(200).json({ message: "Logout ok" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
