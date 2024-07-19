import createHttpError from "http-errors";

export const notFoundHandler = (req, res, next) => {
  const err = createHttpError(404, "Route not found");
  next(err);
};
