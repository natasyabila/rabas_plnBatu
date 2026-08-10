"use client";

import { useAsetStore } from "@/lib/store";
import { unduhCsvTitikSudahDirabas } from "@/lib/csvExport";

export default function DownloadCsvButton() {
  const titik = useAsetStore((s) => s.titik);
  const totalSudah = titik.filter((t) => t.status === "sudah").length;

  return (
    <button
      onClick={() => unduhCsvTitikSudahDirabas(titik)}
      disabled={totalSudah === 0}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 16px",
        borderRadius: 8,
        border: "1px solid var(--accent)",
        background: "transparent",
        color: "var(--accent)",
        fontSize: 13,
        fontWeight: 500,
        cursor: totalSudah === 0 ? "not-allowed" : "pointer",
        opacity: totalSudah === 0 ? 0.5 : 1,
        whiteSpace: "nowrap",
      }}
      title={
        totalSudah === 0
          ? "Belum ada titik yang sudah dirabas"
          : `Unduh ${totalSudah} data CSV`
      }
    >
      ⬇ Unduh CSV ({totalSudah})
    </button>
  );
}