import { jsonDb } from '../../db/jsonDb.js';

async function populateCategory(doc) {
  if (!doc) return null;
  const copy = { ...doc };
  if (copy.category) {
    const cat = await jsonDb.collection('categories').findById(copy.category);
    copy.category = cat
      ? { _id: cat._id, name: cat.name, slug: cat.slug }
      : copy.category;
  }
  return copy;
}

export const Project = {
  find(filter) {
    return jsonDb.collection('projects').find(filter);
  },
  findById(id) {
    const state = { populate: false };
    const promise = Promise.resolve().then(async () => {
      const doc = await jsonDb.collection('projects').findById(id);
      return state.populate ? populateCategory(doc) : doc;
    });
    promise.populate = () => {
      state.populate = true;
      return promise;
    };
    return promise;
  },
  create(payload) {
    return jsonDb.collection('projects').create(payload);
  },
  findByIdAndUpdate(id, payload, opts) {
    const promise = (async () => {
      const updated = await jsonDb.collection('projects').findByIdAndUpdate(id, payload, opts);
      return populateCategory(updated);
    })();
    promise.populate = () => promise;
    return promise;
  },
  findByIdAndDelete(id) {
    return jsonDb.collection('projects').findByIdAndDelete(id);
  },
  countDocuments(filter) {
    return jsonDb.collection('projects').countDocuments(filter);
  },
};
