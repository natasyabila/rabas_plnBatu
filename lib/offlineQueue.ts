import type { StatusRabas } from "./types";

export interface PendingChange {
  id: string;
  kode_unik: string;
  status: StatusRabas;
  timestamp: number;
}

const QUEUE_KEY = "rabas_pending_queue";

export function getQueue(): PendingChange[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToQueue(change: { kode_unik: string; status: StatusRabas }) {
  const queue = getQueue();
  // Kalau titik yang sama sudah ada di antrian, timpa aja pakai yang terbaru
  const filtered = queue.filter((c) => c.kode_unik !== change.kode_unik);
  const baru: PendingChange = {
    ...change,
    id: `${change.kode_unik}-${Date.now()}`,
    timestamp: Date.now(),
  };
  const updated = [...filtered, baru];
  localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromQueue(id: string) {
  const queue = getQueue().filter((c) => c.id !== id);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  return queue;
}