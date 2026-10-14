import { Router } from 'express';
import * as pageController from '../controllers/pageController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, pageController.listPages);
router.get('/:slug', pageController.getPage);
router.put('/:slug', requireAuth, pageController.updatePage);

export default router;
