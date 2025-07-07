const { promises: fs } = require('fs');
const { dirname } = require('path');

class json {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = new Map();
    this.initialized = false;
  }

  async ensureInitialized() {
    if (this.initialized) return;
    
    try {
      await fs.mkdir(dirname(this.filePath), { recursive: true });
      const content = await fs.readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(content);
      this.data = new Map(Object.entries(parsed));
    } catch {
      this.data = new Map();
    }
    
    this.initialized = true;
  }

  async persist() {
    const obj = Object.fromEntries(this.data);
    await fs.writeFile(this.filePath, JSON.stringify(obj, null, 2));
  }

  async get(key) {
    await this.ensureInitialized();
    return this.data.get(key) ?? null;
  }

  async set(key, value) {
    await this.ensureInitialized();
    this.data.set(key, value);
    await this.persist();
  }

  async delete(key) {
    await this.ensureInitialized();
    const existed = this.data.has(key);
    this.data.delete(key);
    if (existed) await this.persist();
    return existed;
  }

  async clear() {
    await this.ensureInitialized();
    this.data.clear();
    await this.persist();
  }

  async keys() {
    await this.ensureInitialized();
    return Array.from(this.data.keys());
  }

  async has(key) {
    await this.ensureInitialized();
    return this.data.has(key);
  }

  async size() {
    await this.ensureInitialized();
    return this.data.size;
  }

  async find(options = {}) {
    await this.ensureInitialized();
    let results = Array.from(this.data.values());

    if (options.where) {
      results = results.filter(item => this.matchesWhere(item, options.where));
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

  matchesWhere(item, where) {
    return Object.entries(where).every(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return this.matchesOperator(item[key], value);
      }
      return item[key] === value;
    });
  }

  matchesOperator(value, operator) {
    if (operator.$gt !== undefined) return value > operator.$gt;
    if (operator.$gte !== undefined) return value >= operator.$gte;
    if (operator.$lt !== undefined) return value < operator.$lt;
    if (operator.$lte !== undefined) return value <= operator.$lte;
    if (operator.$ne !== undefined) return value !== operator.$ne;
    if (operator.$in !== undefined) return operator.$in.includes(value);
    if (operator.$nin !== undefined) return !operator.$nin.includes(value);
    return value === operator;
  }

  async findOne(options = {}) {
    const results = await this.find({ ...options, limit: 1 });
    return results[0] ?? null;
  }

  async insert(data) {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.set(id, data);
    return id;
  }

  async update(key, data) {
    const existing = await this.get(key);
    if (!existing) return false;
    await this.set(key, { ...existing, ...data });
    return true;
  }

  async count(options = {}) {
    const results = await this.find(options);
    return results.length;
  }
}

module.exports = { json };