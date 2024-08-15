import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.base": "Username should be a string",
    "string.min": "Username should have at least 3 characters",
    "string.max": "Username should have at most 20 characters",
    "any.required": "Username is required",
  }),
  phoneNumber: Joi.string().required().messages({
    "any.required": "Phone number is required",
  }),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").required(),
  photo: Joi.string(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    "string.base": "Username should be a string",
    "string.min": "Username should have at least 3 characters",
    "string.max": "Username should have at most 20 characters",
  }),
  phoneNumber: Joi.string(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal"),
  photo: Joi.string(),
});
