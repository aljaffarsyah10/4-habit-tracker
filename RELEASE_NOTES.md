# RELEASE NOTES — HABIT TRACKER

**Versi**: v1.0.0 (General Availability)  
**Tanggal Rilis**: 2026-11-03  
**Status**: Stable Production Release  
**Dokumen Referensi**: [PRD and Playbook.md](./PRD%20and%20Playbook.md) | [TECHNICAL_PLAN.md](./TECHNICAL_PLAN.md) | [TEST_REPORT.md](./TEST_REPORT.md) | [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)  

---

## 1. Executive Summary

Dengan bangga kami merilis **Habit Tracker v1.0.0**, aplikasi web pelacak kebiasaan harian modern yang dirancang untuk membantu pengguna membangun dan mempertahankan rutinitas positif secara konsisten. Dibangun menggunakan arsitektur **Modular Monolith** berbasis **Next.js 16+**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM**, dan **PostgreSQL**, rilis ini menghadirkan performa secepat kilat, antarmuka responsif dan aksesibel, kalkulasi streak yang adil, serta keamanan data tingkat enterprise.

---

## 2. Feature Highlights & Deliverables

### 2.1 Core Features (P0 MVP)
- **Autentikasi Aman & Manajemen Sesi**:
  - Pendaftaran pengguna baru dengan validasi data real-time via Zod.
  - Hashing password menggunakan algoritma industri `bcryptjs` (salt rounds: 12).
  - Sesi berbasis token JWT (`jose`) yang disimpan dalam cookie terenkripsi `HttpOnly; SameSite=Lax; Secure`.
  - Proteksi rute otomatis via Next.js Edge Middleware (`/dashboard`, `/habits`, `/statistics`, `/settings`).
- **Pengelolaan Kebiasaan (Habit CRUD)**:
  - Pembuatan kebiasaan baru dengan dukungan frekuensi harian (*Daily*) atau mingguan (*Weekly*) dengan memilih hari-hari aktif tertentu.
  - Kustomisasi palet warna preset (Emerald, Blue, Violet, Amber, Rose, Cyan) dan deskripsi kebiasaan.
  - Pembaruan dan penghapusan kebiasaan dengan dialog konfirmasi aman (*cascade delete*).
  - Isolasi data multi-tenant ketat: pengguna hanya dapat melihat dan memodifikasi kebiasaan miliknya sendiri.
- **Pelacakan Harian & Sinkronisasi Progres (Daily Tracking)**:
  - Antarmuka interaktif dengan *Optimistic UI Update*: centang kebiasaan berubah seketika tanpa jeda jaringan, dengan rollback otomatis jika terjadi kegagalan server.
  - Progress bar dinamis yang menghitung persentase keberhasilan harian ($T$ total terjadwal vs $C$ total selesai).
  - Pencegahan duplikasi data melalui database unique composite constraint `@@unique([habitId, completionDate])`.
- **Engine Kalkulasi Streak Cerdas (Schedule-Aware Streak)**:
  - Menghitung *Current Streak* dan *Best Streak* personal.
  - Mematuhi aturan FR-10: hari yang tidak dijadwalkan (misal libur akhir pekan) **tidak memutus streak**.
  - Hari aktif yang belum selesai di hari ini **tidak memutus streak sebelum waktunya**.
- **Ringkasan Statistik & Riwayat**:
  - Rangkuman metrik utama: Current Streak, Best Streak, Completion Rate (%), Total Check-ins.
  - Grafik breakdown 7 hari ke belakang dengan perbandingan habit selesai vs terjadwal.

### 2.2 Supporting Features (P1 Usability Polish)
- **Arsip & Pemulihan Kebiasaan (Habit Archive & Restore)**:
  - Mengarsipkan kebiasaan non-aktif tanpa menghapus riwayat check-in masa lalu.
  - Tab terpisah di `/habits`: `Aktif` dan `Diarsipkan` dengan tombol pemulihan (*restore*) satu klik.
- **Pencarian Real-Time & Filter Status**:
  - Filter pills di `/dashboard`: `All`, `Completed`, dan `Pending` beserta hitungan jumlah habit.
  - Kolom pencarian instan di `/habits` untuk menyaring kebiasaan berdasarkan nama atau deskripsi.
- **Peta Aktivitas 30 Hari (30-Day Calendar Heatmap)**:
  - Visualisasi kalender 30 hari di `/statistics` dengan intensitas warna hijau emerald berdasarkan persentase pencapaian harian.
  - Kartu detail interaktif saat tanggal kalender diklik.
- **Dukungan Mode Gelap (Dark Mode)**:
  - Tombol pengalih tema (Sun/Moon) di header aplikasi dengan persistensi otomatis di `localStorage`.
- **Healthcheck & Monitoring Endpoint**:
  - Endpoint publik `/api/health` untuk memverifikasi kesiapan container dan konektivitas live PostgreSQL.

---

## 3. Technology Stack & Specifications

| Layer / Komponen | Teknologi yang Digunakan |
| :--- | :--- |
| **Framework** | Next.js 16.4 (App Router, Turbopack, Partial Prerendering) |
| **Bahasa Pemrograman** | TypeScript 5 (Strict Mode) |
| **Runtime & Testing** | Node.js v24 (Native Test Runner & Assertions) |
| **Styling & Theme** | Tailwind CSS v4, Lucide React, Shadcn/ui |
| **Database Engine** | PostgreSQL 16 Alpine |
| **ORM & Migrations** | Prisma ORM 6.19.3 |
| **Security & Auth** | Jose (JWT), Bcryptjs, Secure HttpOnly Cookies |
| **Validasi Skema** | Zod 3.x |

---

## 4. Verification & Quality Assurance Results

1. **Automated Test Results**:
   - `Phase 9 — Input Validation & Schema Hardening`: 12 tests PASS.
   - `Phase 9 — Security Audit & Penetration Hardening`: 7 tests PASS.
   - `Phase 8 — P1 Supporting Features Verification`: 3 tests PASS.
   - `Phase 7 — End-to-End Core Workflow Integration`: 11 tests PASS.
   - `Backend Integration & Security Tests`: 15 tests PASS.
   - `StreakService Calculation Engine`: 9 tests PASS.
   - **Total: 57 tests passed across 18 test suites (0 failed)**.
2. **Static Analysis & Typecheck**:
   - ESLint: 0 errors, 0 warnings.
   - TypeScript `tsc --noEmit`: 0 type errors.
3. **Production Build & Smoke Tests**:
   - Next.js Production Build: Berhasil meng-compile dan melakukan static prerendering pada 26 rute.
   - Live HTTP smoke tests pada server production:
     - `GET /api/health` -> `200 OK` (`status: healthy`, `database: connected`).
     - `GET /` -> `200 OK`.
     - `GET /login` -> `200 OK`.
     - `GET /dashboard` tanpa autentikasi -> `307 Temporary Redirect` ke `/login`.
     - HTTP Security Headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) aktif pada seluruh respon.

---

## 5. Deployment Checklist for Production Operators

- [x] Pastikan database PostgreSQL 15/16 telah diprovisioning.
- [x] Konfigurasi environment variables: `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`.
- [x] Jalankan migrasi database: `npm run db:migrate`.
- [x] Compile aplikasi: `npm run build`.
- [x] Jalankan server: `npm run start` (atau sambungkan ke platform Vercel/Railway).
- [x] Verifikasi konektivitas via `curl https://yourdomain.com/api/health`.
- [x] Hubungkan layanan uptime monitoring ke `/api/health`.

---
*Habit Tracker v1.0.0 siap digunakan oleh pengguna publik secara aman, andal, dan menyenangkan.*
