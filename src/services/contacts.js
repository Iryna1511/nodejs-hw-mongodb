import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = "_id",
  filter = {},
  userId,
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

  contactsQuery.where("userId").equals(filter.userId);

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
    result: contacts,
    ...paginationData,
  };
};

export const getContactById = (contactId, userId) => {
  const contact = ContactsCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = (contact) => {
  const newContact = ContactsCollection.create(contact);
  return newContact;
};

export const updateContact = (contactId, userId, contact) => {
  const updatedContact = ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    contact,
    { new: true },
  );
  return updatedContact;
};

export const deleteContact = (contactId, userId) => {
  const result = ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};
