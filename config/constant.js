import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  ORIGIN: process.env.CLIENT_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  CLIENT_URL: process.env.CLIENT_URL,
};
export default config;
