export class AppError extends Error {
  constructor(message: string, public statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DuplicateError extends AppError {
  constructor(message = "Reource already exists") {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Reource not found") {
    super(message, 404);
  }
}
