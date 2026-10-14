import * as authService from '../services/authService.js';
import { success } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const data = await authService.loginAdmin(req.body.email, req.body.password);
    return success(res, data, 'Logged in');
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    return success(res, req.admin);
  } catch (err) {
    next(err);
  }
}
