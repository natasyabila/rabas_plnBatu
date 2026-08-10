"use client";

import { create } from "zustand";
import { supabase } from "./supabaseClient";
import type { TitikAset, StatusRabas, RingkasanPenyulang } from "./types";
import { getQueue, addToQueue, removeFromQueue } from "./offlineQueue";

interface AsetState {
  titik: TitikAset[];
  loading: boolean;
  error: string | null;
  sudahInit: boolean;
  pendingCount: number;
  isOnline: boolean;
  init: () => Promise<void>;
  tandaiStatus: (kode_unik: string, status: StatusRabas) => Promise<void>;
  syncPending: () => Promise<void>;
  ringkasanSemuaPenyulang: () => RingkasanPenyulang[];
}

function slugify(nama: string) {
  return nama.toLowerCase().replace(/\s+/g, "-");
}

export const useAsetStore = create<AsetState>((set, get) => ({
  titik: [],
  loading: true,
  error: null,
  sudahInit: false,
  pendingCount: typeof window !== "undefined" ? getQueue().length : 0,
  isOnline: typeof window !== "undefined" ? navigator.onLine : true,

  init: async () => {
    if (get().sudahInit) return;
    set({ sudahInit: true, loading: true, error: null });

    const semuaData: TitikAset[] = [];
    const ukuranHalaman = 1000;
    let halaman = 0;

    try {
      while (true) {
        const dari = halaman * ukuranHalaman;
        const sampai = dari + ukuranHalaman - 1;

        const { data, error } = await supabase
          .from("titik_aset")
          .select("*")
          .order("nama_penyulang", { ascending: true })
          .range(dari, sampai);

        if (error) throw error;
        if (!data || data.length === 0) break;

        semuaData.push(...(data as TitikAset[]));

        if (data.length < ukuranHalaman) break;
        halaman += 1;
      }

      // Terapkan perubahan yang masih menunggu sinkron ke data yang baru
      // dimuat, biar tampilan tetap konsisten walau belum terkirim ke server.
      const queue = getQueue();
      const dataDenganPending = semuaData.map((t) => {
        const pending = queue.find((q) => q.kode_unik === t.kode_unik);
        return pending ? { ...t, status: pending.status } : t;
      });

      set({ titik: dataDenganPending, loading: false, pendingCount: queue.length });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data";
      // Kalau sudah ada data lama tersimpan di state, jangan tampilkan error
      // (kemungkinan cuma sinyal lagi lemah, bukan gagal total)
      set({ loading: false, error: get().titik.length === 0 ? msg : null });
    }

    supabase
      .channel("titik_aset_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "titik_aset" },
        (payload) => {
          const baru = payload.new as TitikAset;
          set((state) => ({
            titik: state.titik.map((t) =>
              t.kode_unik === baru.kode_unik ? { ...t, ...baru } : t,
            ),
          }));
        },
      )
      .subscribe();

    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        set({ isOnline: true });
        get().syncPending();
      });
      window.addEventListener("offline", () => {
        set({ isOnline: false });
      });

      if (navigator.onLine) {
        get().syncPending();
      }
    }
  },

  tandaiStatus: async (kode_unik, status) => {
    const sebelumnya = get().titik;

    set({
      titik: sebelumnya.map((t) =>
        t.kode_unik === kode_unik ? { ...t, status } : t,
      ),
    });

    const online = typeof window !== "undefined" ? navigator.onLine : true;

    if (!online) {
      const queue = addToQueue({ kode_unik, status });
      set({ pendingCount: queue.length });
      return;
    }

    const { error } = await supabase.rpc("tandai_status_titik", {
      p_kode_unik: kode_unik,
      p_status_baru: status,
    });

    if (error) {
      // Gagal walau kelihatannya online (sinyal lemah dll) — masukkan ke
      // antrian juga daripada hilang, jangan rollback tampilan.
      const queue = addToQueue({ kode_unik, status });
      set({ pendingCount: queue.length });
    }
  },

  syncPending: async () => {
    const queue = getQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      const { error } = await supabase.rpc("tandai_status_titik", {
        p_kode_unik: item.kode_unik,
        p_status_baru: item.status,
      });

      if (!error) {
        const sisa = removeFromQueue(item.id);
        set({ pendingCount: sisa.length });
      }
    }
  },

  ringkasanSemuaPenyulang: () => {
    const { titik } = get();
    const map = new Map<string, { belum: number; sudah: number }>();
    for (const t of titik) {
      const cur = map.get(t.nama_penyulang) ?? { belum: 0, sudah: 0 };
      if (t.status === "belum") cur.belum += 1;
      else cur.sudah += 1;
      map.set(t.nama_penyulang, cur);
    }
    return Array.from(map.entries())
      .map(([nama, v]) => ({
        nama,
        slug: slugify(nama),
        belum: v.belum,
        sudah: v.sudah,
        total: v.belum + v.sudah,
      }))
      .sort((a, b) => a.nama.localeCompare(b.nama));
  },
}));

export { slugify };