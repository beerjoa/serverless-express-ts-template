import dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

// dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
dotenv.config({ path: ".env" });

const config = cleanEnv(process.env, {
  APP_VERSION: str({ default: process.env.npm_package_version }),
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 3000 }),
  HOST: str({ default: "localhost" }),
  SERVER_URL: str({ default: "http://localhost:3000" }),
});

export default config;
