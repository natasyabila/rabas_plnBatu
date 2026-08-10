export type StatusRabas = "belum" | "sudah";

export interface TitikAset {
  kode_unik: string;
  nama_penyulang: string;
  nama_aset: string;
  section: number;
  konstruksi: string;
  latitude: number;
  longitude: number;
  tanggal_inspeksi: string;
  health_index: "baik" | "cukup" | "kurang" | string;
  jumlah_baik: number;
  jumlah_buruk: number;
  keterangan: string;
  status: StatusRabas;
}

export interface RingkasanPenyulang {
  nama: string;
  slug: string;
  belum: number;
  sudah: number;
  total: number;
}
