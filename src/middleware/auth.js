import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { fail } from '../utils/response.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return fail(res, 'Authentication required', 401);

    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findById(payload.id).select('-passwordHash');
    if (!admin) return fail(res, 'Invalid token', 401);

    req.admin = admin;
    next();
  } catch {
    return fail(res, 'Invalid or expired token', 401);
  }
}
