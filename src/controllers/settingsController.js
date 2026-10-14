import * as settingsService from '../services/settingsService.js';
import { success } from '../utils/response.js';

export async function getSettings(req, res, next) {
  try {
    const data = await settingsService.getSettings();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const data = await settingsService.updateSettings(req.body);
    return success(res, data, 'Settings updated');
  } catch (err) {
    next(err);
  }
}
