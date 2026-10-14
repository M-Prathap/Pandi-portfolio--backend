import * as categoryService from '../services/categoryService.js';
import { success } from '../utils/response.js';

export async function listCategories(req, res, next) {
  try {
    const data = await categoryService.listCategories();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const data = await categoryService.createCategory(req.body);
    return success(res, data, 'Category created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const data = await categoryService.updateCategory(req.params.id, req.body);
    return success(res, data, 'Category updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(req.params.id);
    return success(res, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
}
