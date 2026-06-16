<div align="center">

# 🔐 Aplikasi S-DES Calculator

### Simplified Data Encryption Standard

![S-DES](https://img.shields.io/badge/S--DES-Kriptografi-FFD600?style=for-the-badge&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

> Aplikasi web simulasi kriptografi **S-DES** dengan visualisasi setiap langkah perhitungan secara lengkap, rinci, dan interaktif — dirancang untuk keperluan **pembelajaran kriptografi**.

🌐 **[www.s-desputraaliansyah.my.id](http://www.s-desputraaliansyah.my.id)**

</div>

---

## 📖 Deskripsi

**S-DES (Simplified Data Encryption Standard)** adalah versi penyederhanaan dari algoritma DES (*Data Encryption Standard*) yang dirancang khusus untuk keperluan edukasi kriptografi. Algoritma ini menggunakan:

- 🔤 **Plaintext / Ciphertext:** 8-bit
- 🔑 **Kunci:** 10-bit
- 🔄 **Jumlah Round:** 2 putaran

Aplikasi ini memvisualisasikan **setiap langkah perhitungan** mulai dari pembangkitan kunci (Key Generation), proses enkripsi/dekripsi per-round, hingga output akhir — lengkap dengan representasi bit dalam kotak visual.

---

## ✨ Fitur

- 🔒 **Enkripsi** — mengenkripsi 8-bit plaintext menjadi ciphertext
- 🔓 **Dekripsi** — mendekripsi 8-bit ciphertext kembali ke plaintext
- 🔑 **Key Generation** — visualisasi pembangkitan subkunci K1 dan K2
- 📊 **Step-by-Step** — setiap langkah ditampilkan dengan bit box berwarna
- 👁️ **Toggle Solusi** — tampilkan / sembunyikan detail perhitungan
- ✅ **Live Preview** — preview bit real-time saat mengetik input
- ✅ **Validasi Input** — pesan error jika input tidak valid
- 📱 **Responsif** — mendukung tampilan desktop dan mobile

---

## 🖼️ Tampilan

```
╔══════════════════════════════════════════════════════╗
║  🔐 S-DES  │  Simplified Data Encryption Standard   ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  [01] Plaintext / Ciphertext (8-bit biner)           ║
║  ┌──────────────────────────────────┐               ║
║  │  1 0 1 1 0 1 0 0                │  8/8          ║
║  └──────────────────────────────────┘               ║
║  [1][0][1][1][0][1][0][0]  ← bit preview            ║
║                                                      ║
║  [02] Kunci / Key (10-bit biner)                     ║
║  ┌──────────────────────────────────┐               ║
║  │  1 0 1 0 0 0 0 0 1 0            │  10/10        ║
║  └──────────────────────────────────┘               ║
║                                                      ║
║  [03] Mode:  [ 🔒 Enkripsi ]  [ 🔓 Dekripsi ]       ║
║                                                      ║
║         [ ▶ PROSES ]   [ ↺ RESET ]                  ║
║                                                      ║
╠══════════════════════════════════════════════════════╣
║  ✅ HASIL ENKRIPSI                                   ║
║  Input  →  [1][0][1][1][0][1][0][0]                 ║
║  Output →  [0][1][1][1][0][1][0][0]                 ║
╠══════════════════════════════════════════════════════╣
║  ▼ Tampilkan Solusi Penyelesaian (Step-by-Step)      ║
║                                                      ║
║  A. Key Generation                                   ║
║     Step 1 – Permutasi P10                           ║
║     Step 2 – Pembagian Kiri & Kanan                  ║
║     Step 3 – Left Shift-1 (LS-1)                     ║
║     Step 4 – Permutasi P8 → K1                       ║
║     Step 5 – Left Shift-2 (LS-2)                     ║
║     Step 6 – Permutasi P8 → K2                       ║
║                                                      ║
║  B. Proses Enkripsi                                  ║
║     Step 7  – Initial Permutation (IP)               ║
║     Step 8  – Pembagian L dan R                      ║
║     ┌─ Round Function 1 (K1) ──────────────────┐    ║
║     │  Step 9  – Expansion Permutation (EP)    │    ║
║     │  Step 10 – XOR dengan K1                 │    ║
║     │  Step 11 – Split untuk S-Box             │    ║
║     │  Step 12 – S-Box S0                      │    ║
║     │  Step 13 – S-Box S1                      │    ║
║     │  Step 14 – Permutasi P4                  │    ║
║     │  Step 15 – XOR P4 dengan L               │    ║
║     │  Step 16 – SWAP                          │    ║
║     └───────────────────────────────────────────┘   ║
║     ┌─ Round Function 2 (K2) ──────────────────┐    ║
║     │  Step 17–23 (sama, tanpa SWAP)           │    ║
║     └───────────────────────────────────────────┘   ║
║     Step 24 – Inverse IP⁻¹ → Ciphertext             ║
╚══════════════════════════════════════════════════════╝
```

---

## ⚙️ Algoritma S-DES

### Tabel Permutasi

| Nama | Tabel |
|------|-------|
| **P10** | `[3, 5, 2, 7, 4, 10, 1, 9, 8, 6]` |
| **P8** | `[6, 3, 7, 4, 8, 5, 10, 9]` |
| **IP** | `[2, 6, 3, 1, 4, 8, 5, 7]` |
| **IP⁻¹** | `[4, 1, 3, 5, 7, 2, 8, 6]` |
| **EP** | `[4, 1, 2, 3, 2, 3, 4, 1]` |
| **P4** | `[2, 4, 3, 1]` |

### S-Box

**S0**

|  | 00 | 01 | 10 | 11 |
|--|----|----|----|----|
| **00** | 1 | 0 | 3 | 2 |
| **01** | 3 | 2 | 1 | 0 |
| **10** | 0 | 2 | 1 | 3 |
| **11** | 3 | 1 | 3 | 2 |

**S1**

|  | 00 | 01 | 10 | 11 |
|--|----|----|----|----|
| **00** | 0 | 1 | 2 | 3 |
| **01** | 2 | 0 | 1 | 3 |
| **10** | 3 | 0 | 1 | 0 |
| **11** | 2 | 1 | 0 | 3 |

### Alur Proses

```
Enkripsi:                          Dekripsi:
Plaintext (8-bit)                  Ciphertext (8-bit)
      │                                   │
    [ IP ]                             [ IP ]
      │                                   │
   L     R                            L     R
      │                                   │
  ┌── Round 1 (K1) ──┐           ┌── Round 1 (K2) ──┐
  │ EP→XOR K1→S0S1→P4│           │ EP→XOR K2→S0S1→P4│
  │ XOR L → SWAP     │           │ XOR L → SWAP     │
  └──────────────────┘           └──────────────────┘
      │                                   │
  ┌── Round 2 (K2) ──┐           ┌── Round 2 (K1) ──┐
  │ EP→XOR K2→S0S1→P4│           │ EP→XOR K1→S0S1→P4│
  │ XOR L (no swap)  │           │ XOR L (no swap)  │
  └──────────────────┘           └──────────────────┘
      │                                   │
   [ IP⁻¹ ]                          [ IP⁻¹ ]
      │                                   │
Ciphertext (8-bit)                 Plaintext (8-bit)
```

---

## 🗂️ Struktur Proyek

```
Aplikasi-S-DES/
│
├── 📄 index.html       → Halaman utama (struktur HTML5)
├── 🎨 style.css        → Stylesheet tema kuning-hitam-putih
├── ⚙️  sdes.js          → Implementasi algoritma S-DES murni
├── 🖥️  app.js           → Logika UI dan rendering step-by-step
└── 📖 README.md        → Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan

### Opsi 1 — Buka Langsung (Tanpa Server)

```bash
# Clone repositori
git clone https://github.com/putraalsyah/Aplikasi-S-DES.git

# Masuk ke folder
cd Aplikasi-S-DES

# Buka index.html di browser favorit Anda
# (klik dua kali file index.html)
```

### Opsi 2 — Dengan Live Server (VS Code)

```bash
# Install ekstensi Live Server di VS Code
# Klik kanan index.html → "Open with Live Server"
```

### Contoh Penggunaan

| Field | Contoh Nilai |
|-------|-------------|
| Plaintext | `10110100` |
| Kunci | `1010000010` |
| Mode | Enkripsi |
| Output | *(lihat di aplikasi)* |

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Kegunaan |
|-----------|----------|
| **HTML5** | Struktur halaman semantik |
| **CSS3** | Styling, animasi, Grid & Flexbox |
| **JavaScript (Vanilla)** | Logika algoritma S-DES & interaksi UI |
| **Google Fonts** | JetBrains Mono + Inter |

> ⚡ Tidak memerlukan framework, library eksternal, atau server backend — murni frontend!

---

## 📚 Referensi

- Schaefer, E.F. (1996). *A Simplified Data Encryption Standard Algorithm*. Cryptologia, 20(1), 77–84.
- Stallings, W. *Cryptography and Network Security: Principles and Practice* (7th ed.)
- [Wikipedia — Data Encryption Standard](https://en.wikipedia.org/wiki/Data_Encryption_Standard)

---

## 👤 Author

<div align="center">

**Putra Alsyah**

[![GitHub](https://img.shields.io/badge/GitHub-putraalsyah-181717?style=for-the-badge&logo=github)](https://github.com/putraalsyah)
[![Website](https://img.shields.io/badge/Website-s--desputraaliansyah.my.id-FFD600?style=for-the-badge&logo=googlechrome&logoColor=black)](http://www.s-desputraaliansyah.my.id)

</div>

---

<div align="center">

Dibuat dengan ❤️ untuk Tugas Mata Kuliah **Kriptografi**

⭐ *Jika proyek ini bermanfaat, jangan lupa beri bintang!*

</div>
