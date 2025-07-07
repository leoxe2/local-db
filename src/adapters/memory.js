class memory {
  constructor() {
    this.data = new Map();
  }

  async get(key) {
    return this.data.get(key) ?? null;
  }

  async set(key, value) {
    this.data.set(key, value);
  }

  async delete(key) {
    return this.data.delete(key);
  }

  async clear() {
    this.data.clear();
  }

  async keys() {
    return Array.from(this.data.keys());
  }

  async has(key) {
    return this.data.has(key);
  }

  async size() {
    return this.data.size;
  }

  async find(options = {}) {
    let results = Array.from(this.data.values());

    if (options.where) {
      results = results.filter(item => 
        Object.entries(options.where).every(([key, value]) => item[key] === value)
      );
    }

    if (options.orderBy) {
      results.sort((a, b) => {
        const aVal = a[options.orderBy];
        const bVal = b[options.orderBy];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return options.orderDirection === 'desc' ? -comparison : comparison;
      });
    }

    if (options.offset) results = results.slice(options.offset);
    if (options.limit) results = results.slice(0, options.limit);

    return results;
  }

  async findOne(options = {}) {
    const results = await this.find({ ...options, limit: 1 });
    return results[0] ?? null;
  }

  async insert(data) {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.data.set(id, data);
    return id;
  }

  async update(key, data) {
    const existing = this.data.get(key);
    if (!existing) return false;
    this.data.set(key, { ...existing, ...data });
    return true;
  }

  async count(options = {}) {
    const results = await this.find(options);
    return results.length;
  }
}

module.exports = { memory };