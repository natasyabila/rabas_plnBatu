"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import type { TitikAset, StatusRabas } from "@/lib/types";
import { useAsetStore } from "@/lib/store";

function buatIkonPin(warna: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 22px; height: 22px; border-radius: 50% 50% 50% 0;
      background: ${warna}; transform: rotate(-45deg);
      border: 2px solid rgba(0,0,0,0.35);
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -20],
  });
}

const iconMerah = buatIkonPin("#e5484d");
const iconHijau = buatIkonPin("#33c481");

function linkNavigasi(lat: number, lon: number) {
  // Membuka Google Maps dengan rute dari lokasi HP petugas ke titik ini.
  // Kalau dibuka di HP, otomatis kebuka app Google Maps (bukan cuma browser).
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
}

function FitBounds({ titik }: { titik: TitikAset[] }) {
  const map = useMap();
  useEffect(() => {
    if (titik.length === 0) return;
    const bounds = L.latLngBounds(
      titik.map((t) => [t.latitude, t.longitude] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 16 });
  }, [titik, map]);
  return null;
}

export default function MapView({
  titik,
  status,
}: {
  titik: TitikAset[];
  status: StatusRabas;
}) {
  const tandaiStatus = useAsetStore((s) => s.tandaiStatus);
  const icon = status === "belum" ? iconMerah : iconHijau;

  const center = useMemo<[number, number]>(() => {
    if (titik.length === 0) return [-7.9, 112.5];
    return [titik[0].latitude, titik[0].longitude];
  }, [titik]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: 480, width: "100%", borderRadius: 16 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds titik={titik} />
      {titik.map((t) => (
        <Marker
          key={t.kode_unik}
          position={[t.latitude, t.longitude]}
          icon={icon}
        >
          <Popup>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>{t.nama_aset}</p>
            <p style={{ marginBottom: 2 }}>
              Section {t.section} &middot; {t.konstruksi}
            </p>
            <p style={{ marginBottom: 2 }}>
              Kondisi: <strong>{t.health_index}</strong>
            </p>
            <p style={{ marginBottom: 10, color: "var(--text-secondary)" }}>
              {t.keterangan}
            </p>
            <a
              href={linkNavigasi(t.latitude, t.longitude)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                background: "var(--accent)",
                color: "#1a1204",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 8,
                textDecoration: "none",
                boxSizing: "border-box",
              }}
            >
              🧭 Navigasi ke Lokasi
            </a>
            {status === "belum" ? (
              <button
                onClick={() => tandaiStatus(t.kode_unik, "sudah")}
                style={{
                  width: "100%",
                  background: "var(--success)",
                  color: "#06301c",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Tandai sudah dirabas
              </button>
            ) : (
              <button
                onClick={() => tandaiStatus(t.kode_unik, "belum")}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                }}
              >
                Batalkan (tandai belum lagi)
              </button>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
