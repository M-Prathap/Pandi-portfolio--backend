import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(requireAuth);
router.get('/', mediaController.listMedia);
router.post('/', upload.single('file'), mediaController.uploadMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;
