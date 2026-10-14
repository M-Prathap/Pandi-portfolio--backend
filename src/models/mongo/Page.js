import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, enum: ['about', 'contact'] },
    title: { type: String, required: true },
    lead: { type: String, default: '' },
    body: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Page = mongoose.model('Page', pageSchema);
