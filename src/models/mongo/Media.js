import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    provider: { type: String, enum: ['local', 'cloudinary'], default: 'local' },
    resourceType: { type: String, enum: ['image', 'video', 'raw', 'auto'], default: 'image' },
  },
  { timestamps: true }
);

export const Media = mongoose.model('Media', mediaSchema);
