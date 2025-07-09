# Portfolio Website - Arris

Portfolio website untuk mahasiswa Teknik Elektro yang menampilkan proyek, keahlian, dan informasi kontak.

## Perbaikan yang Telah Dilakukan

### 1. Masalah CSS
- ✅ Mengganti semua `@apply` dengan CSS biasa karena CDN Tailwind tidak mendukung `@apply`
- ✅ Memperbaiki struktur mobile menu
- ✅ Menambahkan `pointer-events: none` pada canvas partikel
- ✅ Memperbaiki z-index untuk layer yang benar

### 2. Masalah JavaScript
- ✅ Menambahkan error handling untuk semua library (AOS, Typed.js, GSAP, Lucide)
- ✅ Memperbaiki mobile menu toggle dengan prevent default
- ✅ Menambahkan fallback untuk clipboard API
- ✅ Memperbaiki canvas partikel dengan proper resize handling
- ✅ Menambahkan check untuk elemen DOM sebelum menggunakan

### 3. Masalah HTML
- ✅ Menambahkan konfigurasi Tailwind untuk dark mode
- ✅ Memperbaiki struktur mobile menu
- ✅ Memastikan semua elemen memiliki ID yang benar

### 4. Responsivitas
- ✅ Menambahkan media queries untuk mobile
- ✅ Memperbaiki container dan grid system
- ✅ Memastikan images responsive

## Cara Menjalankan

1. Buka file `index.html` di browser
2. Atau gunakan live server di VS Code
3. Atau jalankan server HTTP sederhana:
   ```bash
   python -m http.server 8000
   ```

## Fitur

- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ Smooth scrolling
- ✅ Particle animation background
- ✅ Typing effect
- ✅ Mobile menu
- ✅ Copy email functionality
- ✅ AOS animations
- ✅ GSAP animations

## Fitur Baru - Skill Cards Interaktif

### Animasi Interaktif
- ✅ **Hover Effect 3D**: Card mengikuti pergerakan cursor dengan efek rotasi 3D
- ✅ **Ripple Animation**: Efek gelombang saat cursor menyentuh card
- ✅ **Glow Effect**: Efek cahaya teal saat hover
- ✅ **Floating Animation**: Animasi melayang yang berbeda untuk setiap card
- ✅ **Smooth Transitions**: Transisi yang halus dengan cubic-bezier easing

### Sistem Icon PNG
- ✅ **Flexible Icon System**: Mendukung PNG files untuk icon custom
- ✅ **Fallback System**: Otomatis menggunakan Lucide icons jika PNG tidak tersedia
- ✅ **Easy to Replace**: Tinggal ganti file PNG di folder `assets/icons/`
- ✅ **Responsive**: Icon menyesuaikan ukuran untuk mobile

### Cara Mengganti Icon
1. Siapkan file PNG ukuran 64x64 pixel
2. Beri nama sesuai dengan skill (contoh: `microcontroller.png`)
3. Simpan di folder `assets/icons/`
4. Icon akan otomatis muncul di website

### Daftar Icon yang Diperlukan
- `microcontroller.png` - Mikrokontroler
- `programming.png` - Pemrograman
- `pcb-design.png` - Desain PCB
- `simulation.png` - Simulasi
- `power-systems.png` - Sistem Tenaga
- `machine-learning.png` - Machine Learning
- `iot.png` - IoT
- `problem-solving.png` - Problem Solving

### Template Menambah Skill Baru
Lihat file `skill-card-template.html` untuk template HTML lengkap.

## Teknologi yang Digunakan

- HTML5
- CSS3
- JavaScript (ES6+)
- Tailwind CSS (CDN)
- AOS (Animate On Scroll)
- Typed.js
- GSAP (GreenSock)
- Lucide Icons

## Catatan

Semua placeholder seperti `[Nama Anda]`, `[URL_GITHUB_ANDA]`, dll. perlu diganti dengan informasi yang sebenarnya.