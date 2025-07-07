class TypedCollection {
  constructor(storage) {
    this.storage = storage;
  }

  async get(key) {
    return this.storage.get(key);
  }

  async set(key, value) {
    return this.storage.set(key, value);
  }

  async find(options) {
    return this.storage.find(options);
  }

  async findOne(options) {
    return this.storage.findOne(options);
  }

  async insert(data) {
    return this.storage.insert(data);
  }

  async update(key, data) {
    return this.storage.update(key, data);
  }

  async delete(key) {
    return this.storage.delete(key);
  }

  async count(options) {
    return this.storage.count(options);
  }

  async insertMany(items) {
    return this.storage.insertMany(items);
  }
}

module.exports = { TypedCollection };
