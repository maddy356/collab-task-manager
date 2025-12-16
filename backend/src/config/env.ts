export const env = {
  PORT: Number(process.env.PORT || 4000),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  COOKIE_NAME: process.env.COOKIE_NAME || "ctm_token",
  SECURE_COOKIE: (process.env.SECURE_COOKIE || "false").toLowerCase() === "true"
};
