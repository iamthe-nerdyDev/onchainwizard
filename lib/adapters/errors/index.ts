export default class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const NotFoundError = (message = "Resource not found") => {
  return new AppError(message, 404);
};

export const UnauthorizedError = (message = "Unauthorized") => {
  return new AppError(message, 401);
};

export const ForbiddenError = (message = "Forbidden") => {
  return new AppError(message, 403);
};

export const BadRequestError = (message = "Bad request") => {
  return new AppError(message, 400);
};
