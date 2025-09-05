import { body, param, query } from "express-validator";

//----------------------auth-------------//
export const registerValidator = [
  body("username").isString().trim().isLength({ min: 3, max: 20 }),
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "La contraseña debe tener 8+ caracteres e incluir mayúscula, minúscula y número."
    ),
  body("role").optional().isIn(["user", "admin"]),
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

export const profileUpdateValidator = [
  body("first_name").optional().isString().trim().isLength({ min: 2, max: 50 }),
  body("last_name").optional().isString().trim().isLength({ min: 2, max: 50 }),
  body("biography").optional().isString().trim().isLength({ max: 500 }),
  body("avatar_url").optional().isURL(),
];

//----------------users (admin)---------------------/
export const userIdParamValidator = [param("id").isInt().toInt()];
export const userUpdateRoleValidator = [
  body("role").optional().isIn(["user", "admin"]),
];

//-------------------articles--------------------//
export const articleIdParamValidator = [param("id").isInt().toInt()];

export const articleCreateValidator = [
  body("title").isString().trim().isLength({ min: 3, max: 200 }),
  body("content")
    .isString()
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener al menos 50 caracteres."),
  body("excerpt").optional().isString().isLength({ max: 500 }),
  body("status").optional().isIn(["published", "archived"]),
];

export const articleUpdateValidator = [
  body("title").optional().isString().trim().isLength({ min: 3, max: 200 }),
  body("content")
    .optional()
    .isString()
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener al menos 50 caracteres."),
  body("excerpt").optional().isString().isLength({ max: 500 }),
  body("status").optional().isIn(["published", "archived"]),
];

//--------------tags (admin)------------------//
export const tagIdParamValidator = [param("id").isInt().toInt()];
export const tagCreateUpdateValidator = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 2, max: 30 })
    .matches(/^\S+$/)
    .withMessage("El nombre no debe contener espacios"),
];

//-----------------articles - tags-------------------//

export const articleTagIdParamValidator = [param("id").isInt().toInt()];
export const articleTagCreateValidator = [
  body("article_id").isInt().toInt(),
  body("tag_id").isInt().toInt(),
];
