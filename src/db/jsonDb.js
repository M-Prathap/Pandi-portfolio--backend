import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomBytes } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data');
const dbPath = path.join(dataDir, 'store.json');

function id() {
  return randomBytes(12).toString('hex');
}

function matches(doc, filter = {}) {
  return Object.entries(filter).every(([key, value]) => {
    if (key === '$or') {
      return value.some((clause) => matches(doc, clause));
    }
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      if (value.$regex != null) {
        const re = new RegExp(value.$regex, value.$options || '');
        const field = doc[key];
        if (Array.isArray(field)) return field.some((item) => re.test(String(item)));
        return re.test(String(field ?? ''));
      }
      return false;
    }
    if (Array.isArray(doc[key])) {
      return doc[key].includes(value) || String(doc[key]) === String(value);
    }
    return String(doc[key]) === String(value);
  });
}

class Collection {
  constructor(name, db) {
    this.name = name;
    this.db = db;
  }

  _rows() {
    if (!this.db.data[this.name]) this.db.data[this.name] = [];
    return this.db.data[this.name];
  }

  find(filter = {}) {
    const rows = this._rows().filter((d) => matches(d, filter));
    return new Query(rows, this);
  }

  async findOne(filter = {}) {
    return this._rows().find((d) => matches(d, filter)) || null;
  }

  async findById(idVal) {
    return this._rows().find((d) => String(d._id) === String(idVal)) || null;
  }

  async create(doc) {
    const now = new Date().toISOString();
    const row = {
      ...structuredClone(doc),
      _id: doc._id || id(),
      createdAt: now,
      updatedAt: now,
    };
    this._rows().push(row);
    await this.db.save();
    return structuredClone(row);
  }

  async insertMany(docs) {
    const out = [];
    for (const doc of docs) out.push(await this.create(doc));
    return out;
  }

  async findOneAndUpdate(filter, payload, opts = {}) {
    let row = await this.findOne(filter);
    if (!row && opts.upsert) {
      return this.create({ ...filter, ...payload });
    }
    if (!row) return null;
    Object.assign(row, payload, { updatedAt: new Date().toISOString() });
    if (payload.socials && row.socials) {
      row.socials = { ...row.socials, ...payload.socials };
    }
    await this.db.save();
    return opts.new === false ? null : structuredClone(row);
  }

  async findByIdAndUpdate(idVal, payload, opts = {}) {
    return this.findOneAndUpdate({ _id: idVal }, payload, opts);
  }

  async findByIdAndDelete(idVal) {
    const rows = this._rows();
    const idx = rows.findIndex((d) => String(d._id) === String(idVal));
    if (idx < 0) return null;
    const [removed] = rows.splice(idx, 1);
    await this.db.save();
    return removed;
  }

  async countDocuments(filter = {}) {
    return this._rows().filter((d) => matches(d, filter)).length;
  }

  async deleteOne(filter) {
    const rows = this._rows();
    const idx = rows.findIndex((d) => matches(d, filter));
    if (idx < 0) return { deletedCount: 0 };
    rows.splice(idx, 1);
    await this.db.save();
    return { deletedCount: 1 };
  }
}

class Query {
  constructor(rows, collection) {
    this.rows = rows;
    this.collection = collection;
    this._sort = null;
    this._populate = null;
  }

  sort(spec) {
    this._sort = spec;
    return this;
  }

  populate(field, select) {
    this._populate = { field, select };
    return this;
  }

  select() {
    return this;
  }

  async then(resolve, reject) {
    try {
      resolve(await this.exec());
    } catch (e) {
      reject?.(e);
    }
  }

  async exec() {
    let rows = [...this.rows];
    if (this._sort) {
      const [[key, dir]] = Object.entries(this._sort);
      rows.sort((a, b) => {
        if (a[key] < b[key]) return dir === 1 || dir === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return dir === 1 || dir === 'asc' ? 1 : -1;
        return 0;
      });
      // multi-key: apply sequential if needed
      const keys = Object.entries(this._sort);
      rows.sort((a, b) => {
        for (const [k, d] of keys) {
          const dir = d === -1 || d === 'desc' ? -1 : 1;
          if (a[k] < b[k]) return -1 * dir;
          if (a[k] > b[k]) return 1 * dir;
        }
        return 0;
      });
    }
    if (this._populate) {
      const { field } = this._populate;
      const catCol = this.collection.db.collection('categories');
      rows = await Promise.all(
        rows.map(async (row) => {
          const copy = structuredClone(row);
          if (copy[field]) {
            const ref = await catCol.findById(copy[field]);
            if (ref) {
              copy[field] = { _id: ref._id, name: ref.name, slug: ref.slug };
            }
          }
          return copy;
        })
      );
    } else {
      rows = rows.map((r) => structuredClone(r));
    }
    return rows;
  }
}

class JsonDB {
  constructor() {
    this.data = {};
    this._collections = {};
  }

  async init() {
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(dbPath)) {
      this.data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } else {
      this.data = {};
      await this.save();
    }
    console.log('JSON file database ready at', dbPath);
  }

  async save() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
  }

  collection(name) {
    if (!this._collections[name]) {
      this._collections[name] = new Collection(name, this);
    }
    return this._collections[name];
  }
}

export const jsonDb = new JsonDB();

export async function connectJsonDB() {
  await jsonDb.init();
  return jsonDb;
}
