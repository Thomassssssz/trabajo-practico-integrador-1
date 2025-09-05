import { validationResult } from "express-validator";
import { TagModel } from "../models/tag.model.js";
import { ArticleModel } from "../models/article.model.js";

export const listTags = async (_req, res) => {
  try {
    const tags = await TagModel.findAll();
    return res.status(200).json({ tags });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await TagModel.findByPk(id, {
      include: [{ model: ArticleModel, as: "articles" }],
    });
    if (!tag) return res.status(404).json({ error: "Etiqueta no encontrada" });
    return res.status(200).json({ tag });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    const existing = await TagModel.findOne({ where: { name } });
    if (existing)
      return res.status(400).json({ error: "La etiqueta ya existe" });

    const tag = await TagModel.create({ name });
    return res.status(201).json({ message: "Etiqueta creada", tag });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateTag = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const tag = await TagModel.findByPk(id);
    if (!tag) return res.status(404).json({ error: "Etiqueta no encontrada" });

    const { name } = req.body;
    if (name) {
      const exists = await TagModel.findOne({ where: { name } });
      if (exists && exists.id !== tag.id)
        return res.status(400).json({ error: "Nombre en uso" });
    }

    await tag.update(req.body);
    return res.status(200).json({ message: "Etiqueta actualizada", tag });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await TagModel.findByPk(id);
    if (!tag) return res.status(404).json({ error: "Etiqueta no encontrada" });
    await tag.destroy();
    return res.status(200).json({ message: "Etiqueta eliminada" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
