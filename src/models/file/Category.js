import { jsonDb } from '../../db/jsonDb.js';

export const Category = {
  find() {
    return jsonDb.collection('categories').find({});
  },
  create(payload) {
    return jsonDb.collection('categories').create(payload);
  },
  insertMany(docs) {
    return jsonDb.collection('categories').insertMany(docs);
  },
  findByIdAndUpdate(id, payload, opts) {
    return jsonDb.collection('categories').findByIdAndUpdate(id, payload, opts);
  },
  findByIdAndDelete(id) {
    return jsonDb.collection('categories').findByIdAndDelete(id);
  },
  countDocuments() {
    return jsonDb.collection('categories').countDocuments();
  },
};
