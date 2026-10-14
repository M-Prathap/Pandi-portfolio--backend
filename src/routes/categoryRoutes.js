import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', categoryController.listCategories);
router.post('/', requireAuth, categoryController.createCategory);
router.put('/:id', requireAuth, categoryController.updateCategory);
router.delete('/:id', requireAuth, categoryController.deleteCategory);

export default router;
