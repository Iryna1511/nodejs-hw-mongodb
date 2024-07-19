import { isHttpError } from "http-errors";

export const errorHandler = (error, req, res, next) => {
  if (isHttpError(error) === true) {
    return res.status(error.status).send({
      status: error.status,
      message: error.name,
      data: error.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: error.message,
  });
};
