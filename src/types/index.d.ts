export interface StorageAdapter {
  get<T = any>(key: string): Promise<T | null>;
  set<T = any>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
}

export interface QueryOptions {
  where?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface CollectionAdapter extends StorageAdapter {
  find<T = any>(options?: QueryOptions): Promise<T[]>;
  findOne<T = any>(options?: QueryOptions): Promise<T | null>;
  insert<T = any>(data: T): Promise<string>;
  update<T = any>(key: string, data: Partial<T>): Promise<boolean>;
  count(options?: QueryOptions): Promise<number>;
}

export type StorageType = 'json' | 'sqlite' | 'memory';

export interface StorageConfig {
  type: StorageType;
  path?: string;
  collection?: string;
}

export class LocalDB {
  constructor(config: StorageConfig);
  
  get<T = any>(key: string): Promise<T | null>;
  set<T = any>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
  
  find<T = any>(options?: QueryOptions): Promise<T[]>;
  findOne<T = any>(options?: QueryOptions): Promise<T | null>;
  insert<T = any>(data: T): Promise<string>;
  update<T = any>(key: string, data: Partial<T>): Promise<boolean>;
  count(options?: QueryOptions): Promise<number>;
  
  insertMany<T = any>(items: T[]): Promise<string[]>;
  close(): void;
}

export class TypedCollection<T> {
  constructor(storage: LocalDB);
  
  get(key: string): Promise<T | null>;
  set(key: string, value: T): Promise<void>;
  find(options?: QueryOptions): Promise<T[]>;
  findOne(options?: QueryOptions): Promise<T | null>;
  insert(data: T): Promise<string>;
  update(key: string, data: Partial<T>): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  count(options?: QueryOptions): Promise<number>;
  insertMany(items: T[]): Promise<string[]>;
}

export function createDB(config: StorageConfig): LocalDB;