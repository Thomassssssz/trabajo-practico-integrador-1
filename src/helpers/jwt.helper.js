import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//---------funcion poara generar el token cuando se loguea---------------//
export const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

//------------verificacion del token--------------------------//
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("error al verificar el token", error.msg);
  }
};
