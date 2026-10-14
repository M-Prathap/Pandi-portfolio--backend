import * as mediaService from '../services/mediaService.js';
import { AppError } from '../utils/AppError.js';
import { success } from '../utils/response.js';

export async function listMedia(req, res, next) {
  try {
    const data = await mediaService.listMedia();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function uploadMedia(req, res, next) {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const data = await mediaService.createMediaFromFile(req.file);
    return success(res, data, 'File uploaded', 201);
  } catch (err) {
    next(err);
  }
}

export async function deleteMedia(req, res, next) {
  try {
    await mediaService.deleteMedia(req.params.id);
    return success(res, null, 'Media deleted');
  } catch (err) {
    next(err);
  }
}
