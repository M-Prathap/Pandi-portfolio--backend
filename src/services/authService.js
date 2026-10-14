import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export async function loginAdmin(email, password) {
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) throw new AppError('Invalid email or password', 401);

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw new AppError('Invalid email or password', 401);

  const token = jwt.sign({ id: admin._id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  return {
    token,
    admin: { id: admin._id, email: admin.email },
  };
}

export async function getAdminById(id) {
  const admin = await Admin.findById(id).select('-passwordHash');
  if (!admin) throw new AppError('Admin not found', 404);
  return admin;
}
