import { Router } from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/',
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('message').trim().notEmpty(),
  validate,
  contactController.submitContact
);

router.get('/messages', requireAuth, contactController.listMessages);

export default router;
