import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', settingsController.getSettings);
router.put('/', requireAuth, settingsController.updateSettings);

export default router;
