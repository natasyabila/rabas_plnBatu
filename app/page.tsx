"use client";

import { useEffect } from "react";
import { useAsetStore } from "@/lib/store";
import PenyulangCard from "@/components/PenyulangCard";
import FeederLine from "@/components/FeederLine";
import DownloadCsvButton from "@/components/DownloadCsvButton";

export default function DashboardPage() {
  const init = useAsetStore((s) => s.init);
  const loading = useAsetStore((s) => s.loading);
  const error = useAsetStore((s) => s.error);
  const ringkasan = useAsetStore((s) => s.ringkasanSemuaPenyulang());

  useEffect(() => {
    init();
  }, [init]);

  const totalBelum = ringkasan.reduce((a, r) => a + r.belum, 0);
  const totalSudah = ringkasan.reduce((a, r) => a + r.sudah, 0);

  return (
    <main style={{ paddingTop: 32, paddingBottom: 60 }}>
      <FeederLine nodes={ringkasan.length || 9} />

      <header
  style={{
    marginBottom: 28,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  }}
>
  <div>
    <p
      style={{
        fontSize: 12,
        letterSpacing: "0.1em",
        color: "var(--accent)",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      ULP Batu &middot; Inspeksi jaringan
    </p>
    <h1 style={{ fontSize: 28, marginBottom: 10 }}>
      Monitoring rabas jaringan
    </h1>
    <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 560 }}>
      Pantau titik potensi gangguan pohon per penyulang. Klik salah satu
      penyulang untuk melihat lokasi di peta.
    </p>
  </div>

  <DownloadCsvButton />
</header>

      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Total titik belum dirabas
          </p>
          <p className="mono" style={{ fontSize: 30, color: "var(--danger)", fontWeight: 500 }}>
            {totalBelum}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Total titik sudah dirabas
          </p>
          <p className="mono" style={{ fontSize: 30, color: "var(--success)", fontWeight: 500 }}>
            {totalSudah}
          </p>
        </div>
      </div>

      {loading && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Memuat data dari server...
        </p>
      )}

      {error && (
        <p style={{ color: "var(--danger)", fontSize: 14, marginBottom: 16 }}>
          Gagal memuat data: {error}. Cek koneksi & pengaturan Supabase kamu
          di file .env.local.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {ringkasan.map((r) => (
          <PenyulangCard key={r.slug} data={r} />
        ))}
      </div>
    </main>
  );
}
