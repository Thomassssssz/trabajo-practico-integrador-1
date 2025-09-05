import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3000,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      freezeTableName: true,
    },
  }
);

export const StartDB = async (doSync = true) => {
  try {
    await sequelize.authenticate();
    console.log("Se conecto con la base de datos exitosamente");
    if (doSync) {
      await import("../models/index.js");
      await sequelize.sync({ alter: true });
    }
  } catch (error) {
    console.log("Error al intentar conectar la base de datos", error);
  }
};

export default sequelize;
