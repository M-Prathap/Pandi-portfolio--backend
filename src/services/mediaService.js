import fs from 'fs';
import path from 'path';
import { Media } from '../models/Media.js';
import { AppError } from '../utils/AppError.js';
import { uploadsDir } from '../middleware/upload.js';
import {
  destroyCloudinaryAsset,
  isCloudinaryEnabled,
  uploadBufferToCloudinary,
} from '../config/cloudinary.js';

export async function listMedia() {
  return Media.find().sort({ createdAt: -1 });
}

export async function createMediaFromFile(file) {
  if (isCloudinaryEnabled()) {
    if (!file?.buffer) {
      throw new AppError('Upload buffer missing for Cloudinary', 500);
    }
    const resourceType = (file.mimetype || '').startsWith('video/') ? 'video' : 'image';
    const result = await uploadBufferToCloudinary(file.buffer, {
      originalname: file.originalname,
      resourceType,
    });
    return Media.create({
      url: result.secure_url,
      filename: result.public_id,
      mimeType: file.mimetype,
      size: file.size,
      provider: 'cloudinary',
      resourceType,
    });
  }

  const url = `/uploads/${file.filename}`;
  return Media.create({
    url,
    filename: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    provider: 'local',
  });
}

export async function deleteMedia(id) {
  const media = await Media.findById(id);
  if (!media) throw new AppError('Media not found', 404);

  if (media.provider === 'cloudinary' || media.url?.includes('res.cloudinary.com')) {
    const resourceType = media.resourceType || ((media.mimeType || '').startsWith('video/') ? 'video' : 'image');
    try {
      await destroyCloudinaryAsset(media.filename, resourceType);
    } catch (err) {
      console.warn('Cloudinary destroy failed', err.message);
    }
  } else {
    const filePath = path.join(uploadsDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await media.deleteOne();
  return media;
}
