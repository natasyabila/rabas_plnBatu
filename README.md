# Monitoring Rabas Jaringan — ULP Batu

Dashboard untuk memantau titik potensi gangguan pohon (rabas) di 9 penyulang.
Klik penyulang → lihat peta → klik pin → tandai status "sudah dirabas".

## Isi project

```
app/
  page.tsx                     halaman utama, 9 kartu penyulang
  penyulang/[slug]/page.tsx    halaman detail: tab Belum/Sudah + peta + daftar
  layout.tsx, globals.css      layout & tema (dark, aksen amber)
components/
  PenyulangCard.tsx            kartu ringkasan per penyulang
  MapView.tsx                  peta Leaflet, pin merah/hijau, popup + tombol aksi
  PinList.tsx                  daftar titik di samping peta
  FeederLine.tsx                elemen dekoratif
lib/
  store.ts                     state global (Zustand) — sync dengan Supabase + realtime
  supabaseClient.ts            koneksi ke Supabase
  types.ts                     tipe TypeScript
data/
  titik_aset.json              cadangan data (referensi saja, tidak dipakai runtime lagi)
supabase/
  schema.sql                   skema tabel, siap dijalankan di SQL Editor Supabase
  titik_aset_import.csv        data awal (1.985 titik tervalidasi), siap di-import
```

## Cara menjalankan di komputer kamu

Butuh Node.js versi 18 ke atas.

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Status penyimpanan data saat ini

Aplikasi ini **sudah terhubung ke database Supabase** — semua device (HP
petugas lapangan, laptop kantor) melihat data yang sama secara real-time.
Klik "Tandai sudah dirabas" di satu HP, otomatis muncul juga di device lain
yang sedang membuka halaman yang sama, tanpa perlu refresh.

### Cara setup Supabase (sekali saja di awal)

**1. Buat project Supabase**
- Daftar/login di [supabase.com](https://supabase.com) (gratis).
- Klik "New Project", isi nama bebas (misal `pln-rabas`), pilih region
  terdekat (Southeast Asia / Singapore), buat password database (simpan
  baik-baik, tapi tidak dipakai lagi di kode ini).
- Tunggu ~2 menit sampai project selesai dibuat.

**2. Buat tabel database**
- Di dashboard project, buka menu **SQL Editor** (ikon di sidebar kiri).
- Klik "New query".
- Buka file `supabase/schema.sql` di project ini, copy semua isinya, paste
  ke SQL Editor.
- Klik **Run**. Kalau berhasil, muncul "Success. No rows returned".

**3. Import data awal (1.985 titik yang sudah divalidasi)**
- Di sidebar kiri, buka menu **Table Editor**.
- Pilih tabel `titik_aset`.
- Klik tombol **Insert** → **Import data from CSV**.
- Upload file `supabase/titik_aset_import.csv` dari project ini.
- Pastikan nama kolom di preview cocok otomatis (harusnya cocok, karena
  memang sudah disiapkan sesuai skema).
- Klik Import. Tunggu sampai selesai (1.985 baris).

**4. Ambil kunci koneksi (API keys)**
- Buka menu **Project Settings** (ikon gerigi) → **API**.
- Salin **Project URL** dan **anon public key**.

**5. Hubungkan ke project Next.js kamu**
- Di folder project ini, buat file baru bernama **`.env.local`** (lihat
  contoh formatnya di `.env.local.example`).
- Isi dengan URL & anon key dari langkah 4:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=isi-anon-key-kamu
  ```
- Simpan file, lalu jalankan ulang `npm run dev` (matikan dulu kalau lagi
  jalan, `Ctrl+C`, lalu jalankan lagi).

Setelah ini, buka `http://localhost:3000` — datanya sekarang datang dari
Supabase, dan setiap klik "tandai sudah" tersimpan permanen di database,
bukan cuma di browser kamu sendiri.

### Keamanan

Karena aplikasi ini tidak pakai login, saya batasi lewat aturan database
(Row Level Security): browser cuma boleh **membaca** data, dan **tidak bisa**
mengubah data secara langsung. Perubahan status hanya bisa lewat satu
function khusus (`tandai_status_titik`) yang cuma bisa mengubah kolom status
— jadi walau seseorang buka DevTools browser dan coba iseng, dia tidak bisa
menghapus atau mengubah data lain di luar itu.

### Kalau nanti mau deploy (bukan cuma di laptop kamu)

Saat mau di-deploy ke Vercel, isi `.env.local` yang sama itu dimasukkan
sebagai "Environment Variables" di pengaturan project Vercel (bukan file
`.env.local` yang diupload). Ini bisa kita bahas kalau sudah sampai tahap
deploy.

## Data

`data/titik_aset.json` adalah hasil export dari notebook pembersihan data
(`titik_aset_clean.csv`) yang sudah kita buat sebelumnya di Colab — 1.985
titik, semua mulai dengan status `"belum"`.

Kalau kamu punya data lebih baru, tinggal jalankan ulang notebook itu lalu
ganti isi file ini (format array of object, field-nya harus sama persis
dengan yang ada di `lib/types.ts`).
