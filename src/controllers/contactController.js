import * as contactService from '../services/contactService.js';
import { success } from '../utils/response.js';

export async function submitContact(req, res, next) {
  try {
    const data = await contactService.createContactMessage(req.body);
    return success(res, { id: data._id }, 'Message received', 201);
  } catch (err) {
    next(err);
  }
}

export async function listMessages(req, res, next) {
  try {
    const data = await contactService.listContactMessages();
    return success(res, data);
  } catch (err) {
    next(err);
  }
}
