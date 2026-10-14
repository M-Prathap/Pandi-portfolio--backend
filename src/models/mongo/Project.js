import mongoose from 'mongoose';

const projectImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    client: { type: String, default: '' },
    description: { type: String, default: '' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    thumbnail: { type: String, default: '' },
    images: { type: [projectImageSchema], default: [] },
    tools: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    projectUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    layout: { type: String, enum: ['item', 'wide', 'tall'], default: 'item' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
