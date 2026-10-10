# 📦 Inventory SuperApp

**Inventory SuperApp** adalah sistem manajemen inventaris dan pergudangan modern berbasis web yang dirancang untuk memantau, mencatat, dan menganalisis pergerakan stok barang secara real-time dengan antarmuka hangat bertema Claude (*Warm Orange*).

Aplikasi ini dikembangkan oleh **Hamba Penat** dengan arsitektur offline-first, cepat, responsif, dan mudah digunakan oleh staf logistik maupun manajer gudang.

---

## ✨ Fitur Utama

- **Dashboard & Analitik Real-Time**: Visualisasi distribusi stok, kategori barang, dan rasio ketersediaan barang dengan Recharts.
- **Manajemen Inventaris Lengkap**:
  - Penambahan barang baru dengan kategori, SKU, lokasi, dan batas minimum stok.
  - Penyesuaian stok masuk (*Add Stock*) dan stok keluar (*Remove Stock*).
  - Penghapusan barang dengan validasi keamanan.
  - Pencarian dan filter instan berdasarkan status stok (Aman, Menipis, Habis).
- **Desain Oranye Hangat ala Claude**: Palet ramah mata, elegan, dan memenuhi standar aksesibilitas kontras WCAG AA.
- **Dukungan Dark Mode**: Terintegrasi otomatis antara Tailwind CSS v4, MUI v7, dan `next-themes`.
- **Notifikasi Toast Interaktif**: Umpan balik langsung untuk setiap aksi menggunakan Sonner.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), CSS Variables
- **UI Components**: shadcn/ui (Radix UI primitives), Material UI (MUI v7)
- **Charts & Data**: Recharts
- **Icons**: Lucide React
- **Theming**: `next-themes` (Dark/Light mode sync)
- **Notifications**: Sonner

---

## 🚀 Memulai (Getting Started)

### Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) dan [pnpm](https://pnpm.io/) (atau npm/yarn).

### 1. Instalasi Dependensi
Jalankan perintah berikut pada direktori project:

```bash
pnpm install
```

*(Atau gunakan `npm install` jika pnpm belum terinstal secara global)*

### 2. Menjalankan Server Pengembangan
Untuk menjalankan aplikasi dalam mode development:

```bash
pnpm dev
```

Buka browser Anda dan akses tautan lokal yang ditampilkan di terminal (biasanya `http://localhost:5173`).

### 3. Build Produksi
Untuk membangun aplikasi ke dalam bundel produksi:

```bash
pnpm build
```

Hasil build akan tersimpan di dalam folder `dist/` dan siap dideploy ke platform hosting statis apa pun (Vercel, Netlify, Cloudflare Pages, dsb).

---

## 📄 Lisensi dan Atribusi

Informasi mengenai lisensi pustaka pihak ketiga dan aset gambar dapat dilihat pada file [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md).

---
© 2026 **Hamba Penat** — All rights reserved.