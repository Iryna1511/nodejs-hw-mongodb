import createHttpError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploads.js";

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  filter.userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(id, userId);

  if (contact === null) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
    console.log(photoUrl);
  }

  const contactData = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    contactType: req.body.contactType,
    userId: req.user._id,
    photo: photoUrl,
    ...req.body,
  };
  const newContact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data: newContact,
  });
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const contact = req.body;
  const photo = req.file;

  console.log("Fn updateContactController", req.file);
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const updatedContact = await updateContact(id, userId, {
    ...contact,
    photo: photoUrl,
  });

  if (updatedContact === null) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(200).json({
    status: 200,
    message: "Successfully patched a contact!",
    data: updatedContact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;
  const result = await deleteContact(id, userId);

  if (result === null) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(204).send();
};
