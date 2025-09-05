import { validationResult } from "express-validator";
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { ArticleTagModel } from "../models/articleTag.model.js";

export const addTagToArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { article_id, tag_id } = req.body;

    const article = await ArticleModel.findByPk(article_id);
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });

    //----------solo autor o admin puede etiquetar su artículo------------//
    if (req.user.role !== "admin" && article.user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const tag = await TagModel.findByPk(tag_id);
    if (!tag) return res.status(404).json({ error: "Etiqueta no encontrada" });

    const at = await ArticleTagModel.create({ article_id, tag_id });
    return res
      .status(201)
      .json({ message: "Etiqueta asociada", articleTag: at });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeTagFromArticle = async (req, res) => {
  try {
    const { articleTagId } = req.params;

    const at = await ArticleTagModel.findByPk(articleTagId);
    if (!at) return res.status(404).json({ error: "Asociación no encontrada" });

    const article = await ArticleModel.findByPk(at.article_id);
    if (req.user.role !== "admin" && article.user_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await at.destroy();
    return res.status(200).json({ message: "Etiqueta removida del artículo" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
