# HABIT TRACKER

## Product Requirements Document & Sequential Development Playbook

**Project Name:** Habit Tracker  
**Project Type:** Web Application  
**Target Audience:** Public  
**Development Approach:** Solo Developer, AI-Assisted Development, MVP First  
**Version:** 1.0.0  
**Status:** Development Planning

---

# PART A — PRODUCT REQUIREMENTS DOCUMENT (PRD)

# 1. Product Information

| Item             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| Product Name     | Habit Tracker                                                    |
| Platform         | Web Application                                                  |
| Target Users     | Public                                                           |
| Primary Purpose  | Membantu pengguna membangun dan mempertahankan kebiasaan positif |
| Development      | Solo Developer + AI Coding Assistant                             |
| Frontend         | Next.js App Router                                               |
| Language         | TypeScript                                                       |
| Styling          | Tailwind CSS                                                     |
| UI Components    | shadcn/ui                                                        |
| State Management | React State + Zustand jika diperlukan                            |
| Backend          | Next.js Route Handlers                                           |
| Database         | PostgreSQL                                                       |
| ORM              | Prisma                                                           |
| Authentication   | Auth.js                                                          |
| Deployment       | Vercel atau VPS                                                  |
| Version Control  | Git                                                              |

## 1.1 Project Constraints

- Fokus pada MVP yang dapat digunakan secara nyata.
- Arsitektur sederhana dan maintainable.
- Tidak menggunakan microservices.
- Tidak menggunakan Rust, Tauri, atau desktop architecture.
- Tidak menggunakan AI untuk rekomendasi habit pada MVP.
- Tidak menggunakan gamification kompleks.
- Tidak menggunakan payment system pada MVP.
- Tidak menambahkan dependency tanpa kebutuhan jelas.
- Menggunakan database untuk persistensi data pengguna.
- Authentication diperlukan untuk menyimpan data habit secara personal dan lintas perangkat.

## 1.2 Development Principles

1. Build only what is necessary for the MVP.
2. Prefer simple and explicit code.
3. Separate UI from business logic.
4. Validate inputs on both client and server.
5. Use reusable components where beneficial.
6. Avoid premature abstraction.
7. Every phase must pass acceptance criteria.
8. Do not automatically proceed to the next phase.

---

# 2. Product Overview

## 2.1 Problem Statement

Banyak orang ingin membangun kebiasaan positif seperti membaca, berolahraga, belajar, minum air, atau tidur lebih teratur.

Namun, mereka sering mengalami kesulitan dalam:

- Memantau konsistensi kebiasaan.
- Mengingat aktivitas yang perlu dilakukan.
- Mengetahui perkembangan habit.
- Mempertahankan motivasi dalam jangka panjang.
- Melihat riwayat pencapaian secara terstruktur.

## 2.2 Proposed Solution

Habit Tracker merupakan aplikasi web yang memungkinkan pengguna:

- Membuat daftar kebiasaan.
- Menentukan jadwal habit.
- Menandai habit yang telah selesai.
- Melihat progres harian.
- Memantau konsistensi.
- Melihat riwayat aktivitas.
- Mengelola habit dalam satu dashboard.

## 2.3 Product Value

**Simple habit tracking with meaningful progress.**

Aplikasi harus mudah digunakan tanpa memerlukan konfigurasi yang kompleks.

## 2.4 Product Workflow

1. Pengguna membuka website.
2. Pengguna membuat akun atau login.
3. Pengguna membuat habit baru.
4. Habit muncul pada dashboard.
5. Pengguna menandai habit sebagai selesai.
6. Sistem menyimpan aktivitas.
7. Dashboard memperbarui progres.
8. Pengguna melihat statistik dan riwayat.

---

# 3. Product Goals

## 3.1 MVP Goals

| Goal                                  | Success Indicator                                  |
| ------------------------------------- | -------------------------------------------------- |
| Memudahkan pembuatan habit            | Habit dapat dibuat dalam kurang dari 30 detik      |
| Memudahkan tracking                   | Habit dapat ditandai selesai dengan satu interaksi |
| Menyediakan progress tracking         | Progres harian dapat dilihat secara langsung       |
| Menyimpan data secara persisten       | Data tetap tersedia setelah logout dan login       |
| Mendukung penggunaan lintas perangkat | Data tersinkronisasi melalui akun                  |
| Menyediakan statistik dasar           | Pengguna dapat melihat completion rate dan streak  |

## 3.2 Non-Goals

MVP tidak bertujuan untuk:

- Menggantikan aplikasi project management.
- Menyediakan social network.
- Menyediakan AI habit coach.
- Menyediakan integrasi wearable.
- Menyediakan kalender eksternal.
- Menyediakan sistem reward kompleks.
- Menyediakan subscription atau payment.

---

# 4. Target Users

## 4.1 Primary User

Individu yang ingin membangun kebiasaan produktif dan menjaga konsistensi rutinitas.

## 4.2 User Personas

### Persona A — Productivity Enthusiast

Kebutuhan:

- Tracking beberapa habit.
- Melihat progress.
- Menjaga rutinitas harian.

### Persona B — Beginner

Kebutuhan:

- Interface sederhana.
- Tidak banyak konfigurasi.
- Panduan penggunaan yang jelas.

### Persona C — Self Improvement User

Kebutuhan:

- Melihat perkembangan jangka panjang.
- Mengidentifikasi konsistensi.
- Memantau pencapaian pribadi.

---

# 5. Scope & Feature Priorities

## 5.1 P0 — Core MVP

| Feature            | Description                            |
| ------------------ | -------------------------------------- |
| Authentication     | Register, login, logout                |
| Dashboard          | Overview habit harian                  |
| Habit CRUD         | Create, read, update, delete habit     |
| Daily Tracking     | Menandai habit selesai atau belum      |
| Habit Schedule     | Daily dan hari tertentu                |
| Progress Indicator | Completion progress harian             |
| Streak             | Current streak dan best streak         |
| Basic Statistics   | Completion rate dan summary            |
| Habit History      | Riwayat tracking                       |
| Responsive UI      | Desktop, tablet, mobile                |
| Persistence        | Database storage                       |
| User Isolation     | Data habit hanya dapat diakses pemilik |

## 5.2 P1 — Supporting Features

- Habit category.
- Habit color customization.
- Habit archive.
- Calendar view.
- Weekly statistics.
- Dark mode.
- Habit notes.
- Dashboard filtering.
- Habit reminder preferences.

## 5.3 P2 — Future Development

- Push notifications.
- Email reminders.
- Habit templates.
- Advanced analytics.
- Goal-based tracking.
- Social accountability.
- Shared habits.
- AI habit recommendations.
- Mobile application.
- Subscription and monetization.

---

# 6. Functional Requirements

## FR-01 — User Registration

Sistem memungkinkan pengguna membuat akun.

Acceptance Criteria:

- Pengguna dapat memasukkan email dan password.
- Email harus valid.
- Password memenuhi kebijakan keamanan.
- Email yang sudah digunakan ditolak.
- Password disimpan menggunakan hashing.
- Pengguna mendapatkan feedback atas keberhasilan atau kegagalan.

## FR-02 — User Login

Sistem memungkinkan pengguna login.

Acceptance Criteria:

- Pengguna dapat login menggunakan kredensial valid.
- Kredensial tidak valid menghasilkan pesan error.
- Session dibuat dengan aman.
- Dashboard hanya dapat diakses pengguna terautentikasi.

## FR-03 — User Logout

Acceptance Criteria:

- Pengguna dapat logout.
- Session diakhiri.
- Halaman terproteksi tidak dapat diakses setelah logout.

## FR-04 — Create Habit

Acceptance Criteria:

- Pengguna dapat membuat habit baru.
- Nama habit wajib diisi.
- Nama habit memiliki batas panjang.
- Jadwal habit dapat dipilih.
- Habit tersimpan di database.
- Habit muncul di dashboard.

## FR-05 — View Habits

Acceptance Criteria:

- Sistem menampilkan seluruh habit aktif milik pengguna.
- Habit ditampilkan sesuai jadwal hari ini.
- Habit pengguna lain tidak dapat diakses.
- Loading dan empty states tersedia.

## FR-06 — Update Habit

Acceptance Criteria:

- Pengguna dapat mengubah nama habit.
- Pengguna dapat mengubah jadwal.
- Perubahan tersimpan di database.
- Dashboard menampilkan data terbaru.

## FR-07 — Delete Habit

Acceptance Criteria:

- Pengguna dapat menghapus habit miliknya.
- Sistem meminta konfirmasi sebelum penghapusan.
- Habit tidak lagi tampil setelah dihapus.
- Data pengguna lain tidak terpengaruh.

## FR-08 — Daily Habit Tracking

Acceptance Criteria:

- Pengguna dapat menandai habit selesai.
- Pengguna dapat membatalkan status selesai.
- Status tersimpan dengan tanggal lokal pengguna.
- Tidak ada duplicate completion record.
- Status diperbarui setelah mutation berhasil.

## FR-09 — Daily Progress

Acceptance Criteria:

- Dashboard menampilkan jumlah habit yang selesai.
- Dashboard menampilkan total habit terjadwal.
- Progress dihitung berdasarkan habit aktif yang dijadwalkan hari tersebut.
- Persentase progress dihitung secara konsisten.

## FR-10 — Streak Calculation

Acceptance Criteria:

- Sistem menghitung current streak.
- Sistem menghitung best streak.
- Streak berdasarkan tanggal dan jadwal habit.
- Hari yang tidak dijadwalkan tidak memutus streak.
- Hari ini yang belum selesai tidak salah dihitung sebagai streak terputus sebelum waktunya.

## FR-11 — Habit History

Acceptance Criteria:

- Pengguna dapat melihat riwayat completion.
- Riwayat berdasarkan tanggal.
- Data hanya menampilkan habit milik pengguna.
- Tanggal tanpa aktivitas memiliki empty state.

## FR-12 — Basic Statistics

Acceptance Criteria:

- Sistem menampilkan completion rate.
- Sistem menampilkan jumlah completion.
- Sistem menampilkan ringkasan periode tertentu.
- Statistik menggunakan data aktual database.

## FR-13 — Dashboard Navigation

Acceptance Criteria:

- Pengguna dapat berpindah antara Dashboard, Habits, dan Statistics.
- Navigation berfungsi di mobile dan desktop.
- Halaman aktif ditandai secara visual.

## FR-14 — Data Persistence

Acceptance Criteria:

- Data tersimpan di database.
- Data tetap tersedia setelah reload.
- Data tetap tersedia setelah login ulang.
- Perubahan tidak hanya tersimpan di local state.

## FR-15 — Responsive Application

Acceptance Criteria:

- Layout berfungsi pada mobile.
- Layout berfungsi pada tablet.
- Layout berfungsi pada desktop.
- Tidak ada horizontal overflow.
- Interaksi dapat digunakan dengan keyboard dan touch.

---

# 7. Non-Functional Requirements

## 7.1 Performance

- Halaman utama memiliki loading yang wajar.
- Hindari unnecessary re-render.
- Optimalkan database queries.
- Gunakan pagination apabila riwayat berkembang besar.
- Hindari pengambilan seluruh data historis untuk setiap request.

## 7.2 Security

- Validasi input di server.
- Hash password.
- Secure session cookies.
- Authentication dan authorization.
- Query hanya berdasarkan user ownership.
- Proteksi terhadap unauthorized access.
- Environment variables untuk credentials.
- Rate limiting pada authentication endpoints jika diperlukan.

## 7.3 Reliability

- Error ditangani secara konsisten.
- Database mutations memiliki validasi.
- UI tidak menampilkan data seolah tersimpan jika request gagal.
- Gunakan transaction apabila operasi memerlukan atomicity.

## 7.4 Maintainability

- TypeScript strict mode.
- Struktur folder modular.
- Reusable components.
- Business logic tidak ditempatkan seluruhnya dalam page component.
- Hindari dependency yang tidak diperlukan.

## 7.5 Accessibility

- Semantic HTML.
- Keyboard navigation.
- Accessible labels.
- Visible focus states.
- Contrast yang memadai.
- Form error dapat dipahami screen reader.

## 7.6 Compatibility

Target:

- Chrome.
- Firefox.
- Edge.
- Safari.

---

# 8. Application Structure & Navigation

## 8.1 Routes

| Route               | Description      | Access        |
| ------------------- | ---------------- | ------------- |
| `/`                 | Landing page     | Public        |
| `/login`            | Login            | Public        |
| `/register`         | Registration     | Public        |
| `/dashboard`        | Daily overview   | Authenticated |
| `/habits`           | Habit management | Authenticated |
| `/habits/new`       | Create habit     | Authenticated |
| `/habits/[id]/edit` | Edit habit       | Authenticated |
| `/statistics`       | Statistics       | Authenticated |
| `/settings`         | User settings    | Authenticated |

## 8.2 Main Navigation

Desktop:

- Dashboard
- Habits
- Statistics
- Settings
- User menu

Mobile:

- Dashboard
- Habits
- Statistics
- Profile / Settings

## 8.3 Reusable Components

- `AppShell`
- `Sidebar`
- `MobileNavigation`
- `Header`
- `HabitCard`
- `HabitForm`
- `HabitCheckbox`
- `ProgressBar`
- `StreakBadge`
- `StatCard`
- `EmptyState`
- `LoadingSkeleton`
- `ConfirmDialog`
- `DateSelector`

---

# 9. User Flow

## 9.1 First-Time User

1. Open landing page.
2. Click Register.
3. Complete registration.
4. Redirect to Dashboard.
5. View onboarding empty state.
6. Create first habit.
7. Habit appears on dashboard.
8. Complete habit.
9. View updated progress.

## 9.2 Returning User

1. Open application.
2. Login if session expired.
3. Open Dashboard.
4. View today's habits.
5. Complete scheduled habits.
6. View daily progress.
7. Open Statistics if needed.

## 9.3 Habit Management

1. Open Habits.
2. Select Create Habit.
3. Enter name.
4. Select schedule.
5. Save habit.
6. Edit or delete when needed.

---

# 10. UI/UX Requirements

## 10.1 Design Principles

- Minimalist.
- Clean.
- Focused.
- Calm and distraction-free.
- Prioritize daily actions.
- Clear information hierarchy.
- Avoid excessive gamification.

## 10.2 Design Direction

- Modern SaaS dashboard.
- Neutral background.
- Consistent spacing.
- Rounded cards.
- Subtle borders.
- Clear typography.
- Small, meaningful color accents.

## 10.3 Dashboard Layout

### Desktop

- Sidebar navigation.
- Header with date and profile.
- Daily progress summary.
- Today's habit list.
- Statistics summary.

### Mobile

- Compact header.
- Daily progress.
- Habit list.
- Bottom navigation.
- Touch-friendly interaction.

## 10.4 UI States

Every data-driven component should support:

| State    | Expected Behavior             |
| -------- | ----------------------------- |
| Loading  | Skeleton or loading indicator |
| Empty    | Helpful message and CTA       |
| Error    | Clear message and retry       |
| Success  | Updated UI and feedback       |
| Disabled | Prevent duplicate submissions |

## 10.5 Habit Interaction

- Checkbox or completion button.
- Clear completed state.
- Accessible interaction.
- Visual feedback.
- Avoid requiring unnecessary navigation.

---

# 11. Error Handling

| Error                | Cause                          | Response                          |
| -------------------- | ------------------------------ | --------------------------------- |
| Invalid input        | Form validation                | Show field-level error            |
| Invalid credentials  | Authentication                 | Generic login error               |
| Unauthorized         | Missing session                | Redirect to login                 |
| Forbidden            | Access another user's resource | Return 403 or 404                 |
| Not found            | Resource missing               | Show not-found state              |
| Network error        | API unavailable                | Show retry option                 |
| Database error       | Persistence failure            | Show generic server error         |
| Duplicate completion | Unique constraint              | Return existing state or conflict |
| Rate limited         | Excessive requests             | Show retry guidance               |
| Unexpected error     | Unknown failure                | Log safely and show fallback      |

---

# 12. Technical Architecture

## 12.1 Architecture Overview

Gunakan **Modular Monolith** berbasis Next.js.

Tidak diperlukan dedicated backend service pada MVP karena aplikasi berfokus pada CRUD, authentication, dan data tracking.

## 12.2 Application Layers

### Presentation Layer

- Next.js pages.
- Layouts.
- React components.
- UI states.
- Forms.

### Application Layer

- Use cases.
- Application services.
- Request orchestration.

### Business Logic Layer

- Habit rules.
- Schedule validation.
- Completion logic.
- Streak calculation.
- Progress calculation.

### Data Access Layer

- Repository functions.
- Prisma queries.
- Data mapping.

### Infrastructure Layer

- PostgreSQL.
- Auth.js.
- Prisma.
- External services jika diperlukan.

## 12.3 Recommended Data Flow

```text
User Interaction
      |
      v
React Component
      |
      v
Server Action / Route Handler
      |
      v
Input Validation
      |
      v
Application Service
      |
      v
Business Logic
      |
      v
Repository / Prisma
      |
      v
PostgreSQL
      |
      v
Response
      |
      v
UI Update
```

## 12.4 Backend Decision

Gunakan:

- Next.js Server Actions untuk form mutations internal jika sesuai.
- Next.js Route Handlers untuk endpoint REST.
- Prisma untuk database access.
- Auth.js untuk authentication.

Tidak perlu Axios secara default. Gunakan native `fetch` atau Server Actions.

## 12.5 State Management

Gunakan React state untuk:

- Form inputs.
- Dialog.
- Modal.
- Local UI state.

Gunakan Zustand hanya apabila:

- Shared client state mulai kompleks.
- State diperlukan lintas banyak komponen.
- State tidak cocok dikelola melalui props atau server data.

Database tetap menjadi source of truth.

---

# 13. Data Model

## 13.1 User

```typescript
interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 13.2 Habit

```typescript
type HabitFrequency = "DAILY" | "WEEKLY";

interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  frequency: HabitFrequency;
  scheduledDays: number[];
  color: string | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

Konvensi `scheduledDays`:

- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

## 13.3 Habit Completion

```typescript
interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  completionDate: string;
  createdAt: Date;
}
```

`completionDate` disimpan dalam format `YYYY-MM-DD` berdasarkan timezone pengguna.

## 13.4 Relationship

```text
User
 ├── Habits
 │    └── Habit Completions
 └── Account / Session
      └── Auth.js
```

## 13.5 Database Strategy

Gunakan PostgreSQL.

Alasan:

- Relational data yang sederhana.
- Mendukung unique constraints.
- Mendukung indexing.
- Cocok untuk data completion.
- Mudah di-deploy pada managed database atau VPS.

## 13.6 Constraints

- Habit harus memiliki owner.
- Completion harus memiliki owner.
- Habit dan completion harus konsisten ownership-nya.
- Satu habit hanya boleh memiliki satu completion per tanggal.
- Data harus memiliki foreign keys.
- Gunakan index pada `userId`, `habitId`, dan `completionDate`.

---

# 14. Security & Privacy

## 14.1 Authentication

- Password hashing melalui mekanisme yang aman.
- Session menggunakan secure cookies.
- Jangan menyimpan password plaintext.
- Jangan menyimpan session token di localStorage.
- Redirect unauthorized users.

## 14.2 Authorization

Setiap query habit harus dibatasi berdasarkan user yang sedang login.

Contoh:

```typescript
const habit = await prisma.habit.findFirst({
  where: {
    id: habitId,
    userId: session.user.id,
  },
});
```

Jangan melakukan query berdasarkan ID saja.

## 14.3 Validation

Gunakan Zod untuk validasi:

- Habit name.
- Description.
- Schedule.
- Route parameters.
- API payload.

## 14.4 Privacy

- Data habit bersifat personal.
- Jangan membagikan data pengguna tanpa izin.
- Jangan menyimpan data sensitif yang tidak diperlukan.
- Gunakan HTTPS pada production.
- Sediakan mekanisme penghapusan data akun pada pengembangan lanjutan.

---

# 15. Success Criteria

MVP dinyatakan berhasil apabila:

- Pengguna dapat register dan login.
- Pengguna dapat membuat habit.
- Pengguna dapat mengubah dan menghapus habit.
- Pengguna dapat menentukan jadwal habit.
- Pengguna dapat melakukan tracking harian.
- Progress harian diperbarui.
- Streak dapat dihitung dengan benar.
- Statistics menampilkan data aktual.
- Data tersimpan secara permanen.
- Data pengguna terisolasi.
- UI responsive.
- Tidak terdapat critical bugs.
- Production deployment berhasil.

---

# 16. Risks & Technical Constraints

| Risk                                 | Mitigation                             |
| ------------------------------------ | -------------------------------------- |
| Salah perhitungan streak             | Unit tests untuk edge cases            |
| Timezone inconsistencies             | Gunakan date-only completion           |
| Duplicate tracking                   | Unique database constraint             |
| Unauthorized data access             | Ownership checks                       |
| Authentication complexity            | Gunakan Auth.js                        |
| Over-engineering                     | Batasi MVP dan dependency              |
| AI menghasilkan kode tidak konsisten | Eksekusi per phase                     |
| Database deployment issues           | Verifikasi koneksi sebelum integration |
| UI state tidak sinkron               | Database sebagai source of truth       |

---

# PART B — SEQUENTIAL DEVELOPMENT PLAYBOOK

# PHASE 1 — Environment & Project Bootstrap

## 1. Phase Objective

Menyiapkan development environment dan project Next.js yang siap dikembangkan.

## 2. Scope of Work

- Setup Node.js.
- Setup package manager.
- Setup Next.js.
- Setup TypeScript.
- Setup Tailwind CSS.
- Setup shadcn/ui.
- Setup Git.
- Setup ESLint.
- Verifikasi aplikasi.

## 3. Implementation Steps

### Step 1 — Verify Environment

```bash
node --version
npm --version
git --version
```

Rekomendasi:

- Node.js LTS.
- npm.
- Git.

### Step 2 — Create Project

```bash
npx create-next-app@latest habit-tracker
```

Pilih konfigurasi:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- src directory: Yes
- Import alias: `@/*`

### Step 3 — Enter Project

```bash
cd habit-tracker
```

### Step 4 — Install Dependencies

```bash
npm install
```

### Step 5 — Initialize shadcn/ui

```bash
npx shadcn@latest init
```

Tambahkan komponen dasar:

```bash
npx shadcn@latest add button card input label checkbox dialog
```

### Step 6 — Verify Development

```bash
npm run dev
```

Buka:

```text
http://localhost:3000
```

### Step 7 — Verify Build

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Fullstack Developer.

Project: Habit Tracker
Dokumen utama: PROJECT_PRD_AND_PLAYBOOK.md

Kerjakan PHASE 1 — Environment & Project Bootstrap.

Tugas:
1. Periksa environment dan struktur project.
2. Verifikasi Next.js App Router.
3. Verifikasi TypeScript.
4. Verifikasi Tailwind CSS.
5. Verifikasi shadcn/ui.
6. Pastikan ESLint berfungsi.
7. Pastikan project dapat dijalankan.
8. Jangan implementasikan fitur habit.
9. Jangan implementasikan backend.
10. Jangan menambahkan dependency yang tidak diperlukan.

Jika project belum tersedia, lakukan bootstrap sesuai dokumen.
Jika project sudah tersedia, jangan menimpa konfigurasi tanpa alasan.

Jalankan lint, typecheck, dan build.

Laporkan:
- Files created/modified.
- Dependencies.
- Commands executed.
- Testing results.
- Issues found.
```

## 5. Expected Deliverables

- Next.js project.
- TypeScript configuration.
- Tailwind configuration.
- shadcn/ui setup.
- Git repository.
- Project dapat dijalankan.

## 6. Acceptance Criteria

- [ ] Next.js berjalan.
- [ ] TypeScript aktif.
- [ ] Tailwind berfungsi.
- [ ] shadcn/ui terpasang.
- [ ] ESLint berjalan.
- [ ] Build berhasil.
- [ ] Tidak ada fitur produk yang diimplementasikan.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 1: project bootstrap"
```

---

# PHASE 2 — Technical Planning & Architecture

## 1. Phase Objective

Menghasilkan technical plan final berdasarkan PRD sebelum implementasi fitur.

## 2. Scope of Work

- Architecture.
- Folder structure.
- Database selection.
- Authentication strategy.
- API strategy.
- Business logic.
- Data flow.
- Dependency planning.
- Technical risks.

## 3. Implementation Steps

### Step 1 — Analyze PRD

Periksa:

- Functional requirements.
- Data model.
- User flow.
- Security.
- Application structure.

### Step 2 — Define Architecture

Tetapkan:

- Next.js modular monolith.
- PostgreSQL.
- Prisma.
- Auth.js.
- Zod.
- Server Actions atau Route Handlers.

### Step 3 — Define Folder Structure

```text
src/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── habits/
│   │   └── statistics/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── habits/
│   └── dashboard/
│
├── features/
│   ├── auth/
│   ├── habits/
│   ├── tracking/
│   └── statistics/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── utils/
│   └── validations/
│
├── services/
├── hooks/
├── stores/
├── types/
└── constants/
```

Folder dapat disesuaikan berdasarkan kebutuhan aktual.

### Step 4 — Define Data Flow

Dokumentasikan:

- Authentication flow.
- Habit CRUD.
- Completion tracking.
- Statistics.
- Error handling.

### Step 5 — Define API

Rencana endpoint:

```text
GET    /api/habits
POST   /api/habits
GET    /api/habits/:id
PATCH  /api/habits/:id
DELETE /api/habits/:id

GET    /api/completions
POST   /api/completions
DELETE /api/completions/:id

GET    /api/statistics
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Software Architect.

Kerjakan PHASE 2 — Technical Planning & Architecture.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- Struktur project hasil Phase 1

Tugas:
1. Analisis requirement.
2. Tentukan arsitektur final.
3. Tentukan folder structure.
4. Tentukan data flow.
5. Tentukan database dan ORM.
6. Tentukan authentication.
7. Tentukan API architecture.
8. Tentukan business logic boundaries.
9. Identifikasi technical risks.
10. Dokumentasikan dependency dan alasannya.

Buat file:
TECHNICAL_PLAN.md

Batasan:
- Jangan implementasikan fitur.
- Jangan mengubah tech stack tanpa alasan.
- Jangan menambahkan microservices.
- Jangan menambahkan database lain.
- Jangan membuat abstraksi berlebihan.

Acceptance criteria:
- Architecture sesuai PRD.
- Folder structure jelas.
- Data model terdokumentasi.
- API strategy jelas.
- Security boundaries jelas.

Laporkan hasil dan jangan lanjut ke phase berikutnya.
```

## 5. Expected Deliverables

- `TECHNICAL_PLAN.md`
- Architecture diagram.
- Folder structure.
- API specification.
- Technical decisions.

## 6. Acceptance Criteria

- [ ] Architecture terdokumentasi.
- [ ] Data flow jelas.
- [ ] API strategy jelas.
- [ ] Database strategy jelas.
- [ ] Security strategy jelas.
- [ ] Tidak ada implementasi fitur.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 2: technical architecture"
```

---

# PHASE 3 — UI/UX Planning & Design System

## 1. Phase Objective

Menentukan design direction dan UI/UX sebelum membangun frontend.

## 2. Scope of Work

- Design direction.
- Color palette.
- Typography.
- Spacing.
- Navigation.
- Dashboard layout.
- Habit cards.
- Forms.
- Responsive behavior.
- UI states.

## 3. Implementation Steps

### Step 1 — Define Design Tokens

```text
Colors:
- Background
- Surface
- Primary
- Secondary
- Muted
- Border
- Success
- Destructive

Typography:
- Heading
- Body
- Caption

Spacing:
- 4px base scale

Radius:
- Small
- Medium
- Large
```

### Step 2 — Define Layout

Desktop:

- Sidebar.
- Header.
- Main content.
- Dashboard cards.

Mobile:

- Bottom navigation.
- Compact header.
- Responsive habit cards.

### Step 3 — Define Components

- AppShell.
- Navigation.
- HabitCard.
- ProgressBar.
- StatCard.
- HabitForm.
- EmptyState.
- Skeleton.
- ConfirmDialog.

### Step 4 — Define States

- Loading.
- Empty.
- Error.
- Success.
- Disabled.
- Completed.

### Step 5 — Document UI Guide

Buat:

```text
UI_UX_GUIDE.md
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior UI/UX Designer dan Frontend Architect.

Kerjakan PHASE 3 — UI/UX Planning & Design System.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md

Tugas:
1. Tentukan visual direction.
2. Tentukan color tokens.
3. Tentukan typography.
4. Tentukan spacing dan radius.
5. Tentukan dashboard layout.
6. Tentukan desktop dan mobile navigation.
7. Tentukan komponen reusable.
8. Tentukan responsive behavior.
9. Tentukan loading, empty, error, success states.
10. Dokumentasikan accessibility requirements.

Buat:
UI_UX_GUIDE.md

Batasan:
- Jangan implementasikan fitur.
- Jangan menambahkan dependency design yang tidak diperlukan.
- Jangan mengubah technical architecture.
- Jangan membuat design system terlalu kompleks.

Acceptance criteria:
- Design tokens jelas.
- Layout terdefinisi.
- Component specification jelas.
- Responsive behavior jelas.
```

## 5. Expected Deliverables

- `UI_UX_GUIDE.md`
- Design tokens.
- Layout specification.
- Component specification.
- Responsive guide.

## 6. Acceptance Criteria

- [ ] Design direction jelas.
- [ ] Layout desktop tersedia.
- [ ] Layout mobile tersedia.
- [ ] Design tokens terdokumentasi.
- [ ] Komponen reusable terdefinisi.
- [ ] UI states terdokumentasi.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 3: ui ux planning"
```

---

# PHASE 4 — Frontend Foundation & Application Shell

## 1. Phase Objective

Membangun fondasi frontend, layout, routing, dan reusable UI.

## 2. Scope of Work

- Global styles.
- Design tokens.
- App layouts.
- Navigation.
- Dashboard shell.
- Responsive layout.
- Reusable components.
- Placeholder pages.

## 3. Implementation Steps

### Step 1 — Implement Global Styles

Implementasi:

- CSS variables.
- Typography.
- Background.
- Theme tokens.
- Tailwind conventions.

### Step 2 — Implement Layout

- Root layout.
- Marketing layout.
- Authentication layout.
- Dashboard layout.

### Step 3 — Implement Navigation

- Desktop sidebar.
- Header.
- Mobile navigation.
- Active route state.

### Step 4 — Implement UI Components

- Cards.
- Buttons.
- Inputs.
- Dialog.
- Skeleton.
- Progress bar.

### Step 5 — Implement Routes

- Landing page.
- Login.
- Register.
- Dashboard.
- Habits.
- Statistics.
- Settings.

Gunakan placeholder content.

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Frontend Developer.

Kerjakan PHASE 4 — Frontend Foundation & Application Shell.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md
- UI_UX_GUIDE.md

Tugas:
1. Implementasikan global styles.
2. Implementasikan design tokens.
3. Implementasikan layouts.
4. Implementasikan navigation.
5. Implementasikan responsive shell.
6. Implementasikan reusable UI components.
7. Buat seluruh route dasar.
8. Gunakan placeholder untuk data.
9. Pastikan semua route dapat diakses.
10. Pastikan mobile responsive.

Batasan:
- Jangan implementasikan habit business logic.
- Jangan implementasikan database.
- Jangan implementasikan authentication backend.
- Jangan menambahkan dependency yang tidak diperlukan.

Acceptance criteria:
- Layout konsisten.
- Navigation berfungsi.
- Routes tersedia.
- Responsive.
- Build berhasil.
```

## 5. Expected Deliverables

- Application shell.
- Layout.
- Navigation.
- Reusable components.
- Route skeletons.

## 6. Acceptance Criteria

- [ ] Layout tersedia.
- [ ] Navigation berfungsi.
- [ ] Route dasar tersedia.
- [ ] Responsive.
- [ ] UI components reusable.
- [ ] Lint dan build berhasil.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 4: frontend foundation"
```

---

# PHASE 5 — Core Frontend Feature Development

## 1. Phase Objective

Membangun seluruh core UI dan interaksi frontend menggunakan mock data terkontrol.

## 2. Scope of Work

- Dashboard.
- Habit list.
- Habit card.
- Habit form.
- Create habit UI.
- Edit habit UI.
- Delete confirmation.
- Daily completion interaction.
- Progress display.
- Statistics UI.
- Loading, empty, dan error states.

## 3. Implementation Steps

### Step 1 — Define Types

Implementasikan TypeScript types sesuai PRD.

### Step 2 — Prepare Mock Data

Mock data hanya digunakan untuk frontend development.

Pisahkan:

```text
features/habits/mocks/
```

### Step 3 — Build Dashboard

- Daily progress.
- Today's habit list.
- Completed state.
- Empty state.
- Summary cards.

### Step 4 — Build Habit Management

- Habit list.
- Create form.
- Edit form.
- Delete confirmation.
- Schedule selection.

### Step 5 — Build Tracking UI

- Completion button.
- Progress update.
- Optimistic UI jika sesuai.
- Local state handling.

### Step 6 — Build Statistics UI

- Completion summary.
- Streak display.
- Basic chart jika relevan.

### Step 7 — Verify UI

Periksa:

- Responsive behavior.
- Form validation.
- UI states.
- Interactions.

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Frontend Developer.

Kerjakan PHASE 5 — Core Frontend Feature Development.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md
- UI_UX_GUIDE.md

Tugas:
1. Implementasikan dashboard.
2. Implementasikan habit list.
3. Implementasikan create/edit habit form.
4. Implementasikan habit schedule selection.
5. Implementasikan daily completion interaction.
6. Implementasikan progress UI.
7. Implementasikan statistics UI.
8. Implementasikan loading dan empty states.
9. Gunakan mock data yang terisolasi.
10. Validasi input dengan Zod jika diperlukan.

Batasan:
- Jangan implementasikan backend.
- Jangan membuat mock service menyerupai production secara berlebihan.
- Jangan menambahkan fitur P1 atau P2.
- Jangan mengubah arsitektur.

Mock data harus mudah diganti pada Phase 7.

Acceptance criteria:
- Seluruh core UI berfungsi.
- Form validation bekerja.
- UI responsive.
- Interaksi berjalan.
- Tidak ada error TypeScript.
```

## 5. Expected Deliverables

- Dashboard.
- Habit management.
- Tracking UI.
- Statistics UI.
- Mock data.
- Form validation.

## 6. Acceptance Criteria

- [ ] Dashboard berfungsi.
- [ ] Habit dapat dibuat secara lokal.
- [ ] Habit dapat diedit.
- [ ] Habit dapat dihapus.
- [ ] Tracking berfungsi.
- [ ] Progress UI diperbarui.
- [ ] Form validation berjalan.
- [ ] Responsive.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 5: core frontend features"
```

---

# PHASE 6 — Backend & Core Business Logic

## 1. Phase Objective

Implementasi database, authentication, API, dan business logic.

## 2. Scope of Work

- PostgreSQL.
- Prisma.
- Auth.js.
- Database schema.
- Authentication.
- Habit CRUD.
- Completion tracking.
- Validation.
- Business logic.
- Statistics service.
- Error handling.

## 3. Implementation Steps

### Step 1 — Install Dependencies

```bash
npm install prisma @prisma/client
npm install zod
```

Authentication dependencies disesuaikan dengan versi Auth.js yang dipilih.

### Step 2 — Initialize Prisma

```bash
npx prisma init
```

Configure:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

### Step 3 — Define Schema

Implementasi:

- User.
- Account.
- Session.
- Habit.
- HabitCompletion.

Tambahkan:

- Relations.
- Unique constraints.
- Indexes.
- Ownership constraints.

### Step 4 — Run Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 5 — Implement Authentication

- Registration.
- Login.
- Logout.
- Session handling.
- Protected routes.
- Password hashing.

### Step 6 — Implement Habit Services

```text
features/habits/
├── schemas/
├── services/
├── repositories/
├── actions/
└── types/
```

### Step 7 — Implement Tracking Logic

- Completion create.
- Completion delete.
- Duplicate prevention.
- Date handling.
- Streak calculation.
- Progress calculation.

### Step 8 — Implement API

Gunakan Server Actions atau Route Handlers berdasarkan Technical Plan.

### Step 9 — Verify Security

- Ownership checks.
- Input validation.
- Session checks.
- Error handling.

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Backend Developer.

Kerjakan PHASE 6 — Backend & Core Business Logic.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md

Tugas:
1. Implementasikan PostgreSQL integration.
2. Implementasikan Prisma schema.
3. Implementasikan database migrations.
4. Implementasikan authentication.
5. Implementasikan protected routes.
6. Implementasikan habit CRUD.
7. Implementasikan completion tracking.
8. Implementasikan streak calculation.
9. Implementasikan progress calculation.
10. Implementasikan validation.
11. Implementasikan ownership authorization.
12. Implementasikan error handling.

Batasan:
- Jangan implementasikan UI baru.
- Jangan mengubah frontend architecture.
- Jangan menambahkan microservices.
- Jangan menambahkan dependency tanpa alasan.
- Jangan mengasumsikan migration berhasil tanpa menjalankannya.

Acceptance criteria:
- Database berfungsi.
- Authentication berfungsi.
- API berfungsi.
- Business logic memiliki unit tests.
- Ownership checks diterapkan.
- Tidak ada unauthorized access.
```

## 5. Expected Deliverables

- Prisma schema.
- Database migrations.
- Authentication.
- Backend services.
- API / Server Actions.
- Validation.
- Business logic tests.

## 6. Acceptance Criteria

- [ ] Database terkoneksi.
- [ ] Migration berhasil.
- [ ] Register/login/logout berfungsi.
- [ ] Protected routes berfungsi.
- [ ] Habit CRUD berfungsi.
- [ ] Tracking berfungsi.
- [ ] Duplicate completion dicegah.
- [ ] Authorization diterapkan.
- [ ] Unit tests tersedia.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 6: backend implementation"
```

---

# PHASE 7 — Frontend & Backend Integration

## 1. Phase Objective

Mengintegrasikan frontend dengan backend sehingga core workflow berfungsi end-to-end.

## 2. Scope of Work

- Menghapus mock data.
- Mengintegrasikan habit services.
- Integrasi authentication.
- Data fetching.
- Form submission.
- Completion mutation.
- Progress synchronization.
- Error mapping.
- Loading states.
- Retry behavior.

## 3. Implementation Steps

### Step 1 — Review Backend Contracts

Pastikan:

- Request types.
- Response types.
- Validation schemas.
- Error responses.
- Authentication behavior.

### Step 2 — Replace Mock Data

Ganti mock implementation dengan data nyata.

Jangan menghapus mock sebelum memastikan backend tersedia.

### Step 3 — Integrate Habit CRUD

- Create.
- Read.
- Update.
- Delete.

### Step 4 — Integrate Tracking

- Mark completed.
- Undo completion.
- Update progress.
- Refresh statistics.

### Step 5 — Integrate Authentication

- Register.
- Login.
- Logout.
- Session persistence.
- Protected navigation.

### Step 6 — Handle UI States

- Loading.
- Error.
- Empty.
- Success.
- Retry.

### Step 7 — Verify End-to-End

Test alur:

```text
Register
  ↓
Login
  ↓
Create Habit
  ↓
View Dashboard
  ↓
Complete Habit
  ↓
Refresh Page
  ↓
Verify Persistence
  ↓
View Statistics
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Fullstack Developer.

Kerjakan PHASE 7 — Frontend & Backend Integration.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md

Tugas:
1. Review backend contracts.
2. Integrasikan frontend dengan backend.
3. Ganti mock data dengan implementasi nyata.
4. Integrasikan authentication.
5. Integrasikan habit CRUD.
6. Integrasikan completion tracking.
7. Integrasikan statistics.
8. Implementasikan loading states.
9. Implementasikan error handling.
10. Verifikasi data persistence.
11. Verifikasi user ownership.
12. Test seluruh core user flow.

Batasan:
- Jangan implementasikan fitur baru.
- Jangan menambahkan P1/P2.
- Jangan menghapus validasi.
- Jangan menggunakan mock sebagai production data.
- Jangan mengubah database schema tanpa alasan.

Acceptance criteria:
- Core flow berfungsi end-to-end.
- Data tersimpan.
- Data sinkron.
- Authentication berfungsi.
- Error states berfungsi.
- Tidak ada mock data production.
```

## 5. Expected Deliverables

- Integrated frontend.
- Integrated backend.
- Data persistence.
- Authentication flow.
- E2E core workflow.

## 6. Acceptance Criteria

- [ ] Login/register berfungsi.
- [ ] Create habit berfungsi.
- [ ] Update habit berfungsi.
- [ ] Delete habit berfungsi.
- [ ] Daily tracking berfungsi.
- [ ] Progress sinkron.
- [ ] Data persist setelah refresh.
- [ ] Statistics menggunakan data aktual.
- [ ] Mock data tidak digunakan pada production flow.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 7: frontend backend integration"
```

---

# PHASE 8 — Additional Features & Product Completion

## 1. Phase Objective

Menyelesaikan fitur pendukung P1 yang dipilih serta meningkatkan usability.

## 2. Scope of Work

Fitur yang dapat diimplementasikan:

- Habit category.
- Habit archive.
- Weekly statistics.
- Calendar view.
- Habit color.
- Dark mode.
- Dashboard filtering.
- Notes.

Tidak semua fitur wajib diimplementasikan.

## 3. Implementation Steps

### Step 1 — Review P1

Tentukan fitur yang memiliki nilai tertinggi.

### Step 2 — Update PRD Scope

Catat fitur P1 yang dipilih.

### Step 3 — Implement Features

Implementasikan fitur secara terpisah dan terukur.

### Step 4 — Update Data Model

Jika diperlukan:

- Schema changes.
- Migrations.
- Validation.
- API updates.

### Step 5 — Update UI

- Dashboard.
- Forms.
- Statistics.
- Navigation.
- Empty states.

### Step 6 — Regression Testing

Pastikan fitur P0 tetap berfungsi.

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior Fullstack Developer.

Kerjakan PHASE 8 — Additional Features & Product Completion.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md
- UI_UX_GUIDE.md

Tugas:
1. Review fitur P1 yang dipilih.
2. Implementasikan hanya fitur yang telah disetujui.
3. Update UI dan backend jika diperlukan.
4. Update database schema jika diperlukan.
5. Update validation dan business logic.
6. Update dokumentasi.
7. Pastikan responsive.
8. Jalankan regression tests.

Batasan:
- Jangan mengimplementasikan seluruh P1 secara otomatis.
- Jangan mengimplementasikan P2.
- Jangan mengubah core architecture.
- Jangan menghapus fitur P0.
- Jangan menambahkan dependency tanpa alasan.

Acceptance criteria:
- Fitur terpilih berfungsi.
- P0 tetap berfungsi.
- Tidak ada regression.
- Build berhasil.
```

## 5. Expected Deliverables

- Selected P1 features.
- Updated UI.
- Updated backend.
- Updated documentation.

## 6. Acceptance Criteria

- [ ] Fitur yang disetujui berfungsi.
- [ ] P0 tidak mengalami regression.
- [ ] UI responsive.
- [ ] Data persistence terjaga.
- [ ] Typecheck berhasil.
- [ ] Build berhasil.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 8: additional features"
```

---

# PHASE 9 — Testing, Security & Optimization

## 1. Phase Objective

Melakukan verifikasi kualitas, security, performance, dan stabilitas sebelum deployment.

## 2. Scope of Work

- Unit tests.
- Integration tests.
- E2E tests.
- Type checking.
- Linting.
- Build.
- Responsive testing.
- Security review.
- Performance review.
- Bug fixing.
- Test report.

## 3. Implementation Steps

### Step 1 — Install Testing Dependencies

Sesuaikan dengan kebutuhan:

```bash
npm install -D vitest
npm install -D @testing-library/react
npm install -D @testing-library/jest-dom
```

Untuk E2E:

```bash
npm install -D @playwright/test
npx playwright install
```

### Step 2 — Unit Testing

Test:

- Schedule calculation.
- Completion logic.
- Streak calculation.
- Progress calculation.
- Validation schemas.

### Step 3 — Integration Testing

Test:

- Database CRUD.
- Authentication.
- Habit ownership.
- Completion persistence.
- Statistics.

### Step 4 — E2E Testing

Test:

- Registration.
- Login.
- Create habit.
- Complete habit.
- Edit habit.
- Delete habit.
- Logout.

### Step 5 — Security Review

Periksa:

- Authorization.
- Input validation.
- Session handling.
- Environment variables.
- Data exposure.
- Error messages.

### Step 6 — Performance Review

Periksa:

- Database query efficiency.
- Component rendering.
- Bundle size.
- Loading performance.
- API latency.

### Step 7 — Run Verification

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Sesuaikan command test dengan scripts yang benar-benar tersedia.

### Step 8 — Generate Test Report

Buat:

```text
TEST_REPORT.md
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior QA Engineer dan Fullstack Developer.

Kerjakan PHASE 9 — Testing, Security & Optimization.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md

Tugas:
1. Review seluruh functional requirements.
2. Jalankan unit tests.
3. Jalankan integration tests.
4. Jalankan E2E tests jika tersedia.
5. Jalankan lint.
6. Jalankan typecheck.
7. Jalankan production build.
8. Lakukan security review.
9. Lakukan responsive review.
10. Lakukan performance review.
11. Perbaiki bugs yang ditemukan.
12. Buat TEST_REPORT.md.

Batasan:
- Jangan menambahkan fitur baru.
- Jangan mengubah scope.
- Jangan menghapus test untuk membuat build berhasil.
- Jangan mengarang hasil testing.
- Dokumentasikan test yang tidak dapat dijalankan.

Acceptance criteria:
- Critical bugs diperbaiki.
- Core tests pass.
- Build berhasil.
- Security review selesai.
- Test report tersedia.
```

## 5. Expected Deliverables

- Unit tests.
- Integration tests.
- E2E tests.
- Security review.
- Performance improvements.
- `TEST_REPORT.md`.

## 6. Acceptance Criteria

- [ ] Lint berhasil.
- [ ] Typecheck berhasil.
- [ ] Unit tests berhasil.
- [ ] Integration tests berhasil.
- [ ] E2E tests sesuai scope.
- [ ] Build berhasil.
- [ ] Critical security issues tidak ada.
- [ ] Responsive verification selesai.
- [ ] Test report tersedia.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 9: testing and optimization"
```

---

# PHASE 10 — Production Deployment & Release

## 1. Phase Objective

Melakukan deployment Habit Tracker ke production dan memverifikasi aplikasi dapat digunakan secara publik.

## 2. Scope of Work

- Production configuration.
- Environment variables.
- Database deployment.
- Hosting.
- Domain.
- DNS.
- HTTPS.
- Deployment.
- Monitoring.
- Backup.
- Smoke testing.
- Release documentation.

## 3. Implementation Steps

### Step 1 — Choose Hosting

Pilihan:

- Vercel untuk deployment Next.js.
- VPS dengan Node.js dan reverse proxy.
- Managed PostgreSQL.

Untuk MVP, managed hosting dapat mengurangi maintenance.

### Step 2 — Configure Environment

Contoh:

```env
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
```

Gunakan environment variables yang sesuai dengan versi Auth.js dan provider.

Jangan commit `.env`.

### Step 3 — Deploy Database

- Buat production database.
- Configure connection.
- Run migration.

```bash
npx prisma migrate deploy
```

### Step 4 — Configure Domain

- Configure DNS.
- Configure HTTPS.
- Verifikasi domain.
- Pastikan redirect HTTPS aktif.

### Step 5 — Deploy Application

```bash
npm run build
```

Deploy melalui hosting yang dipilih.

### Step 6 — Smoke Test

Verifikasi:

- Landing page.
- Register.
- Login.
- Dashboard.
- Create habit.
- Completion.
- Statistics.
- Logout.

### Step 7 — Monitoring & Backup

- Configure error monitoring.
- Configure database backup.
- Review logs.
- Document recovery procedure.

### Step 8 — Documentation

Buat:

```text
DEPLOYMENT_GUIDE.md
RELEASE_NOTES.md
```

## 4. AI Coding Assistant Prompt

```text
Kamu bertindak sebagai Senior DevOps Engineer dan Fullstack Developer.

Kerjakan PHASE 10 — Production Deployment & Release.

Baca:
- PROJECT_PRD_AND_PLAYBOOK.md
- TECHNICAL_PLAN.md
- TEST_REPORT.md

Tugas:
1. Review production configuration.
2. Review environment variables.
3. Review database deployment.
4. Review migration strategy.
5. Siapkan deployment.
6. Configure domain dan HTTPS jika tersedia.
7. Deploy application.
8. Jalankan production smoke tests.
9. Verifikasi authentication.
10. Verifikasi core habit workflow.
11. Verifikasi database persistence.
12. Dokumentasikan monitoring dan backup.
13. Buat DEPLOYMENT_GUIDE.md.
14. Buat RELEASE_NOTES.md.

Batasan:
- Jangan menampilkan secrets.
- Jangan commit environment files.
- Jangan menghapus database production.
- Jangan menjalankan destructive migration tanpa persetujuan.
- Jangan mengklaim deployment berhasil tanpa verifikasi aktual.
- Jangan mengubah architecture tanpa persetujuan.

Acceptance criteria:
- Production deployment tersedia.
- HTTPS aktif.
- Core workflow berfungsi.
- Database terkoneksi.
- Smoke tests berhasil.
- Dokumentasi tersedia.
```

## 5. Expected Deliverables

- Production application.
- Production database.
- HTTPS.
- Monitoring.
- Backup configuration.
- `DEPLOYMENT_GUIDE.md`.
- `RELEASE_NOTES.md`.

## 6. Acceptance Criteria

- [ ] Production build berhasil.
- [ ] Deployment berhasil.
- [ ] Domain aktif.
- [ ] HTTPS aktif.
- [ ] Register/login berfungsi.
- [ ] Habit CRUD berfungsi.
- [ ] Tracking berfungsi.
- [ ] Data persisten.
- [ ] Monitoring tersedia.
- [ ] Backup strategy tersedia.
- [ ] Dokumentasi release tersedia.

## 7. Git Checkpoint

```bash
git add .
git commit -m "phase 10: production deployment"
```

---

# PART C — GLOBAL AI CODING RULES

Gunakan instruksi berikut sebagai konteks umum setiap kali memulai phase.

## C.1 Global Prompt

```text
Kamu bertindak sebagai Senior Fullstack Developer.

Project:
Habit Tracker

Dokumen utama:
PROJECT_PRD_AND_PLAYBOOK.md

Technical reference:
TECHNICAL_PLAN.md

UI/UX reference:
UI_UX_GUIDE.md

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma
- Auth.js

Development approach:
- Solo developer
- AI-assisted development
- MVP first
- Clean architecture pragmatis
- Maintainable code
- Reusable components
- Avoid over-engineering

Aturan kerja:

1. Baca PRD terlebih dahulu.
2. Baca technical plan jika sudah tersedia.
3. Baca UI/UX guide jika relevan.
4. Kerjakan hanya phase yang diminta.
5. Periksa struktur dan kondisi project sebelum mengubah file.
6. Jangan menimpa pekerjaan yang sudah ada tanpa alasan.
7. Jangan mengubah tech stack tanpa persetujuan.
8. Jangan menambahkan dependency yang tidak diperlukan.
9. Jangan membuat fitur di luar scope phase.
10. Jangan menggunakan mock data sebagai production data.
11. Jangan mengarang hasil testing.
12. Jalankan command testing dan build yang relevan.
13. Jika keputusan penting belum jelas, ajukan pertanyaan.
14. Jangan melanjutkan ke phase berikutnya secara otomatis.
15. Laporkan file yang dibuat dan diubah.
16. Laporkan dependency yang ditambahkan.
17. Laporkan hasil testing aktual.
18. Jangan melakukan destructive database operation tanpa persetujuan.
19. Jangan menampilkan environment secrets.
20. Gunakan Git checkpoint sesuai playbook.

Setelah phase selesai, berikan laporan:

PHASE:
Status:

IMPLEMENTATION:
- ...

FILES CREATED:
- ...

FILES MODIFIED:
- ...

DEPENDENCIES:
- ...

TESTING:
- ...

ACCEPTANCE CRITERIA:
- Passed:
- Failed:
- Not tested:

ISSUES:
- ...

GIT CHECKPOINT:
- Commit recommendation:

NEXT STEP:
- Menunggu persetujuan untuk phase berikutnya.
```

## C.2 Phase Execution Rules

- Setiap phase dijalankan secara terpisah.
- AI tidak boleh mengerjakan seluruh phase sekaligus.
- Review hasil setiap phase.
- Perbaiki acceptance criteria yang gagal.
- Commit setelah phase selesai.
- Lanjut hanya setelah mendapat persetujuan.

---

# PART D — GIT & EXECUTION RULES

## D.1 Initial Repository

```bash
git init
git branch -M main
```

## D.2 Git Checkpoint

| Phase    | Commit                                  |
| -------- | --------------------------------------- |
| Phase 1  | `phase 1: project bootstrap`            |
| Phase 2  | `phase 2: technical architecture`       |
| Phase 3  | `phase 3: ui ux planning`               |
| Phase 4  | `phase 4: frontend foundation`          |
| Phase 5  | `phase 5: core frontend features`       |
| Phase 6  | `phase 6: backend implementation`       |
| Phase 7  | `phase 7: frontend backend integration` |
| Phase 8  | `phase 8: additional features`          |
| Phase 9  | `phase 9: testing and optimization`     |
| Phase 10 | `phase 10: production deployment`       |

## D.3 Commit Procedure

Sebelum commit:

```bash
git status
git diff
```

Jalankan verification:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Jika seluruh pemeriksaan yang diwajibkan berhasil:

```bash
git add .
git commit -m "phase 1: project bootstrap"
```

Sesuaikan pesan commit dengan phase.

## D.4 Git Rules

- Jangan commit `.env`.
- Jangan commit secrets.
- Jangan commit file temporary.
- Jangan melakukan commit jika perubahan belum direview.
- Jangan menggabungkan beberapa phase ke satu commit jika dapat dihindari.
- Jangan menghapus checkpoint sebelumnya.

---

# PART E — COMMAND CHEAT SHEET

## E.1 Development

```bash
npm run dev
```

## E.2 Lint

```bash
npm run lint
```

## E.3 TypeScript

```bash
npx tsc --noEmit
```

## E.4 Production Build

```bash
npm run build
```

## E.5 shadcn/ui

```bash
npx shadcn@latest add button card input label checkbox dialog
```

## E.6 Prisma

```bash
npx prisma init
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio
```

## E.7 Production Migration

```bash
npx prisma migrate deploy
```

## E.8 Testing

```bash
npm test
```

## E.9 Git

```bash
git status
git add .
git commit -m "phase 1: project bootstrap"
git log --oneline
```

---

# PART F — FINAL CHECKLIST & DOCUMENTATION

## F.1 Development Checklist

### Phase 1 — Bootstrap

- [ ] Environment siap.
- [ ] Next.js siap.
- [ ] TypeScript siap.
- [ ] Tailwind siap.
- [ ] shadcn/ui siap.
- [ ] Build berhasil.

### Phase 2 — Architecture

- [ ] Technical plan tersedia.
- [ ] Folder structure ditentukan.
- [ ] Data model ditentukan.
- [ ] API strategy ditentukan.
- [ ] Security strategy ditentukan.

### Phase 3 — UI/UX

- [ ] Design direction ditentukan.
- [ ] Design tokens tersedia.
- [ ] Responsive layout ditentukan.
- [ ] UI states ditentukan.

### Phase 4 — Frontend Foundation

- [ ] App shell selesai.
- [ ] Navigation selesai.
- [ ] Routes tersedia.
- [ ] Reusable components tersedia.

### Phase 5 — Core Frontend

- [ ] Dashboard selesai.
- [ ] Habit CRUD UI selesai.
- [ ] Tracking UI selesai.
- [ ] Statistics UI selesai.

### Phase 6 — Backend

- [ ] Database tersedia.
- [ ] Authentication tersedia.
- [ ] Habit CRUD tersedia.
- [ ] Completion logic tersedia.
- [ ] Business logic tests tersedia.

### Phase 7 — Integration

- [ ] Frontend terintegrasi.
- [ ] Authentication terintegrasi.
- [ ] Data persistence berfungsi.
- [ ] Core flow berfungsi end-to-end.

### Phase 8 — Additional Features

- [ ] Fitur P1 yang disetujui selesai.
- [ ] P0 tetap berfungsi.
- [ ] Tidak ada regression.

### Phase 9 — Testing

- [ ] Unit tests selesai.
- [ ] Integration tests selesai.
- [ ] E2E tests selesai.
- [ ] Security review selesai.
- [ ] Build berhasil.
- [ ] Test report tersedia.

### Phase 10 — Deployment

- [ ] Production deployment tersedia.
- [ ] HTTPS aktif.
- [ ] Domain aktif.
- [ ] Database production tersedia.
- [ ] Smoke tests berhasil.
- [ ] Monitoring tersedia.
- [ ] Backup tersedia.
- [ ] Release notes tersedia.

## F.2 Final Documentation

File dokumentasi akhir:

```text
PROJECT_PRD_AND_PLAYBOOK.md
TECHNICAL_PLAN.md
UI_UX_GUIDE.md
TEST_REPORT.md
DEPLOYMENT_GUIDE.md
RELEASE_NOTES.md
```

## F.3 Final Definition of Done

Project dinyatakan selesai apabila:

1. Seluruh 10 phase telah diselesaikan dan direview.
2. Seluruh core functional requirements terpenuhi.
3. Acceptance criteria telah diverifikasi.
4. Tidak ada critical atau high severity bugs yang belum ditangani.
5. Testing dan build berhasil.
6. Security dan authorization telah diverifikasi.
7. Aplikasi dapat digunakan secara publik.
8. Deployment terdokumentasi.
9. Git repository memiliki checkpoint yang jelas.
10. Project siap untuk pengembangan berikutnya.

---

**END OF DOCUMENT**
