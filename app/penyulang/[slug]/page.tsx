"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAsetStore, slugify } from "@/lib/store";
import PinList from "@/components/PinList";
import type { StatusRabas } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 480,
        borderRadius: 16,
        background: "var(--panel)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: 14,
      }}
    >
      Memuat peta...
    </div>
  ),
});

export default function DetailPenyulangPage({
  params,
}: {
  params: { slug: string };
}) {
  const [status, setStatus] = useState<StatusRabas>("belum");
  const init = useAsetStore((s) => s.init);
  const loading = useAsetStore((s) => s.loading);
  const semuaTitik = useAsetStore((s) => s.titik);

  useEffect(() => {
    init();
  }, [init]);

  const namaPenyulang = useMemo(() => {
    const match = semuaTitik.find((t) => slugify(t.nama_penyulang) === params.slug);
    return match?.nama_penyulang ?? null;
  }, [semuaTitik, params.slug]);

  const titikFiltered = useMemo(() => {
    if (!namaPenyulang) return [];
    return semuaTitik.filter(
      (t) => t.nama_penyulang === namaPenyulang && t.status === status
    );
  }, [semuaTitik, namaPenyulang, status]);

  const jumlahBelum = useMemo(
    () =>
      semuaTitik.filter((t) => t.nama_penyulang === namaPenyulang && t.status === "belum")
        .length,
    [semuaTitik, namaPenyulang]
  );
  const jumlahSudah = useMemo(
    () =>
      semuaTitik.filter((t) => t.nama_penyulang === namaPenyulang && t.status === "sudah")
        .length,
    [semuaTitik, namaPenyulang]
  );

  if (loading) {
    return (
      <main style={{ paddingTop: 32 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Memuat data dari server...
        </p>
      </main>
    );
  }

  if (!namaPenyulang) {
    return (
      <main style={{ paddingTop: 32 }}>
        <p style={{ color: "var(--text-secondary)", marginBottom: 12 }}>
          Penyulang tidak ditemukan.
        </p>
        <Link href="/" style={{ color: "var(--accent)" }}>
          &larr; Kembali ke dashboard
        </Link>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: 32, paddingBottom: 60 }}>
      <Link
  href="/"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
    padding: "12px 20px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--panel)",
    color: "var(--text-primary, #fff)",
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = "var(--accent)";
    e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 12%, var(--panel))";
    e.currentTarget.style.transform = "translateX(-2px)";
    const arrow = e.currentTarget.querySelector("span");
    if (arrow) arrow.style.transform = "translateX(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.background = "var(--panel)";
    e.currentTarget.style.transform = "translateX(0)";
    const arrow = e.currentTarget.querySelector("span");
    if (arrow) arrow.style.transform = "translateX(0)";
  }}
>
  <span
    style={{
      fontSize: 20,
      lineHeight: 1,
      transition: "transform 0.2s ease",
      color: "var(--accent)",
    }}
  >
    &larr;
  </span>
  Semua penyulang
</Link>

      <h1 style={{ fontSize: 26, marginBottom: 20 }}>Penyulang {namaPenyulang}</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          className={`status-pill ${status === "belum" ? "aktif-belum" : ""}`}
          onClick={() => setStatus("belum")}
        >
          Belum dirabas
          <span className="mono">{jumlahBelum}</span>
        </button>
        <button
          className={`status-pill ${status === "sudah" ? "aktif-sudah" : ""}`}
          onClick={() => setStatus("sudah")}
        >
          Sudah dirabas
          <span className="mono">{jumlahSudah}</span>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 20,
        }}
        className="detail-grid"
      >
        <MapView titik={titikFiltered} status={status} />
        <PinList titik={titikFiltered} status={status} />
      </div>
    </main>
  );
}
