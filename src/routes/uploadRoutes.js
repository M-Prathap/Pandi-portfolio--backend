import { Router } from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/', requireAuth, upload.single('file'), mediaController.uploadMedia);

export default router;
