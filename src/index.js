import { startServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";
// import { TEMPLATES_DIR, UPLOADS_DIR } from "./constants/index.js";
// import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";

const bootstrap = async () => {
  await initMongoConnection();
  // await createDirIfNotExists(TEMPLATES_DIR);
  // await createDirIfNotExists(UPLOADS_DIR);
  startServer();
};

bootstrap();
