import express, { Router } from "express";
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const router = Router();
const jsonParser = express.json();

// {
//   type: ["application/json", "application/vnd.api+json", "multipart/form-data"],
//   limit: "500kb",
// }

router.use(authenticate);
router.get("/", ctrlWrapper(getAllContactsController));
router.get("/:id", isValidId, ctrlWrapper(getContactByIdController));
router.post(
  "/",
  upload.single("photo"),
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
router.patch(
  "/:id",
  isValidId,
  upload.single("photo"),
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
router.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default router;
