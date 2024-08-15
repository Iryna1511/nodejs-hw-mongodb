import path from "node:path";

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  HOST: "HOST",
  PORT_SMTP: "PORT_SMTP",
  USER: "USER",
  PASSWORD: "PASSWORD",
  FROM: "FROM",
};

export const TEMPLATES_DIR = path.resolve("src", "temp");
export const UPLOADS_DIR = path.resolve("src", "uploads");

export const CLOUDINARY = {
  CLOUD_NAME: "CLOUD_NAME",
  API_KEY: "API_KEY",
  API_SECRET: "API_SECRET",
};
