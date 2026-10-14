import { jsonDb } from '../../db/jsonDb.js';

export const Media = {
  find() {
    return jsonDb.collection('media').find({});
  },
  create(payload) {
    return jsonDb.collection('media').create(payload);
  },
  async findById(id) {
    const doc = await jsonDb.collection('media').findById(id);
    if (!doc) return null;
    return {
      ...doc,
      async deleteOne() {
        await jsonDb.collection('media').findByIdAndDelete(doc._id);
      },
    };
  },
  countDocuments() {
    return jsonDb.collection('media').countDocuments();
  },
};
