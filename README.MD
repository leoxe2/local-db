# local-db-better

A simple, better local database abstraction for Node.js with multiple backends - JSON file, SQLite, and in-memory storage.

## Features

- **Multiple Backends**: JSON file, SQLite, and in-memory storage
- **Query Interface**: MongoDB-style queries without writing SQL
- **JavaScript First**: Pure JavaScript with TypeScript support
- **Production Ready**: Proper error handling and performance optimizations
- **Minimal Dependencies**: Only SQLite when using that backend

## Installation

```bash
npm install local-db-better
```

For SQLite support:
```bash
npm install better-sqlite3
```

## Quick Start

```javascript
const { createDB } = require('local-db');

// JSON file storage
const db = createDB({
  type: 'json',
  path: './data/storage.json'
});

// Basic operations
await db.set('user:1', { name: 'John', age: 30 });
const user = await db.get('user:1');

// Query operations
const users = await db.find({
  where: { age: { $gte: 18 } },
  orderBy: 'name',
  limit: 10
});
```

## Storage Types

### JSON File Storage
```javascript
const db = createDB({
  type: 'json',
  path: './data/users.json'
});
```

### SQLite Storage
```javascript
const db = createDB({
  type: 'sqlite',
  path: './data/users.db',
  collection: 'users' // optional table name
});
```

### Memory Storage
```javascript
const db = createDB({
  type: 'memory'
});
```

## API Reference

### Basic Operations

```javascript
// Get/Set
await db.set('key', value);
const value = await db.get('key');

// Delete
await db.delete('key');
await db.clear();

// Info
await db.has('key');
await db.size();
await db.keys();
```

### Collection Operations

```javascript
// Insert
const id = await db.insert({ name: 'John', age: 30 });

// Find
const users = await db.find({
  where: { age: { $gte: 18 } },
  orderBy: 'name',
  orderDirection: 'desc',
  limit: 10,
  offset: 0
});

// Update
await db.update(id, { age: 31 });

// Count
const count = await db.count({ where: { age: { $gte: 18 } } });
```

### Query Operators

```typescript
// Comparison operators
{ age: { $gt: 18 } }        // greater than
{ age: { $gte: 18 } }       // greater than or equal
{ age: { $lt: 65 } }        // less than
{ age: { $lte: 65 } }       // less than or equal
{ age: { $ne: 30 } }        // not equal
{ status: { $in: ['active', 'pending'] } }    // in array
{ status: { $nin: ['deleted'] } }             // not in array
```

### Type-Safe Collections (TypeScript)

```javascript
const { TypedCollection } = require('local-db');

// For TypeScript users
const users = new TypedCollection(db);

// Type-safe operations
const id = await users.insert({ name: 'John', age: 30, email: 'john@example.com' });
const user = await users.get(id);
const activeUsers = await users.find({ where: { age: { $gte: 18 } } });
```

### Batch Operations

```javascript
// Insert multiple
const ids = await db.insertMany([
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]);
```

## Examples

### User Management
```javascript
const users = createDB({
  type: 'sqlite',
  path: './users.db'
});

// Create user
const userId = await users.insert({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  status: 'active'
});

// Find active users
const activeUsers = await users.find({
  where: { status: 'active' },
  orderBy: 'name'
});

// Update user
await users.update(userId, { age: 31 });
```

### Configuration Storage
```javascript
const config = createDB({
  type: 'json',
  path: './config.json'
});

await config.set('database.host', 'localhost');
await config.set('database.port', 5432);
await config.set('features.darkMode', true);

const dbHost = await config.get('database.host');
```

### Cache Implementation
```javascript
const cache = createDB({
  type: 'memory'
});

// Cache with TTL simulation
await cache.set('user:123', { 
  data: userData, 
  expires: Date.now() + 3600000 
});

const cached = await cache.get('user:123');
if (cached && cached.expires > Date.now()) {
  return cached.data;
}
```

## TypeScript Support

Local-DB is written in JavaScript but includes TypeScript definitions. You can use it in TypeScript projects:

```typescript
import { createDB, TypedCollection } from 'local-db';

interface User {
  name: string;
  age: number;
  email: string;
}

const db = createDB({
  type: 'json',
  path: './users.json'
});

const users = new TypedCollection<User>(db);
const id = await users.insert({ name: 'John', age: 30, email: 'john@example.com' });
```

## Error Handling

The library handles errors gracefully:

```javascript
try {
  const db = createDB({
    type: 'json',
    path: './data/storage.json'
  });
  
  await db.set('key', 'value');
} catch (error) {
  console.error('Database error:', error.message);
} createStorage({
  type: 'sqlite',
  path: './users.db'
});

// Create user
const userId = await users.insert({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  status: 'active'
});

// Find active users
const activeUsers = await users.find({
  where: { status: 'active' },
  orderBy: 'name'
});

// Update user
await users.update(userId, { age: 31 });
```

### Configuration Storage
```typescript
const config = createStorage({
  type: 'json',
  path: './config.json'
});

await config.set('database.host', 'localhost');
await config.set('database.port', 5432);
await config.set('features.darkMode', true);

const dbHost = await config.get('database.host');
```

### Cache Implementation
```typescript
const cache = createStorage({
  type: 'memory'
});

// Cache with TTL simulation
await cache.set('user:123', { 
  data: userData, 
  expires: Date.now() + 3600000 
});

const cached = await cache.get('user:123');
if (cached && cached.expires > Date.now()) {
  return cached.data;
}
```

## Error Handling

The library handles errors gracefully:

```typescript
try {
  const storage = createStorage({
    type: 'json',
    path: './data/storage.json'
  });
  
  await storage.set('key', 'value');
} catch (error) {
  console.error('Storage error:', error.message);
}
```

## Performance Considerations

- **JSON**: Good for small to medium datasets (< 10MB)
- **SQLite**: Excellent for large datasets with complex queries
- **Memory**: Fastest, but data is lost on restart

## License

MIT