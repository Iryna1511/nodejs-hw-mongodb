import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./utils/env.js";
import router from "./routers/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { UPLOADS_DIR } from "./constants/index.js";
// import path from "node:path";

const PORT = Number(env("PORT", "3000"));

export const startServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    }),
  );

  app.get("/", (req, res) => {
    res.json({
      message: "Hello world!",
    });
  });

  app.use("/uploads", express.static(UPLOADS_DIR));
  // app.use(express.static(path.resolve("src", "uploads")));

  app.use(router);
  app.use("*", notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
