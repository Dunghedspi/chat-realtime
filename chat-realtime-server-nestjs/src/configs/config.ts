export const config = () => ({
  port: Number.parseInt(process.env.SERVER_PORT),
  jwtKey: process.env.KEYJWT,
  database: {
    host: process.env.DATABASE_HOST,
    username: "root",
    // password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    // port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_TYPE,
    logging: false,
    autoLoadModels: true,
    synchronize: true,
    // sync: {
    //     alter: true,
    // }
  },
});
