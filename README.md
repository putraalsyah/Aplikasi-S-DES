# 🔐 Aplikasi S-DES — Simplified Data Encryption Standard

<div align="center">

![S-DES Banner](https://img.shields.io/badge/S--DES-Simplified%20DES-FFD600?style=for-the-badge&logo=shield&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

**Aplikasi web simulasi kriptografi S-DES dengan visualisasi langkah-langkah perhitungan secara lengkap dan interaktif.**

[🚀 Demo Live](#) • [📖 Dokumentasi](#cara-penggunaan) • [⚙️ Algoritma](#algoritma-s-des)

</div>

---

## 📌 Deskripsi

**S-DES (Simplified Data Encryption Standard)** adalah versi penyederhanaan dari algoritma DES yang dirancang khusus untuk **keperluan pembelajaran kriptografi**. Aplikasi ini mengimplementasikan seluruh proses enkripsi dan dekripsi S-DES secara visual, step-by-step, sehingga mudah dipahami oleh mahasiswa dan pelajar.

> 🎯 Dibangun sebagai tugas mata kuliah **Kriptografi** dengan tampilan interaktif dan edukatif.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔒 **Enkripsi** | Mengenkripsi 8-bit plaintext menjadi ciphertext |
| 🔓 **Dekripsi** | Mendekripsi 8-bit ciphertext kembali ke plaintext |
| 🔑 **Key Generation** | Visualisasi pembangkitan K1 dan K2 secara detail |
| 📊 **Step-by-Step** | Setiap langkah ditampilkan dengan bit box visual |
| 🎨 **UI Modern** | Tema kuning-hitam-putih yang bersih dan responsif |
| ✅ **Validasi Input** | Real-time validasi dan live bit preview |
| 📱 **Responsif** | Berjalan di desktop maupun mobile |

---

## 🖼️ Tampilan Aplikasi

```
┌─────────────────────────────────────────────────────┐
│  🔐 S-DES  Simplified Data Encryption Standard      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [01] Plaintext/Ciphertext (8-bit biner)            │
│  ┌─────────────────────────────┐                   │
│  │ 1 0 1 1 0 1 0 0            │ 8/8               │
│  └─────────────────────────────┘                   │
│  [1][0][1][1][0][1][0][0]  ← live preview          │
│                                                     │
│  [02] Kunci / Key (10-bit biner)                    │
│  ┌─────────────────────────────┐                   │
│  │ 1 0 1 0 0 0 0 0 1 0        │ 10/10             │
│  └─────────────────────────────┘                   │
│                                                     │
│  [03] Mode: [🔒 Enkripsi] [🔓 Dekripsi]            │
│                                                     │
│  [ ▶ PROSES ]  [ ↺ RESET ]                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│  HASIL                                              │
│  Input: [1][0][1][1][0][1][0][0]                   │
│    →  Ciphertext: [0][1][1][1][0][1][0][0]         │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Algoritma S-DES

### Parameter Algoritma

| Parameter | Nilai |
|-----------|-------|
| Ukuran Plaintext/Ciphertext | **8-bit** |
| Ukuran Kunci | **10-bit** |
| Jumlah Round | **2 round** |
| Subkunci | **K1, K2 (8-bit masing-masing)** |

### Tabel Permutasi

```
P10  = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6]
P8   = [6, 3, 7, 4, 8, 5, 10, 9]
IP   = [2, 6, 3, 1, 4, 8, 5, 7]
IP⁻¹ = [4, 1, 3, 5, 7, 2, 8, 6]
EP   = [4, 1, 2, 3, 2, 3, 4, 1]
P4   = [2, 4, 3, 1]
```

### S-Box

**S0:**
```
      Col 00  Col 01  Col 10  Col 11
Row 00:  1      0      3      2
Row 01:  3      2      1      0
Row 10:  0      2      1      3
Row 11:  3      1      3      2
```

**S1:**
```
      Col 00  Col 01  Col 10  Col 11
Row 00:  0      1      2      3
Row 01:  2      0      1      3
Row 10:  3      0      1      0
Row 11:  2      1      0      3
```

### Alur Algoritma

```
ENKRIPSI:
Plaintext (8-bit)
     │
     ▼
  [ IP ]  ←── Initial Permutation
     │
   L │ R  ←── Split 4-bit kiri & kanan
     │
  ┌──┴────────────────────────────────┐
  │         ROUND 1 (K1)              │
  │  R → [EP] → XOR K1 → [S0|S1] → [P4]
  │  L XOR P4 → L'                   │
  │  SWAP(L', R)                     │
  └──────────────────────────────────┘
     │
  ┌──┴────────────────────────────────┐
  │         ROUND 2 (K2)              │
  │  R → [EP] → XOR K2 → [S0|S1] → [P4]
  │  L XOR P4 → L'                   │
  │  (Tidak ada SWAP)                │
  └──────────────────────────────────┘
     │
     ▼
  [ IP⁻¹ ]  ←── Inverse Initial Permutation
     │
     ▼
Ciphertext (8-bit)

DEKRIPSI: Sama, tapi Round 1 pakai K2, Round 2 pakai K1
```

---

## 🗂️ Struktur Proyek

```
Aplikasi-S-DES/
├── index.html      # Halaman utama aplikasi
├── style.css       # Stylesheet (tema kuning-hitam-putih)
├── sdes.js         # Implementasi algoritma S-DES
├── app.js          # Logika UI dan rendering step-by-step
└── README.md       # Dokumentasi proyek ini
```

---

## 🚀 Cara Penggunaan

### Menjalankan Lokal

```bash
# Clone repositori ini
git clone https://github.com/putraalsyah/Aplikasi-S-DES.git

# Masuk ke direktori
cd Aplikasi-S-DES

# Buka di browser (tidak perlu server khusus)
open index.html
# atau klik dua kali file index.html
```

### Cara Memakai Aplikasi

1. **Masukkan Plaintext/Ciphertext** — 8 karakter biner (`0` atau `1`)
2. **Masukkan Kunci** — 10 karakter biner (`0` atau `1`)
3. **Pilih Mode** — Enkripsi atau Dekripsi
4. **Klik PROSES** — Hasil dan langkah-langkah muncul
5. **Toggle Step-by-Step** — Klik untuk menampilkan/menyembunyikan detail perhitungan

### Contoh Input

| Input | Nilai |
|-------|-------|
| Plaintext | `10110100` |
| Kunci | `1010000010` |
| Mode | Enkripsi |

---

## 📋 Detail Langkah yang Ditampilkan

### A. Pembangkitan Kunci (Key Generation)
- ✅ Permutasi P10 pada kunci awal
- ✅ Pembagian kiri & kanan
- ✅ Left Shift-1 (LS-1) pada kedua bagian
- ✅ Permutasi P8 → **K1**
- ✅ Left Shift-2 (LS-2) pada kedua bagian
- ✅ Permutasi P8 → **K2**

### B. Proses Enkripsi / Dekripsi
- ✅ Initial Permutation (IP)
- ✅ Pembagian L dan R
- ✅ Round 1: EP → XOR → S-Box (S0, S1) → P4 → XOR dengan L → SWAP
- ✅ Round 2: EP → XOR → S-Box (S0, S1) → P4 → XOR dengan L
- ✅ Inverse IP⁻¹ → Output akhir

---

## 🛠️ Teknologi

- **HTML5** — Struktur halaman semantik
- **CSS3** — Animasi, Grid, Flexbox, Custom Properties
- **JavaScript (Vanilla)** — Logika algoritma dan UI
- Font: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) + [Inter](https://fonts.google.com/specimen/Inter)

---

## 📚 Referensi

- Schaefer, E.F. (1996). *A Simplified Data Encryption Standard Algorithm*
- [Simplified DES — Wikipedia](https://en.wikipedia.org/wiki/Data_Encryption_Standard)
- Stallings, W. *Cryptography and Network Security: Principles and Practice*

---

## 👤 Author

**Putra Alsyah**  
Mahasiswa Teknik Informatika  

[![GitHub](https://img.shields.io/badge/GitHub-putraalsyah-181717?style=flat&logo=github)](https://github.com/putraalsyah)

---

<div align="center">

**⭐ Jika proyek ini membantu, jangan lupa beri bintang!**

Made with ❤️ for Cryptography Course

</div>
