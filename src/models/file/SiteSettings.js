import { jsonDb } from '../../db/jsonDb.js';

export const SiteSettings = {
  async findOne(filter = {}) {
    const doc = await jsonDb.collection('settings').findOne(filter);
    if (!doc) return null;
    const entity = {
      ...doc,
      socials: { ...(doc.socials || {}) },
      toObject() {
        return { ...this, socials: { ...this.socials } };
      },
      async save() {
        const payload = { ...this };
        delete payload.save;
        delete payload.toObject;
        await jsonDb.collection('settings').findByIdAndUpdate(this._id, payload);
        return this;
      },
    };
    return entity;
  },
  create(payload) {
    return jsonDb.collection('settings').create(payload);
  },
  countDocuments() {
    return jsonDb.collection('settings').countDocuments();
  },
};
