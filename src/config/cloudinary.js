import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

export function isCloudinaryEnabled() {
  return Boolean(env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret);
}

export function configureCloudinary() {
  if (!isCloudinaryEnabled()) return false;
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
  return true;
}

export async function uploadBufferToCloudinary(buffer, { folder = 'para-portfolio', resourceType = 'auto', originalname = 'upload' } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        public_id: `${Date.now()}-${String(originalname).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)}`,
        overwrite: false,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export async function destroyCloudinaryAsset(publicId, resourceType = 'image') {
  if (!publicId || !isCloudinaryEnabled()) return;
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
