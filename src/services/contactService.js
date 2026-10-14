import { ContactMessage } from '../models/ContactMessage.js';

export async function createContactMessage(payload) {
  return ContactMessage.create(payload);
}

export async function listContactMessages() {
  return ContactMessage.find().sort({ createdAt: -1 });
}
