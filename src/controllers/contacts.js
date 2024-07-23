import createHttpError from "http-errors";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: "Successfully found contacts!",
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);

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
  //   const { contactData } = req.body;
  const contactData = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    contactType: req.body.contactType,
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
  const contact = req.body;

  const updatedContact = await updateContact(id, contact);

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
  const result = await deleteContact(id);

  if (result === null) {
    return next(createHttpError(404, "Contact not found"));
  }

  res.status(204).send();
};
