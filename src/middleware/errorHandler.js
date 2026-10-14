import { AppError } from '../utils/AppError.js';
import { fail } from '../utils/response.js';

export function notFound(req, res) {
  return fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err instanceof AppError) {
    return fail(res, err.message, err.status, err.errors);
  }

  if (err.name === 'MulterError') {
    return fail(res, err.message, 400);
  }

  if (err.name === 'ValidationError') {
    return fail(res, err.message, 422);
  }

  if (err.code === 11000) {
    return fail(res, 'Duplicate value', 409);
  }

  console.error(err);
  return fail(res, err.message || 'Internal server error', err.status || 500);
}
