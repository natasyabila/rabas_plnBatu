import type { Metadata } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import SyncStatus from "@/components/SyncStatus";

export const metadata: Metadata = {
  title: "Monitoring Rabas Jaringan — ULP Batu",
  description: "Dashboard pemantauan titik rabas pohon per penyulang",
  manifest: "/manifest.json",
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          {children}
        </div>
        <SyncStatus />
      </body>
    </html>
  );
}