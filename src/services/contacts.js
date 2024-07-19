import { ContactsCollection } from "../db/models/contact.js";

export const getAllContacts = () => {
  const contacts = ContactsCollection.find();
  return contacts;
};

export const getContactById = (contactId) => {
  const contact = ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = (contact) => {
  const newContact = ContactsCollection.create(contact);
  return newContact;
};

export const updateContact = (contactId, contact) => {
  const updatedContact = ContactsCollection.findByIdAndUpdate(
    contactId,
    contact,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = (contactId) => {
  const result = ContactsCollection.findByIdAndDelete(contactId);
  // const result = ContactsCollection.findOneAndDelete({ _id: contactId });
  return result;
};
