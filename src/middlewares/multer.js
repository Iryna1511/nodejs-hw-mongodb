import multer from "multer";
import crypto from "node:crypto";
import { TEMPLATES_DIR } from "../constants/index.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMPLATES_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomUUID();
    cb(null, `${uniqueSuffix}_${file.originalname}`);
  },
});

export const upload = multer({ storage });
