import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import createHttpError from "http-errors";
import { UserCollection } from "../db/models/user.js";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/index.js";
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

export const logoutUser = (sessionId) => {
  SessionsCollection.deleteOne({ _id: sessionId });
};
