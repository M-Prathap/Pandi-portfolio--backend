import { Router } from 'express';
import authRoutes from './authRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import pageRoutes from './pageRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import projectRoutes, { adminProjectRouter } from './projectRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contactRoutes from './contactRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/pages', pageRoutes);
router.use('/categories', categoryRoutes);
router.use('/projects', projectRoutes);
router.use('/admin/projects', adminProjectRouter);
router.use('/media', mediaRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);

export default router;
