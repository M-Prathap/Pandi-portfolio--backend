import { jsonDb } from '../../db/jsonDb.js';

export const Admin = {
  findOne(filter) {
    return jsonDb.collection('admins').findOne(filter);
  },
  findById(id) {
    const run = async (omitPassword = false) => {
      const doc = await jsonDb.collection('admins').findById(id);
      if (!doc) return null;
      if (omitPassword) {
        const { passwordHash, ...rest } = doc;
        return rest;
      }
      return doc;
    };
    const promise = run(false);
    promise.select = (fields) => run(String(fields).includes('-passwordHash'));
    return promise;
  },
  findOneAndUpdate(filter, payload, opts) {
    return jsonDb.collection('admins').findOneAndUpdate(filter, payload, opts);
  },
};
