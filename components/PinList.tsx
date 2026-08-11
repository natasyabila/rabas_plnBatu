import type { TitikAset, StatusRabas } from "@/lib/types";
import { useAsetStore } from "@/lib/store";

function linkNavigasi(lat: number, lon: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
}

export default function PinList({
  titik,
  status,
}: {
  titik: TitikAset[];
  status: StatusRabas;
}) {
  const tandaiStatus = useAsetStore((s) => s.tandaiStatus);

  if (titik.length === 0) {
    return (
      <div
        style={{
          padding: "32px 16px",
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: 14,
        }}
      >
        {status === "belum"
          ? "Semua titik sudah dirabas."
          : "Belum ada titik yang ditandai selesai."}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxHeight: 480,
        overflowY: "auto",
      }}
    >
      {titik.map((t) => (
        <div
          key={t.kode_unik}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "10px 12px",
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            borderRadius: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              className="mono"
              style={{ fontSize: 13, fontWeight: 500, marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"   }}
            >
              {t.nama_aset}
            </p>
            <p
              style={{
                fontSize: 12,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Sec {t.section} &middot; {t.konstruksi} &middot; {t.keterangan}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <a
              href={linkNavigasi(t.latitude, t.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              title="Navigasi ke lokasi"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--accent-bg)",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              🧭
            </a>
            <button
              onClick={() =>
                tandaiStatus(
                  t.kode_unik,
                  status === "belum" ? "sudah" : "belum",
                )
              }
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${status === "belum" ? "var(--success)" : "var(--border)"}`,
                background:
                  status === "belum" ? "var(--success-bg)" : "transparent",
                color:
                  status === "belum"
                    ? "var(--success)"
                    : "var(--text-secondary)",
              }}
            >
              {status === "belum" ? "Tandai sudah" : "Batalkan"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
