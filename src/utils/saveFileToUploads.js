import path from "node:path";
import fs from "node:fs/promises";
import { TEMPLATES_DIR, UPLOADS_DIR } from "../constants/index.js";
import { env } from "./env.js";

export const saveFileToUploadDir = async (file) => {
  console.log("save file fn", file);
  await fs.rename(
    path.join(TEMPLATES_DIR, file.filename),
    path.join(UPLOADS_DIR, "photos", file.filename),
  );

  return `${env("APP_DOMAIN")}/uploads/${file.filename}`;
};
