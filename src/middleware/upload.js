import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/AppError.js';
import { isCloudinaryEnabled } from '../config/cloudinary.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});

/** Extra extensions some browsers send with empty/odd MIME types */
const ALLOWED_EXT = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.bmp',
  '.tif',
  '.tiff',
  '.ico',
  '.avif',
  '.heic',
  '.heif',
  '.mp4',
  '.webm',
  '.mov',
  '.m4v',
  '.avi',
  '.mkv',
  '.ogv',
  '.ogg',
  '.3gp',
]);

function isAllowedFile(file) {
  const mime = (file.mimetype || '').toLowerCase();
  if (mime.startsWith('image/') || mime.startsWith('video/')) return true;

  const ext = path.extname(file.originalname || '').toLowerCase();
  return ALLOWED_EXT.has(ext);
}

function fileFilter(_req, file, cb) {
  if (!isAllowedFile(file)) {
    return cb(new AppError('Unsupported file type. Upload any image or video file.', 400));
  }
  cb(null, true);
}

const storage = isCloudinaryEnabled() ? multer.memoryStorage() : diskStorage;

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});
