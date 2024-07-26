import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  if (filter.type) {
    contactsQuery.where("contactType").equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where("isFavourite").equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec(),
  ]);

  // const contactsCount = await ContactsCollection.find()
  //   .merge(contactsQuery)
  //   .countDocuments();
  // const contacts = await contactsQuery
  //   .sort({ [sortBy]: sortOrder })
  //   .skip(skip)
  //   .limit(limit)
  //   .exec();
  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
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
  return result;
};
