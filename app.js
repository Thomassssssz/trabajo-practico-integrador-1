import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { StartDB } from "./src/config/database.js";

// Rutas
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";
import articlesRoutes from "./src/routes/articles.routes.js";
import tagsRoutes from "./src/routes/tags.routes.js";
import articlesTagsRoutes from "./src/routes/articles.Tags.routes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

//---------------Midlewares---------------------//
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//-----------------Rutas------------------//
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/tags", tagsRoutes);
app.use("/api/articles-tags", articlesTagsRoutes);

//----------Health y 404-------------------//
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

StartDB(true).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
