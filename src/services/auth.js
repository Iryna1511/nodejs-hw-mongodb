import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "node:fs/promises";
import handlebars from "handlebars";

import { FIFTEEN_MINUTES, THIRTY_DAYS, SMTP } from "../constants/index.js";
import { env } from "../utils/env.js";
import { sendEmail } from "../utils/sendMail.js";
import { UserCollection } from "../db/models/user.js";
import { SessionsCollection } from "../db/models/session.js";

export const registerUser = async (user) => {
  const userEmail = await UserCollection.findOne({ email: user.email });
  if (userEmail) throw createHttpError(409, "Email in use");
  user.password = await bcrypt.hash(user.password, 10);
  return await UserCollection.create(user);
};

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (user) => {
  const userEmail = await UserCollection.findOne({ email: user.email });
  if (!userEmail) throw createHttpError(404, "User not found");
  const isEqual = await bcrypt.compare(user.password, userEmail.password);
  if (!isEqual) throw createHttpError(401, "Unauthorized");

  await SessionsCollection.deleteOne({ userId: userEmail._id });
  const newSession = createSession();

  return await SessionsCollection.create({
    userId: userEmail._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();
  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });
  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (user === null) {
    throw createHttpError(404, "User not found");
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env("JWT_SECRET"),
    {
      expiresIn: "5m",
    },
  );

  const resetPasswordTemplatePath = path.join(
    "src",
    "templates",
    "reset-pswd-email.html",
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.FROM),
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const resetPassword = async (password, token) => {
  try {
    const decoded = jwt.verify(token, env("JWT_SECRET"));
    const user = await UserCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });

    if (user === null) {
      throw createHttpError(404, "User not found");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    await UserCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword },
    );
    await SessionsCollection.findOneAndDelete({ userId: user._id });
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    throw error;
  }
};
