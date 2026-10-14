import * as projectService from '../services/projectService.js';
import { Media } from '../models/Media.js';
import { success } from '../utils/response.js';

export async function listPublicProjects(req, res, next) {
  try {
    const data = await projectService.listProjects({
      q: req.query.q,
      category: req.query.category,
      admin: false,
    });
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getPublicProject(req, res, next) {
  try {
    const data = await projectService.getProjectById(req.params.id, { admin: false });
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function listAdminProjects(req, res, next) {
  try {
    const data = await projectService.listProjects({
      q: req.query.q,
      category: req.query.category,
      admin: true,
    });
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getAdminProject(req, res, next) {
  try {
    const data = await projectService.getProjectById(req.params.id, { admin: true });
    return success(res, data);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const data = await projectService.createProject(req.body);
    return success(res, data, 'Project created', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const data = await projectService.updateProject(req.params.id, req.body);
    return success(res, data, 'Project updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    return success(res, null, 'Project deleted');
  } catch (err) {
    next(err);
  }
}

export async function reorderProjects(req, res, next) {
  try {
    const data = await projectService.reorderProjects(req.body.items || []);
    return success(res, data, 'Projects reordered');
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const projectStats = await projectService.getDashboardStats();
    const mediaCount = await Media.countDocuments();
    return success(res, { ...projectStats, media: mediaCount });
  } catch (err) {
    next(err);
  }
}
