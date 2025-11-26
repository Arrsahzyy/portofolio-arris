# 📁 Project System Documentation

## Overview

Sistem project showcase ini menggunakan data JSON terpusat untuk memudahkan pengelolaan dan penambahan project baru.

## Struktur Folder

```
assets/
├── data/
│   └── projects.json       # Data project terpusat
├── js/
│   └── project-loader.js   # Script untuk memuat project
├── css/
│   └── projects.css        # Style khusus untuk projects
└── projects/
    └── (gambar-gambar project)
```

---

## 🆕 Cara Menambahkan Project Baru

### Langkah 1: Siapkan Gambar

1. Siapkan gambar project dengan rasio 16:9 (contoh: 800x450 px)
2. Simpan di folder `assets/projects/`
3. Gunakan nama file yang deskriptif, contoh: `smart-home-iot.jpg`

### Langkah 2: Edit File JSON

Buka file `assets/data/projects.json` dan tambahkan object baru di array `projects`:

```json
{
    "id": 6,
    "title": "Nama Project Anda",
    "description": "Deskripsi singkat tentang project ini. Jelaskan tujuan dan teknologi yang digunakan.",
    "image": "assets/projects/nama-gambar.jpg",
    "category": "IoT",
    "categoryColor": "teal",
    "icon": "cpu",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "link": "https://github.com/username/repo",
    "linkText": "View Project",
    "github": "https://github.com/username/repo",
    "demo": "https://demo-link.com",
    "featured": false,
    "status": "completed",
    "date": "2025-02-01",
    "duration": "3 bulan",
    "difficulty": "intermediate"
}
```

### Langkah 3: Simpan dan Test

1. Simpan file JSON
2. Refresh halaman projects di browser
3. Pastikan project baru muncul dengan benar

---

## 📋 Panduan Field JSON

### Field Wajib

| Field | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `id` | number | ID unik (increment dari terakhir) | `6` |
| `title` | string | Judul project | `"Smart Home System"` |
| `description` | string | Deskripsi (50-150 kata) | `"Sistem rumah pintar..."` |
| `image` | string | Path ke gambar | `"assets/projects/img.jpg"` |
| `category` | string | Kategori utama | `"IoT"` |
| `categoryColor` | string | Warna kategori | `"teal"` |
| `icon` | string | Nama icon Lucide | `"cpu"` |
| `tags` | array | Array teknologi | `["ESP32", "MQTT"]` |
| `link` | string | URL utama project | `"https://..."` |
| `linkText` | string | Teks tombol link | `"View Project"` |

### Field Opsional

| Field | Tipe | Deskripsi | Contoh |
|-------|------|-----------|--------|
| `github` | string | URL GitHub repo | `"https://github.com/..."` |
| `demo` | string | URL demo live | `"https://demo.com"` |
| `featured` | boolean | Tampil di homepage | `true` atau `false` |
| `status` | string | Status project | `"completed"`, `"ongoing"`, `"planned"` |
| `date` | string | Tanggal selesai | `"2025-01-15"` |
| `duration` | string | Durasi pengerjaan | `"3 bulan"` |
| `difficulty` | string | Tingkat kesulitan | `"beginner"`, `"intermediate"`, `"advanced"` |

---

## 🎨 Warna Kategori Tersedia

| Warna | Kode | Penggunaan |
|-------|------|------------|
| `teal` | 🟢 | IoT, Embedded Systems |
| `blue` | 🔵 | Web Development |
| `purple` | 🟣 | Machine Learning, AI |
| `green` | 🟢 | Electronics, Hardware |
| `sky` | 🔵 | Mobile Apps |
| `pink` | 🟣 | UI/UX Design |
| `indigo` | 🟣 | Data Science |
| `orange` | 🟠 | General Projects |

---

## 🔣 Icon Tersedia

Icon menggunakan library [Lucide Icons](https://lucide.dev/icons/). Beberapa yang sering digunakan:

| Icon | Nama | Penggunaan |
|------|------|------------|
| ⚡ | `cpu` | Hardware, Electronics |
| 🌐 | `globe` | Web Development |
| 🧠 | `brain` | Machine Learning |
| 📱 | `smartphone` | Mobile Apps |
| 🔌 | `zap` | IoT, Power Systems |
| 📊 | `bar-chart` | Data Analytics |
| 🎨 | `palette` | Design |
| 📦 | `package` | Libraries, Packages |
| 🔧 | `wrench` | Tools, Utilities |

Cari lebih banyak di: https://lucide.dev/icons/

---

## 📱 Responsive Design

Halaman project sudah dioptimasi untuk berbagai ukuran layar:

- **Mobile** (< 640px): 1 kolom grid
- **Tablet** (640px - 1024px): 2 kolom grid
- **Desktop** (> 1024px): 3 kolom grid

---

## 🔍 Fitur Pencarian & Filter

### Filter Kategori

User dapat memfilter project berdasarkan kategori dengan mengklik tombol filter di bagian atas grid.

### Pencarian

Pencarian mendukung:
- Judul project
- Deskripsi
- Tags
- Kategori

Hasil pencarian diperbarui secara real-time dengan debounce 300ms.

---

## 🚀 Tips Optimasi

1. **Gambar**: Kompres gambar ke ukuran < 200KB untuk loading cepat
2. **Deskripsi**: Gunakan kata kunci yang relevan untuk SEO
3. **Tags**: Maksimal 4-5 tags per project
4. **Featured**: Tandai maksimal 3 project untuk homepage

---

## ❓ FAQ

### Project tidak muncul?
1. Periksa apakah JSON valid (gunakan [JSON Validator](https://jsonlint.com/))
2. Pastikan path gambar benar
3. Cek console browser untuk error

### Gambar tidak tampil?
1. Pastikan file ada di folder `assets/projects/`
2. Periksa case-sensitivity nama file
3. Gunakan ekstensi yang benar (.jpg, .png, .webp)

### Ingin ubah urutan tampilan?
Project diurutkan berdasarkan tanggal secara default (terbaru di atas). Ubah field `date` untuk mengatur urutan.

---

## 📞 Bantuan

Jika ada pertanyaan atau masalah, silakan buat issue di repository atau hubungi melalui:
- Email: [email Anda]
- GitHub: [link GitHub]
