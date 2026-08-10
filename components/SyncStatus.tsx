"use client";

import { useAsetStore } from "@/lib/store";

export default function SyncStatus() {
  const isOnline = useAsetStore((s) => s.isOnline);
  const pendingCount = useAsetStore((s) => s.pendingCount);

  if (isOnline && pendingCount === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 999,
        background: isOnline ? "var(--panel)" : "var(--danger)",
        border: "1px solid var(--border)",
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: isOnline ? "var(--success)" : "#fff",
          flexShrink: 0,
        }}
      />
      {!isOnline
        ? "Offline — perubahan disimpan di HP"
        : `Menyinkronkan ${pendingCount} data...`}
    </div>
  );
}