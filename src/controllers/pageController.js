import * as pageService from '../services/pageService.js';
import { success } from '../utils/response.js';

export async function getPage(req, res, next) {
  try {
    const data = await pageService.getPageBySlug(req.params.slug);
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listPages(req, res, next) {
  try {
    const data = await pageService.listPages();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function updatePage(req, res, next) {
  try {
    const data = await pageService.updatePage(req.params.slug, req.body);
    return success(res, data, 'Page updated');
  } catch (err) {
    next(err);
  }
}
