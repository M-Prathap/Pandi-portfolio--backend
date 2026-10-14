import { Category } from '../models/Category.js';
import { AppError } from '../utils/AppError.js';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function listCategories() {
  return Category.find().sort({ order: 1, name: 1 });
}

export async function createCategory(payload) {
  const slug = payload.slug || slugify(payload.name);
  return Category.create({ ...payload, slug });
}

export async function updateCategory(id, payload) {
  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }
  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!category) throw new AppError('Category not found', 404);
  return category;
}

export async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw new AppError('Category not found', 404);
  return category;
}
