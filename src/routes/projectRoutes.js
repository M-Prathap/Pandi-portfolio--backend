import { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', projectController.listPublicProjects);
router.get('/:id', projectController.getPublicProject);

export const adminProjectRouter = Router();
adminProjectRouter.use(requireAuth);
adminProjectRouter.get('/stats', projectController.getStats);
adminProjectRouter.get('/', projectController.listAdminProjects);
adminProjectRouter.get('/:id', projectController.getAdminProject);
adminProjectRouter.post('/', projectController.createProject);
adminProjectRouter.put('/reorder', projectController.reorderProjects);
adminProjectRouter.put('/:id', projectController.updateProject);
adminProjectRouter.delete('/:id', projectController.deleteProject);

export default router;
