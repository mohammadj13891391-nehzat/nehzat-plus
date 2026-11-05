import type { CreateReportPayload } from './morabbi.models';

const DB_NAME = 'morabbi_offline';
const STORE = 'report_queue';

export interface QueuedReport {
  id: string;
  payload: CreateReportPayload;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function enqueueOfflineReport(payload: CreateReportPayload): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).add({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        payload
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export async function pendingOfflineReportCount(): Promise<number> {
  const db = await openDb();
  try {
    return await new Promise<number>((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export async function drainOfflineReportQueue(
  send: (payload: CreateReportPayload) => Promise<void>
): Promise<number> {
  const db = await openDb();
  let sent = 0;
  try {
    const items = await new Promise<QueuedReport[]>((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).getAll();
      req.onsuccess = () => resolve((req.result as QueuedReport[]) ?? []);
      req.onerror = () => reject(req.error);
    });

    for (const item of items) {
      try {
        await send(item.payload);
      } catch {
        break;
      }
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(item.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      sent++;
    }
  } finally {
    db.close();
  }
  return sent;
}
