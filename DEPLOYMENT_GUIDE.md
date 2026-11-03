# PRODUCTION DEPLOYMENT GUIDE — HABIT TRACKER

**Dokumen Referensi Utama**: [PRD and Playbook.md](./PRD%20and%20Playbook.md)  
**Versi Aplikasi**: 1.0.0  
**Tanggal**: 2026-11-03  
**Status**: APPROVED — Release Guide (Phase 10 Deliverable)  

---

## 1. Overview & Architecture Summary

Habit Tracker dibangun sebagai aplikasi **Modular Monolith** menggunakan **Next.js 16+ App Router** dengan **Prisma ORM** dan **PostgreSQL**. Panduan ini mencakup langkah-langkah rilis ke lingkungan produksi (*zero-downtime deployment*), konfigurasi variabel lingkungan yang aman, eksekusi migrasi database, strategi backup otomatis, pemantauan kesehatan (*healthcheck*), dan prosedur pemulihan bencana (*disaster recovery*).

---

## 2. Production Environment Variables

Buat file `.env.production` atau konfigurasi variabel berikut di dashboard penyedia hosting Anda (Vercel, Railway, Render, dll.):

```env
# ==========================================
# RUNTIME & ENVIRONMENT
# ==========================================
NODE_ENV="production"
PORT="3000"

# ==========================================
# DATABASE CONNECTION (POSTGRESQL)
# ==========================================
# Gunakan connection pooling jika menggunakan serverless (misal Supabase / Neon / AWS RDS)
DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DB_NAME]?schema=public&sslmode=require"

# ==========================================
# AUTHENTICATION & SECURITY
# ==========================================
# Generate secret acak minimal 32 karakter: openssl rand -base64 32
AUTH_SECRET="your_generated_cryptographically_secure_random_string_32_chars_min"

# Canonical Production URL (Wajib menggunakan awalan https://)
NEXTAUTH_URL="https://habittracker.yourdomain.com"
AUTH_URL="https://habittracker.yourdomain.com"
```

> [!CAUTION]
> Jangan pernah mengunggah atau melakukan `git commit` file `.env` atau `.env.production` ke repositori publik. Selalu gunakan secret manager atau dashboard environment variable hosting.

---

## 3. Database Deployment & Migration Strategy

### 3.1 Provisioning PostgreSQL
Pastikan database production menggunakan PostgreSQL versi 15 atau 16. Penyedia managed database yang direkomendasikan:
- **Supabase** (Free/Pro tier managed Postgres)
- **Neon** (Serverless autoscaling Postgres)
- **Railway / Render** (Managed Postgres addon)
- **AWS RDS / DigitalOcean Managed Databases**

### 3.2 Automated Database Migration
Saat deployment rilis, migrasi database dijalankan tanpa interaksi manusia menggunakan perintah:
```bash
npm run db:migrate
# atau: npx prisma migrate deploy
```
Perintah ini membaca folder `prisma/migrations/` dan mengeksekusi migrasi yang belum terpasang ke database target tanpa menghapus atau memodifikasi data yang sudah ada (*non-destructive*).

---

## 4. Hosting & Deployment Options

### Opsi A — Deployment ke Vercel (Rekomendasi untuk Next.js)
1. Sambungkan repositori GitHub ke akun Vercel Anda.
2. Pada **Project Settings > Build & Development Settings**:
   - Framework Preset: `Next.js`
   - Build Command: `npm run db:migrate && npm run build`
   - Output Directory: `.next`
3. Tambahkan environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`
4. Tekan **Deploy**. Vercel akan otomatis meng-compile halaman, mengaktifkan edge middleware, dan menerapkan caching CDN global.

### Opsi B — Deployment ke Docker / VPS (Self-Hosted)
Gunakan `Dockerfile` multi-stage build untuk menghasilkan container yang ringan:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 5. Custom Domain, DNS & SSL/HTTPS

1. **DNS Configuration**:
   - Jika menggunakan root domain: tambahkan `A Record` mengarah ke IP Server atau `ALIAS/ANAME` ke hosting.
   - Jika menggunakan subdomain (`habittracker.domain.com`): tambahkan `CNAME Record` mengarah ke target hosting (contoh: `cname.vercel-dns.com`).
2. **Automated SSL/TLS**:
   - Vercel, Railway, dan Cloudflare secara otomatis menerbitkan sertifikat Let's Encrypt dengan enkripsi TLS 1.3.
3. **Enforce HTTPS**:
   - Seluruh request HTTP biasa dialihkan otomatis ke HTTPS (`301 Moved Permanently`).
   - Cookie sesi `habit_auth_session` bertanda `Secure; HttpOnly; SameSite=Lax`.

---

## 6. Healthcheck & Production Monitoring

### 6.1 Endpoint Healthcheck
Aplikasi menyediakan endpoint live verification di `/api/health`:
- **URL**: `https://yourdomain.com/api/health`
- **Method**: `GET`
- **Response Normal (200 OK)**:
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2026-11-03T06:39:25.548Z",
    "version": "1.0.0"
  }
  ```
- **Response Gagal (503 Service Unavailable)**:
  ```json
  {
    "status": "unhealthy",
    "database": "disconnected",
    "timestamp": "2026-11-03T06:39:25.548Z",
    "error": "Database connectivity check failed"
  }
  ```

### 6.2 Monitoring Services
Pasang layanan uptime monitoring gratis/berbayar untuk memantau `/api/health` setiap 1–5 menit:
- **BetterStack (Uptime)** / **UptimeRobot** / **Checkly**
- Alerting via Email, Slack, atau Telegram jika uptime turun di bawah 99.9%.

---

## 7. Database Backup & Disaster Recovery

### 7.1 Automated Daily Backup Script
Jalankan cron job harian pada server database untuk mengekspor data terkompresi:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/habit-tracker"
mkdir -p $BACKUP_DIR

# Ekspor database menggunakan pg_dump
pg_dump -U postgres -d habit_tracker -F c -b -v -f "$BACKUP_DIR/habit_backup_$TIMESTAMP.dump"

# Hapus backup yang lebih tua dari 14 hari
find $BACKUP_DIR -type f -name "*.dump" -mtime +14 -exec rm {} +
```

### 7.2 Prosedur Pemulihan (Restoration Procedure)
Jika terjadi insiden data loss atau korupsi data:
```bash
# 1. Hentikan aplikasi sementara (maintenance mode)
# 2. Restore file dump ke database target
pg_restore -U postgres -d habit_tracker -v "/var/backups/habit-tracker/habit_backup_YYYYMMDD_HHMMSS.dump"
# 3. Jalankan migrasi jika versi skema telah diperbarui
npx prisma migrate deploy
# 4. Hidupkan kembali aplikasi dan verifikasi via /api/health
```

---

## 8. Rollback Strategy

1. **Instant Git Rollback (Vercel/Hosting Platform)**:
   - Jika rilis bermasalah, buka menu **Deployments** di dashboard hosting, pilih deployment versi stabil sebelumnya, lalu klik **Promote to Production**. Pengalihan trafik berlangsung seketika tanpa jeda waktu *downtime*.
2. **Database Backward Compatibility**:
   - Jangan melakukan penghapusan kolom (*drop column*) yang masih dibaca oleh versi aplikasi sebelumnya dalam satu rilis yang sama. Terapkan prinsip *Expand and Contract*.

