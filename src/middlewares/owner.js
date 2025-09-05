import { ArticleModel } from "../models/article.model.js";

export async function owner(req, res, next) {
  try {
    const { id } = req.params;
    const article = await ArticleModel.findByPk(id);
    if (!article)
      return res.status(404).json({ error: "Artículo no encontrado" });

    const isOwner = article.user_id === req.user?.id;
    const isAdmin = req.user?.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ error: "Forbidden" });

    req.article = article;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
