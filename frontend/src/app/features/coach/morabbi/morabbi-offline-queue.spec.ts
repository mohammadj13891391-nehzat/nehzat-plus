import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateLessonPlanPayload, CreateReportPayload } from './morabbi.models';

const REPORT = { subject: 'آزمایش', content: 'متن', status: 'SUBMITTED' } as unknown as CreateReportPayload;
const PLAN = { title: 'طرح آزمایش', subject: 'آزمایش', status: 'SUBMITTED' } as unknown as CreateLessonPlanPayload;

class FakeRequest<T> {
  result: T | undefined;
  error: unknown = null;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;
  onupgradeneeded: (() => void) | null = null;
  transaction: FakeTx | null = null;

  succeed(value: T): void {
    this.result = value;
    this.onsuccess?.();
  }

  fail(err: unknown): void {
    this.error = err;
    this.onerror?.();
  }
}

interface StoreEntry {
  keyPath: string;
  indexes: Map<string, string>;
  values: Map<unknown, unknown>;
}

class FakeTx {
  oncomplete: (() => void) | null = null;
  onerror: (() => void) | null = null;
  error: unknown = null;
  private pending = 0;
  private settled = false;

  constructor(private db: FakeDB | null = null) {}

  objectStore(name: string): FakeStore {
    if (this.db) return this.db.store(name);
    return new FakeStore({ keyPath: '', indexes: new Map<string, string>(), values: new Map() }, this);
  }

  track(): void {
    this.pending++;
    queueMicrotask(() => {
      this.pending--;
      if (this.pending === 0 && !this.settled) {
        this.settled = true;
        this.oncomplete?.();
      }
    });
  }

  later(fn: () => void): void {
    this.track();
    queueMicrotask(fn);
  }
}

class FakeStore {
  private get values(): Map<unknown, unknown> {
    return this.entry.values;
  }

  constructor(private entry: StoreEntry, private tx: FakeTx) {}

  createIndex(indexName: string, keyPath: string): this {
    this.entry.indexes.set(indexName, keyPath);
    return this;
  }

  private keyOf(value: unknown): unknown {
    return (value as Record<string, unknown>)[this.entry.keyPath];
  }

  add(value: unknown): FakeRequest<unknown> {
    const req = new FakeRequest<unknown>();
    this.tx.later(() => {
      if (this.values.has(this.keyOf(value))) req.fail(new Error('ConstraintError'));
      else {
        this.values.set(this.keyOf(value), value);
        req.succeed(this.keyOf(value));
      }
    });
    return req;
  }

  put(value: unknown): FakeRequest<unknown> {
    const req = new FakeRequest<unknown>();
    this.tx.later(() => {
      this.values.set(this.keyOf(value), value);
      req.succeed(this.keyOf(value));
    });
    return req;
  }

  get(key: unknown): FakeRequest<unknown> {
    const req = new FakeRequest<unknown>();
    this.tx.later(() => req.succeed(this.values.get(key)));
    return req;
  }

  delete(key: unknown): FakeRequest<undefined> {
    const req = new FakeRequest<undefined>();
    this.tx.later(() => {
      this.values.delete(key);
      req.succeed(undefined);
    });
    return req;
  }

  getAll(): FakeRequest<unknown[]> {
    const req = new FakeRequest<unknown[]>();
    this.tx.later(() => req.succeed([...this.values.values()]));
    return req;
  }

  index(indexName: string): { count: (v: unknown) => FakeRequest<number>; getAllKeys: (v: unknown) => FakeRequest<unknown[]> } {
    const keyPath = this.entry.indexes.get(indexName) ?? '';
    const match = (value: unknown) => (value as Record<string, unknown>)[keyPath];
    return {
      count: (v) => {
        const req = new FakeRequest<number>();
        this.tx.later(() => req.succeed([...this.values.values()].filter((item) => match(item) === v).length));
        return req;
      },
      getAllKeys: (v) => {
        const req = new FakeRequest<unknown[]>();
        this.tx.later(() => req.succeed([...this.values.values()].filter((item) => match(item) === v).map((item) => this.keyOf(item))));
        return req;
      }
    };
  }
}

class FakeDB {
  version = 0;
  stores = new Map<string, StoreEntry>();
  lastTx: FakeTx | null = null;

  objectStoreNames = {
    contains: (name: string) => this.stores.has(name)
  };

  createObjectStore(name: string, options: { keyPath: string }): FakeStore {
    const entry: StoreEntry = { keyPath: options.keyPath, indexes: new Map<string, string>(), values: new Map() };
    this.stores.set(name, entry);
    return new FakeStore(entry, this.lastTx ?? new FakeTx());
  }

  deleteObjectStore(name: string): void {
    this.stores.delete(name);
  }

  transaction(): FakeTx {
    const tx = new FakeTx(this);
    this.lastTx = tx;
    return tx;
  }

  store(name: string): FakeStore {
    const entry = this.stores.get(name)!;
    return new FakeStore(entry, this.lastTx ?? new FakeTx(this));
  }

  seedLegacyReport(name: string, payload: unknown): void {
    this.version = 1;
    const legacy: StoreEntry = { keyPath: 'id', indexes: new Map<string, string>(), values: new Map() };
    legacy.values.set('legacy-1', { id: 'legacy-1', payload });
    this.stores.set(name, legacy);
  }
}

class FakeIndexedDB {
  dbs = new Map<string, FakeDB>();

  open(name: string, version: number): FakeRequest<FakeDB> {
    const req = new FakeRequest<FakeDB>();
    const db = this.dbs.get(name) ?? new FakeDB();
    this.dbs.set(name, db);
    queueMicrotask(() => {
      req.result = db;
      if (version > db.version) {
        const tx = new FakeTx(db);
        db.lastTx = tx;
        req.transaction = tx;
        req.onupgradeneeded?.();
      }
      db.version = Math.max(db.version, version);
      req.onsuccess?.();
    });
    return req;
  }
}

let queue: typeof import('./morabbi-offline-queue');

beforeEach(async () => {
  vi.resetModules();
  (globalThis as Record<string, unknown>).indexedDB = new FakeIndexedDB();
  queue = await import('./morabbi-offline-queue');
});

describe('morabbi-offline-queue', () => {
  it('enqueue report + lesson plan and count pending', async () => {
    await queue.enqueueOfflineReport(REPORT);
    await queue.enqueueOfflineLessonPlan(PLAN);
    expect(await queue.pendingOfflineCount()).toBe(2);
    const items = await queue.getOfflineQueueItems();
    expect(items.map((i) => i.kind)).toEqual(['report', 'lesson_plan']);
    expect(items[0].attempts).toBe(0);
    expect(items[0].lastError).toBeNull();
  });

  it('drain deletes items that send successfully', async () => {
    await queue.enqueueOfflineReport(REPORT);
    const seen: string[] = [];
    const result = await queue.drainOfflineQueue(async (item) => {
      seen.push(item.kind);
    });
    expect(result).toEqual({ sent: 1, failed: 0 });
    expect(seen).toEqual(['report']);
    expect(await queue.pendingOfflineCount()).toBe(0);
  });

  it('marks failures with attempts + lastError and stops after MAX attempts', async () => {
    await queue.enqueueOfflineReport(REPORT);
    const boom = () => Promise.reject(new Error('net down'));
    for (let i = 0; i < queue.MAX_OFFLINE_ATTEMPTS; i++) {
      const result = await queue.drainOfflineQueue(boom);
      expect(result.failed).toBe(1);
    }
    const [item] = await queue.getOfflineQueueItems();
    expect(item.status).toBe('failed');
    expect(item.attempts).toBe(queue.MAX_OFFLINE_ATTEMPTS);
    expect(item.lastError).toBe('net down');
    const skipped = await queue.drainOfflineQueue(boom);
    expect(skipped).toEqual({ sent: 0, failed: 1 });
    await queue.retryOfflineItem(item.localId);
    const [reset] = await queue.getOfflineQueueItems();
    expect(reset.status).toBe('pending');
    expect(reset.attempts).toBe(0);
    expect(reset.lastError).toBeNull();
  });

  it('OfflineSyncAbortedError halts the drain without touching other items', async () => {
    await queue.enqueueOfflineReport(REPORT);
    await queue.enqueueOfflineLessonPlan(PLAN);
    let calls = 0;
    const result = await queue.drainOfflineQueue(async () => {
      calls++;
      throw new queue.OfflineSyncAbortedError('session lost');
    });
    expect(calls).toBe(1);
    expect(result).toEqual({ sent: 0, failed: 0 });
    expect(await queue.pendingOfflineCount()).toBe(2);
  });

  it('get/set meta roundtrip', async () => {
    await queue.setOfflineMeta('lastSyncAt', 1234);
    expect(await queue.getOfflineMeta<number>('lastSyncAt')).toBe(1234);
    expect(await queue.getOfflineMeta<string>('missing')).toBeNull();
  });

  it('export/import roundtrip with dedupe', async () => {
    await queue.enqueueOfflineReport(REPORT);
    const exported = await queue.exportOfflineQueue();
    expect(exported.items).toHaveLength(1);

    vi.resetModules();
    const freshDb = new FakeIndexedDB();
    (globalThis as Record<string, unknown>).indexedDB = freshDb;
    queue = await import('./morabbi-offline-queue');
    expect(await queue.pendingOfflineCount()).toBe(0);

    expect(await queue.importOfflineQueue(exported)).toBe(1);
    expect(await queue.importOfflineQueue(exported)).toBe(0);
    expect(await queue.pendingOfflineCount()).toBe(1);
    expect(await queue.importOfflineQueue(null)).toBe(0);
  });

  it('clears failed items only', async () => {
    await queue.enqueueOfflineReport(REPORT);
    await queue.enqueueOfflineLessonPlan(PLAN);
    await queue.drainOfflineQueue(async (item) => {
      if (item.kind === 'report') throw new Error('bad report');
    });
    expect(await queue.failedOfflineCount()).toBe(1);
    await queue.clearFailedOfflineItems();
    expect(await queue.failedOfflineCount()).toBe(0);
    expect(await queue.getOfflineQueueItems()).toHaveLength(0);
  });

  it('migrates legacy report_queue rows into pending_items', async () => {
    const fake = (globalThis as Record<string, unknown>).indexedDB as FakeIndexedDB;
    const db = new FakeDB();
    db.seedLegacyReport('report_queue', REPORT);
    fake.dbs.set('morabbi_offline', db);

    await queue.enqueueOfflineReport(REPORT);
    const items = await queue.getOfflineQueueItems();
    expect(items).toHaveLength(2);
    const legacy = items.find((i) => i.localId === 'legacy-1');
    expect(legacy?.kind).toBe('report');
    expect(legacy?.data).toBe(REPORT);
  });

  it('removeOfflineItem deletes a single item', async () => {
    const localId = await queue.enqueueOfflineReport(REPORT);
    await queue.removeOfflineItem(localId);
    expect(await queue.pendingOfflineCount()).toBe(0);
  });
});
