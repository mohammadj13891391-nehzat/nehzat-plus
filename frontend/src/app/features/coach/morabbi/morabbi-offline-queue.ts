import type { CreateLessonPlanPayload, CreateReportPayload } from './morabbi.models';

const DB_NAME = 'morabbi_offline';
const DB_VERSION = 2;
const PENDING = 'pending_items';
const META = 'meta';
const LEGACY_STORE = 'report_queue';

export const MAX_OFFLINE_ATTEMPTS = 5;
export const OFFLINE_SYNC_INTERVAL_MS = 60 * 1000;

export type OfflineKind = 'report' | 'lesson_plan';

export interface PendingOfflineItem {
  localId: string;
  kind: OfflineKind;
  data: CreateReportPayload | CreateLessonPlanPayload;
  status: 'pending' | 'failed';
  attempts: number;
  lastError: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface OfflineQueueExport {
  version: 'morabbi-offline-v2';
  exportedAt: number;
  items: PendingOfflineItem[];
}

export class OfflineSyncAbortedError extends Error {}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      const upgradeTx = req.transaction!;
      if (!db.objectStoreNames.contains(PENDING)) {
        const store = db.createObjectStore(PENDING, { keyPath: 'localId' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        if (db.objectStoreNames.contains(LEGACY_STORE)) {
          const legacy = upgradeTx.objectStore(LEGACY_STORE);
          const legacyReq = legacy.getAll();
          legacyReq.onsuccess = () => {
            const oldItems = (legacyReq.result as Array<{ id: string; payload: CreateReportPayload }> | undefined) ?? [];
            for (const old of oldItems) {
              store.put({
                localId: old.id,
                kind: 'report',
                data: old.payload,
                status: 'pending',
                attempts: 0,
                lastError: null,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
            }
          };
          db.deleteObjectStore(LEGACY_STORE);
        }
      }
      if (!db.objectStoreNames.contains(META)) {
        db.createObjectStore(META, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

function run<T>(storeName: string, mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const req = fn(tx.objectStore(storeName));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      })
  );
}

function newLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function enqueueOfflineItem(kind: OfflineKind, data: CreateReportPayload | CreateLessonPlanPayload): Promise<string> {
  const localId = newLocalId();
  const now = Date.now();
  await run(PENDING, 'readwrite', (s) =>
    s.add({ localId, kind, data, status: 'pending', attempts: 0, lastError: null, createdAt: now, updatedAt: now })
  );
  return localId;
}

export async function enqueueOfflineReport(payload: CreateReportPayload): Promise<string> {
  return enqueueOfflineItem('report', payload);
}

export async function enqueueOfflineLessonPlan(payload: CreateLessonPlanPayload): Promise<string> {
  return enqueueOfflineItem('lesson_plan', payload);
}

export async function pendingOfflineCount(): Promise<number> {
  return run(PENDING, 'readonly', (s) => s.index('status').count('pending'));
}

export async function failedOfflineCount(): Promise<number> {
  return run(PENDING, 'readonly', (s) => s.index('status').count('failed'));
}

export async function getOfflineQueueItems(): Promise<PendingOfflineItem[]> {
  const items = await run(PENDING, 'readonly', (s) => s.getAll() as IDBRequest<PendingOfflineItem[]>);
  return ((items as PendingOfflineItem[] | undefined) ?? []).sort((a, b) => a.createdAt - b.createdAt);
}

export async function drainOfflineQueue(send: (item: PendingOfflineItem) => Promise<unknown>): Promise<{ sent: number; failed: number }> {
  const items = await getOfflineQueueItems();
  let sent = 0;
  let failed = 0;
  for (const item of items) {
    if (item.status === 'failed' && item.attempts >= MAX_OFFLINE_ATTEMPTS) {
      failed++;
      continue;
    }
    try {
      await send(item);
      await run(PENDING, 'readwrite', (s) => s.delete(item.localId) as IDBRequest<undefined>);
      sent++;
    } catch (err) {
      if (err instanceof OfflineSyncAbortedError) break;
      const message = err instanceof Error ? err.message : String(err);
      await run(PENDING, 'readwrite', (s) =>
        s.put({ ...item, status: 'failed', attempts: item.attempts + 1, lastError: message, updatedAt: Date.now() })
      );
      failed++;
    }
  }
  return { sent, failed };
}

export async function retryOfflineItem(localId: string): Promise<void> {
  const existing = await run<PendingOfflineItem | undefined>(
    PENDING,
    'readonly',
    (s) => s.get(localId) as IDBRequest<PendingOfflineItem | undefined>
  );
  if (!existing) return;
  await run(PENDING, 'readwrite', (s) => s.put({ ...existing, status: 'pending', attempts: 0, lastError: null, updatedAt: Date.now() }));
}

export async function removeOfflineItem(localId: string): Promise<void> {
  await run(PENDING, 'readwrite', (s) => s.delete(localId) as IDBRequest<undefined>);
}

export async function clearFailedOfflineItems(): Promise<void> {
  const keys = await run(PENDING, 'readonly', (s) => s.index('status').getAllKeys('failed'));
  if (!(keys as IDBValidKey[] | undefined)?.length) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PENDING, 'readwrite');
    const store = tx.objectStore(PENDING);
    for (const key of (keys as IDBValidKey[]) ?? []) store.delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineMeta<T>(key: string): Promise<T | null> {
  const row = await run<{ key: string; value: T } | undefined>(META, 'readonly', (s) => s.get(key) as IDBRequest<{ key: string; value: T } | undefined>);
  return row ? (row.value as T) : null;
}

export async function setOfflineMeta(key: string, value: unknown): Promise<void> {
  await run(META, 'readwrite', (s) => s.put({ key, value }));
}

export async function exportOfflineQueue(): Promise<OfflineQueueExport> {
  const items = await getOfflineQueueItems();
  return { version: 'morabbi-offline-v2', exportedAt: Date.now(), items };
}

export async function importOfflineQueue(exported: OfflineQueueExport | null | undefined): Promise<number> {
  const incoming = (exported?.items ?? []).filter(
    (i) => !!i && !!i.localId && (i.kind === 'report' || i.kind === 'lesson_plan')
  );
  if (!incoming.length) return 0;
  const existing = await getOfflineQueueItems();
  const seen = new Set(existing.map((i) => i.localId));
  const fresh = incoming.filter((i) => !seen.has(i.localId));
  if (!fresh.length) return 0;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PENDING, 'readwrite');
    const store = tx.objectStore(PENDING);
    for (const item of fresh) {
      store.put({ ...item, updatedAt: Date.now() });
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return fresh.length;
}
