import { Router } from 'express';
import authRoutes from './authRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import pageRoutes from './pageRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import projectRoutes, { adminProjectRouter } from './projectRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contactRoutes from './contactRoutes.js';

import mongoose from 'mongoose';
import { useFileDb } from '../config/dbMode.js';

const router = Router();

router.get('/health', (_req, res) => {
  const dbStatus = useFileDb()
    ? 'file'
    : mongoose.connection.readyState === 1
    ? 'connected'
    : 'disconnected';

  res.json({
    success: true,
    status: 'healthy',
    database: dbStatus,
  });
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
