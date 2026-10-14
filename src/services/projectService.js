import { Project } from '../models/Project.js';
import { AppError } from '../utils/AppError.js';

export async function listProjects({ q, category, admin = false } = {}) {
  const filter = {};

  if (!admin) {
    filter.isVisible = true;
    filter.status = 'published';
  }

  if (category) {
    filter.category = category;
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { client: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }

  return Project.find(filter)
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: -1 });
}

export async function getProjectById(id, { admin = false } = {}) {
  const project = await Project.findById(id).populate('category', 'name slug');
  if (!project) throw new AppError('Project not found', 404);
  if (!admin && (!project.isVisible || project.status !== 'published')) {
    throw new AppError('Project not found', 404);
  }
  return project;
}

export async function createProject(payload) {
  return Project.create(payload);
}

export async function updateProject(id, payload) {
  const project = await Project.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function deleteProject(id) {
  const project = await Project.findByIdAndDelete(id);
  if (!project) throw new AppError('Project not found', 404);
  return project;
}

export async function reorderProjects(items) {
  // items: [{ id, order }]
  await Promise.all(
    items.map(({ id, order }) => Project.findByIdAndUpdate(id, { order }))
  );
  return listProjects({ admin: true });
}

export async function getDashboardStats() {
  const [total, published, drafts, visible] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'published' }),
    Project.countDocuments({ status: 'draft' }),
    Project.countDocuments({ isVisible: true, status: 'published' }),
  ]);
  return { total, published, drafts, visible };
}
