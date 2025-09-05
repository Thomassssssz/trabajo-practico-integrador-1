import bcrypt from "bcrypt";

//--------------Hashear contraseña---------------//

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

//----------Verificar contraseña----------------//

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
