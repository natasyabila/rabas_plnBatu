import Link from "next/link";
import type { RingkasanPenyulang } from "@/lib/types";

export default function PenyulangCard({ data }: { data: RingkasanPenyulang }) {
  const pct = data.total === 0 ? 0 : Math.round((data.sudah / data.total) * 100);

  return (
    <Link
      href={`/penyulang/${data.slug}`}
      style={{
        display: "block",
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        transition: "border-color 0.15s ease, transform 0.15s ease",
      }}
      className="penyulang-card"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            textTransform: "uppercase",
          }}
        >
          Penyulang
        </span>
        <span
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--accent)",
            background: "var(--accent-bg)",
            padding: "2px 8px",
            borderRadius: 20,
          }}
        >
          {pct}%
        </span>
      </div>

      <h2 style={{ fontSize: 20, marginBottom: 18 }}>{data.nama}</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            Belum dirabas
          </p>
          <p className="mono" style={{ fontSize: 24, fontWeight: 500, color: "var(--danger)" }}>
            {data.belum}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
            Sudah dirabas
          </p>
          <p className="mono" style={{ fontSize: 24, fontWeight: 500, color: "var(--success)" }}>
            {data.sudah}
          </p>
        </div>
      </div>

      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: "var(--danger-bg)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "var(--success)",
            borderRadius: 3,
          }}
        />
      </div>
    </Link>
  );
}
