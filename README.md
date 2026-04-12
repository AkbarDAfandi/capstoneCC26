# FreelanceHub

Platform freelance berbasis web yang menghubungkan siswa SMK dengan klien yang membutuhkan jasa sesuai keahlian jurusan mereka. Proyek ini dikembangkan sebagai Capstone Project untuk program Dicoding Coding Camp 2026 oleh tim CC26-PS101.

## Latar Belakang

Banyak siswa SMK yang sudah memiliki keterampilan teknis namun belum punya wadah untuk menyalurkannya secara profesional. FreelanceHub hadir sebagai solusi agar siswa SMK bisa mendapatkan pengalaman kerja, membangun portofolio, dan memperoleh penghasilan sejak masih bersekolah. Kategori proyek disesuaikan dengan jurusan-jurusan yang ada di SMK seperti RPL, Multimedia, TKJ, Akuntansi, dan Pemasaran.

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Variabel Environment](#variabel-environment)
- [Struktur Direktori](#struktur-direktori)
- [API Endpoints](#api-endpoints)
- [Skema Database](#skema-database)
- [Panduan Penggunaan](#panduan-penggunaan)
- [Troubleshooting](#troubleshooting)

## Fitur

### Autentikasi
- Registrasi dengan pilihan peran (Freelancer atau Client)
- Verifikasi email otomatis menggunakan Resend
- Login dengan JWT (JSON Web Token)
- Proteksi rute berdasarkan peran pengguna
- Password di-hash menggunakan bcrypt

### Manajemen Profil
- Edit profil pengguna (nama, bio, jurusan SMK, skills, portfolio URL, tarif per jam)
- Halaman profil publik
- Tampilan yang berbeda untuk freelancer dan client

### Manajemen Proyek (Sisi Client)
- Membuat proyek baru dengan kategori, budget, dan deadline
- Mengelola daftar proyek yang sudah dibuat
- Mengubah status proyek (Open, In Progress, Closed)
- Mengedit dan menghapus proyek
- Melihat lamaran masuk dan menerima atau menolak freelancer

### Lamaran (Sisi Freelancer)
- Mengirim proposal dan penawaran harga ke proyek
- Melihat status lamaran (Pending, Accepted, Rejected)
- Membatalkan lamaran yang sudah dikirim

### Sistem Review
- Client dan freelancer bisa saling memberikan rating (1-5) dan komentar
- Statistik ulasan berupa rata-rata rating dan distribusi bintang
- Satu review per reviewer per proyek

### Lainnya
- Dark mode dengan preferensi tersimpan di localStorage
- Dashboard dengan statistik dan grafik untuk masing-masing peran
- Halaman jelajah proyek dengan filter kategori dan pencarian

## Tech Stack

**Frontend:**
- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Axios
- Lucide React (ikon)
- SweetAlert2

**Backend:**
- Node.js
- Express 5
- Prisma ORM v7 (dengan adapter PostgreSQL)
- JSON Web Token (jsonwebtoken)
- bcryptjs
- Resend (email service)

**Database:**
- PostgreSQL (di-host melalui Supabase)

## Prasyarat

Sebelum memulai, pastikan perangkat lunak berikut sudah terinstal:

- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru (biasanya sudah terinstal bersama Node.js)
- Git
- PostgreSQL versi 15 atau lebih baru (atau bisa menggunakan Supabase sebagai alternatif cloud)

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/akbardafandi/capstonecc26.git
cd capstonecc26
```

### 2. Instal dependensi backend

```bash
npm install
```

### 3. Instal dependensi frontend

```bash
cd frontend
npm install
cd ..
```

### 4. Buat file environment

Buat file `.env` di root project (sejajar dengan `package.json` backend) dengan isi sebagai berikut:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
JWT_SECRET="ganti_dengan_secret_key_anda"
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
APP_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
```

Sesuaikan nilai-nilai di atas dengan credential database dan API key milik Anda. Jangan commit file ini ke repository.

### 5. Setup database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Perintah pertama akan men-generate Prisma Client, sedangkan perintah kedua akan membuat tabel-tabel yang dibutuhkan di database.

### 6. Setup Resend (opsional, untuk fitur email verifikasi)

1. Daftar akun di https://resend.com
2. Buat API Key baru
3. Masukkan API Key tersebut ke variabel `RESEND_API_KEY` di file `.env`

Jika tidak menggunakan Resend, fitur verifikasi email tidak akan berfungsi, tetapi fitur lainnya tetap berjalan.

## Menjalankan Proyek

Perlu dua terminal yang berjalan bersamaan.

**Terminal 1 - Backend:**

```bash
npm start
```

Backend akan berjalan di `http://localhost:3000`.

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`. Buka alamat tersebut di browser untuk mengakses aplikasi.

**Build production (frontend):**

```bash
cd frontend
npm run build
npm run preview
```

## Variabel Environment

| Variabel | Keterangan |
|----------|------------|
| `DATABASE_URL` | Connection string PostgreSQL melalui connection pooling |
| `DIRECT_URL` | Connection string PostgreSQL langsung, digunakan untuk migrasi Prisma |
| `JWT_SECRET` | Secret key untuk signing JWT token |
| `RESEND_API_KEY` | API key dari Resend untuk pengiriman email verifikasi |
| `APP_URL` | Base URL backend server |
| `CLIENT_URL` | Base URL frontend, digunakan untuk link verifikasi di email |

## Struktur Direktori

```
capstonecc26/
├── .env
├── .gitignore
├── package.json
├── schema.prisma
├── prisma.config.js
│
├── src/
│   ├── server.js                       # Entry point Express
│   ├── routes.js                       # Definisi API routes
│   ├── controllers.js                  # Handler untuk setiap endpoint
│   └── middleware/
│       ├── auth.js                     # Middleware autentikasi dan otorisasi
│       └── sendVerificationEmail.js    # Service pengiriman email via Resend
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx                     # Root component dan routing
        ├── App.css
        ├── index.css
        ├── api/
        │   └── koneksi.js              # Axios instance dengan interceptor token
        ├── assets/                     # Logo dan gambar
        ├── components/
        │   ├── Navbar.jsx
        │   └── dashboard/
        │       ├── KartuStat.jsx       # Komponen kartu statistik
        │       ├── GrafikBar.jsx       # Komponen grafik batang
        │       └── CincinProgres.jsx   # Komponen progress circle
        ├── context/
        │   └── ThemeContext.jsx         # Context untuk dark/light mode
        └── pages/
            ├── auth/
            │   ├── Login.jsx
            │   ├── Register.jsx
            │   └── VerifyEmail.jsx
            ├── public/
            │   ├── Home.jsx            # Landing page
            │   ├── Projects.jsx        # Daftar proyek publik
            │   ├── ProjectDetail.jsx   # Detail proyek dan form lamaran
            │   └── Profile.jsx         # Profil publik user
            ├── client/
            │   ├── DashboardClient.jsx
            │   └── Tab/
            │       ├── TabBuatProyek.jsx
            │       ├── TabProyekKu.jsx
            │       └── TabProfilKlien.jsx
            └── freelancer/
                ├── DashboardFreelancer.jsx
                └── Tab/
                    ├── TabRingkasan.jsx
                    ├── TabLamaran.jsx
                    ├── TabUlasan.jsx
                    └── TabPengaturan.jsx
```

## API Endpoints

Base URL: `http://localhost:3000`

### Autentikasi

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| POST | /register | Tidak | Registrasi user baru |
| POST | /login | Tidak | Login dan mendapatkan token |
| GET | /verify-email?token=xxx | Tidak | Verifikasi email |

### User

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | /users/:id | Tidak | Melihat profil user |
| PUT | /users/:id | Ya | Mengupdate profil sendiri |

### Project

| Method | Endpoint | Auth | Role | Keterangan |
|--------|----------|------|------|------------|
| GET | /projects | Tidak | - | Melihat semua proyek |
| GET | /projects/:id | Tidak | - | Melihat detail proyek |
| POST | /projects | Ya | Client | Membuat proyek baru |
| PUT | /projects/:id | Ya | Client | Mengedit proyek sendiri |
| DELETE | /projects/:id | Ya | Client | Menghapus proyek sendiri |

### Application (Lamaran)

| Method | Endpoint | Auth | Role | Keterangan |
|--------|----------|------|------|------------|
| GET | /applications | Ya | Semua | Melihat lamaran sesuai role |
| POST | /applications | Ya | Freelancer | Mengirim lamaran |
| PUT | /applications/:id | Ya | Client | Menerima atau menolak lamaran |
| DELETE | /applications/:id | Ya | Freelancer | Membatalkan lamaran sendiri |

### Review

| Method | Endpoint | Auth | Keterangan |
|--------|----------|------|------------|
| GET | /reviews | Tidak | Melihat semua review |
| POST | /reviews | Ya | Membuat review |
| DELETE | /reviews/:id | Ya | Menghapus review sendiri |

### Contoh Request

Registrasi:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Budi Santoso",
    "email": "budi@gmail.com",
    "password": "password123",
    "role": "freelancer",
    "bio": "Siswa RPL kelas 12",
    "smkMajor": "RPL",
    "skills": "JavaScript, React, Node.js"
  }'
```

Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@gmail.com",
    "password": "password123"
  }'
```

Membuat proyek (memerlukan token):
```bash
curl -X POST http://localhost:3000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ANDA" \
  -d '{
    "title": "Website Sekolah",
    "description": "Pembuatan website profil sekolah yang responsif",
    "category": "Web Development",
    "budgetMin": 500000,
    "budgetMax": 1500000,
    "deadline": "2026-05-01"
  }'
```

## Skema Database

Database terdiri dari 5 tabel utama:

### Tabel users
Menyimpan data semua pengguna, baik freelancer maupun client. Field khusus freelancer (skills, smkMajor, hourlyRate, portfolioUrl) bernilai null untuk client.

### Tabel verification_tokens
Menyimpan token verifikasi email. Dibuat saat registrasi dan dihapus setelah email berhasil diverifikasi. Token berlaku selama 24 jam.

### Tabel projects
Menyimpan data proyek yang dibuat oleh client. Setiap proyek memiliki kategori yang disesuaikan dengan keahlian jurusan SMK, budget range, deadline, dan status.

### Tabel applications
Menyimpan lamaran dari freelancer ke proyek. Satu freelancer hanya bisa melamar satu kali per proyek. Status lamaran bisa berupa pending, accepted, atau rejected.

### Tabel reviews
Menyimpan ulasan antar pengguna. Mendukung dua arah (client ke freelancer dan sebaliknya). Satu reviewer hanya bisa memberi satu review per proyek.

## Panduan Penggunaan

### Untuk Client

1. Buka halaman Register dan pilih peran "Client"
2. Isi data yang diminta lalu klik daftar
3. Buka email dan klik link verifikasi yang dikirim
4. Login dengan email dan password yang sudah didaftarkan
5. Masuk ke Dashboard Client, lalu buat proyek baru di tab "Buat Proyek"
6. Lihat proyek yang sudah dibuat di tab "ProyekKu"
7. Ketika ada freelancer yang melamar, review lamaran tersebut lalu terima atau tolak
8. Setelah proyek selesai, berikan rating dan review ke freelancer

### Untuk Freelancer

1. Buka halaman Register dan pilih peran "Freelancer"
2. Isi data diri beserta keahlian dan jurusan SMK
3. Buka email dan klik link verifikasi
4. Login ke akun
5. Buka halaman Proyek untuk melihat proyek-proyek yang tersedia
6. Klik salah satu proyek untuk melihat detail, lalu kirim lamaran dengan proposal dan harga penawaran
7. Pantau status lamaran di Dashboard Freelancer tab "Lamaran"
8. Lihat ulasan dari client di tab "Ulasan"
9. Update profil dan keahlian di tab "Pengaturan"

### Daftar Halaman

| Halaman | URL |
|---------|-----|
| Landing Page | / |
| Login | /login |
| Register | /register |
| Verifikasi Email | /verify-email |
| Daftar Proyek | /projects |
| Detail Proyek | /projects/:id |
| Profil User | /profile/:id |
| Dashboard Client | /dashboard/client |
| Dashboard Freelancer | /dashboard/freelancer |

## Troubleshooting

**Error ECONNREFUSED saat mengakses API**
Pastikan backend sudah berjalan di port 3000. Periksa juga apakah file `.env` sudah dibuat dengan benar.

**Error P1001: Can't reach database server**
Periksa apakah `DATABASE_URL` di file `.env` sudah benar. Jika menggunakan Supabase, pastikan koneksi internet stabil dan project Supabase dalam kondisi aktif.

**Error Prisma Client not generated**
Jalankan perintah `npx prisma generate` terlebih dahulu sebelum menjalankan server.

**Email verifikasi tidak terkirim**
Pastikan `RESEND_API_KEY` yang dimasukkan valid. Pada mode development, Resend sandbox hanya bisa mengirim email ke alamat yang sudah didaftarkan.

**Halaman kosong setelah login**
Pastikan backend dan frontend berjalan bersamaan. Buka DevTools browser (F12) untuk melihat pesan error di console.

Proyek ini dibuat sebagai bagian dari Program Capstone Dicoding Coding Camp 2026.
