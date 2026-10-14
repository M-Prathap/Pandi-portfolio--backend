import { jsonDb } from '../../db/jsonDb.js';

export const Page = {
  findOne(filter) {
    return jsonDb.collection('pages').findOne(filter);
  },
  find() {
    return jsonDb.collection('pages').find({});
  },
  findOneAndUpdate(filter, payload, opts) {
    return jsonDb.collection('pages').findOneAndUpdate(filter, payload, opts);
  },
};
