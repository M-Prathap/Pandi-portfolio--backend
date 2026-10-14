import { Page } from '../models/Page.js';
import { AppError } from '../utils/AppError.js';

export async function getPageBySlug(slug) {
  const page = await Page.findOne({ slug });
  if (!page) throw new AppError('Page not found', 404);
  return page;
}

export async function listPages() {
  return Page.find().sort({ slug: 1 });
}

export async function updatePage(slug, payload) {
  const page = await Page.findOneAndUpdate({ slug }, payload, {
    new: true,
    runValidators: true,
  });
  if (!page) throw new AppError('Page not found', 404);
  return page;
}
