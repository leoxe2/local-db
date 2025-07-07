const { JsonFileAdapter } = require('../adapters/json');
const { SqliteAdapter } = require('../adapters/sqlite');
const { MemoryAdapter } = require('../adapters/memory');

class database {
  constructor(config) {
    this.adapter = this.createAdapter(config);
  }

  createAdapter(config) {
    switch (config.type) {
      case 'json':
        if (!config.path) throw new Error('JSON storage requires a path');
        return new JsonFileAdapter(config.path);
      case 'sqlite':
        if (!config.path) throw new Error('SQLite storage requires a path');
        return new SqliteAdapter(config.path, config.collection);
      case 'memory':
        return new MemoryAdapter();
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }

  async get(key) {
    return this.adapter.get(key);
  }

  async set(key, value) {
    return this.adapter.set(key, value);
  }

  async delete(key) {
    return this.adapter.delete(key);
  }

  async clear() {
    return this.adapter.clear();
  }

  async keys() {
    return this.adapter.keys();
  }

  async has(key) {
    return this.adapter.has(key);
  }

  async size() {
    return this.adapter.size();
  }

  async find(options) {
    return this.adapter.find(options);
  }

  async findOne(options) {
    return this.adapter.findOne(options);
  }

  async insert(data) {
    return this.adapter.insert(data);
  }

  async update(key, data) {
    return this.adapter.update(key, data);
  }

  async count(options) {
    return this.adapter.count(options);
  }

  async insertMany(items) {
    const ids = [];
    for (const item of items) {
      ids.push(await this.insert(item));
    }
    return ids;
  }

  close() {
    if (this.adapter instanceof SqliteAdapter) {
      this.adapter.close();
    }
  }
}

module.exports = { LocalDB };