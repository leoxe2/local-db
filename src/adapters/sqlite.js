const Database = require('better-sqlite3');

class sqlite {
  constructor(dbPath, tableName = 'storage') {
    this.db = new Database(dbPath);
    this.tableName = tableName;
    this.initialize();
  }

  initialize() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      )
    `);
  }

  async get(key) {
    const stmt = this.db.prepare(`SELECT value FROM ${this.tableName} WHERE key = ?`);
    const row = stmt.get(key);
    return row ? JSON.parse(row.value) : null;
  }

  async set(key, value) {
    const stmt = this.db.prepare(`INSERT OR REPLACE INTO ${this.tableName} (key, value) VALUES (?, ?)`);
    stmt.run(key, JSON.stringify(value));
  }

  async delete(key) {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE key = ?`);
    return stmt.run(key).changes > 0;
  }

  async clear() {
    this.db.prepare(`DELETE FROM ${this.tableName}`).run();
  }

  async keys() {
    const stmt = this.db.prepare(`SELECT key FROM ${this.tableName}`);
    const rows = stmt.all();
    return rows.map(row => row.key);
  }

  async has(key) {
    const stmt = this.db.prepare(`SELECT 1 FROM ${this.tableName} WHERE key = ? LIMIT 1`);
    return stmt.get(key) !== undefined;
  }

  async size() {
    const stmt = this.db.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    const row = stmt.get();
    return row.count;
  }

  async find(options = {}) {
    let sql = `SELECT value FROM ${this.tableName}`;
    const params = [];

    if (options.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value);
        return `json_extract(value, '$.${key}') = ?`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    if (options.orderBy) {
      sql += ` ORDER BY json_extract(value, '$.${options.orderBy}') ${options.orderDirection || 'asc'}`;
    }

    if (options.limit) sql += ` LIMIT ${options.limit}`;
    if (options.offset) sql += ` OFFSET ${options.offset}`;

    const stmt = this.db.prepare(sql);
    const rows = stmt.all(params);
    return rows.map(row => JSON.parse(row.value));
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
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const params = [];

    if (options.where) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value);
        return `json_extract(value, '$.${key}') = ?`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    const stmt = this.db.prepare(sql);
    const row = stmt.get(params);
    return row.count;
  }

  close() {
    this.db.close();
  }
}

module.exports = { sqlite };