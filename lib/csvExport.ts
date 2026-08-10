import type { TitikAset } from "./types";

const KOLOM_CSV: { key: keyof TitikAset; label: string }[] = [
  { key: "kode_unik", label: "Kode Unik" },
  { key: "nama_penyulang", label: "Nama Penyulang" },
  { key: "nama_aset", label: "Nama Aset" },
  { key: "section", label: "Section" },
  { key: "konstruksi", label: "Konstruksi" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "tanggal_inspeksi", label: "Tanggal Inspeksi" },
  { key: "health_index", label: "Health Index" },
  { key: "jumlah_baik", label: "Jumlah Baik" },
  { key: "jumlah_buruk", label: "Jumlah Buruk" },
  { key: "keterangan", label: "Keterangan" },
  { key: "status", label: "Status" },
];

function escapeCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buatCsvTitikSudahDirabas(titik: TitikAset[]): string {
  const sudah = titik.filter((t) => t.status === "sudah");
  const header = KOLOM_CSV.map((k) => k.label).join(",");
  const baris = sudah.map((t) =>
    KOLOM_CSV.map((k) => escapeCsvValue(t[k.key])).join(","),
  );
  return [header, ...baris].join("\n");
}

export function unduhCsvTitikSudahDirabas(titik: TitikAset[]) {
  const csv = buatCsvTitikSudahDirabas(titik);
  const bom = "\uFEFF"; // biar Excel baca karakter UTF-8 (misal ke") dengan benar
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const tanggal = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `titik-rabas-sudah-${tanggal}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}