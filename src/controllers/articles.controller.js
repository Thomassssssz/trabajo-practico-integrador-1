import { validationResult } from "express-validator";
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";

export const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { title, content, status = "published", excerpt } = req.body;
    const article = await ArticleModel.create({
      title,
      content,
      status,
      excerpt: excerpt || null,
      user_id: req.user.id,
    });

    return res.status(201).json({ message: "Artículo creado", article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listArticles = async (_req, res) => {
  try {
    const list = await ArticleModel.findAll({
      where: { status: "published" },
      include: [{ model: TagModel, as: "tags" }],
    });
    return res.status(200).json({ articles: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findByPk(id, {
      include: [{ model: TagModel, as: "tags" }],
    });
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });
    return res.status(200).json({ article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listMyArticles = async (req, res) => {
  try {
    const list = await ArticleModel.findAll({
      where: { user_id: req.user.id, status: "published" },
      include: [{ model: TagModel, as: "tags" }],
    });
    return res.status(200).json({ articles: list });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMyArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findOne({
      where: { id, user_id: req.user.id },
      include: [{ model: TagModel, as: "tags" }],
    });
    if (!article)
      return res
        .status(404)
        .json({ error: "Artículo no encontrado para el usuario" });
    return res.status(200).json({ article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    await req.article.update(req.body);
    return res
      .status(200)
      .json({ message: "Artículo actualizado", article: req.article });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const archiveArticle = async (req, res) => {
  try {
    await req.article.update({ status: "archived" });
    return res
      .status(200)
      .json({ message: "Artículo archivado (eliminación lógica)" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
