import dotenv from "dotenv";
import { cleanEnv, num, port, str } from "envalid";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const config = cleanEnv(process.env, {
  APP_VERSION: str({ default: process.env.npm_package_version }),
  NODE_ENV: str({ default: "development" }),
  PORT: port({ default: 3000 }),
  HOST: str({ default: "localhost" }),
  SERVER_URL: str({ default: "http://localhost:3000" }),
  JWT_ACCESS_TOKEN_SECRET: str({ default: "secret" }),
  JWT_REFRESH_TOKEN_SECRET: str({ default: "refresh_secret" }),
  JWT_EXPIRATION: num({ default: 3600000 }),
  JWT_COOKIE_NAME: str({ default: "Authorization" }),
  JWT_AUTH_TYPE: str({ default: "Basic" }),
  REDIS_HOST: str({ default: "redis" }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
});

export default config;
