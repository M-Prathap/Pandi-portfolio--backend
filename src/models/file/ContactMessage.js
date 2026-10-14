import { jsonDb } from '../../db/jsonDb.js';

export const ContactMessage = {
  create(payload) {
    return jsonDb.collection('contactMessages').create(payload);
  },
  find() {
    return jsonDb.collection('contactMessages').find({});
  },
};
