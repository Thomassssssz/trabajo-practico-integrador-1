import jwt from "jsonwebtoken";
const { JWT_SECRET = "cambia_esto", COOKIE_NAME = "token" } = process.env;

export function auth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
