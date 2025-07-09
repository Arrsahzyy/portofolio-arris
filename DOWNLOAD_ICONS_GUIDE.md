# Panduan Mengganti Ikon Download Cards

## Cara Mengganti Ikon CV Card

1. **Lokasi File**: `index.html` baris sekitar 271-273
2. **Kode yang perlu diubah**:
   ```html
   <img src="assets/icons/computer.png" alt="CV Icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" class="w-12 h-12 object-contain">
   ```
3. **Untuk mengganti**: Ubah `computer.png` dengan nama file ikon PNG yang Anda inginkan
4. **Contoh**: `<img src="assets/icons/programming.png" alt="CV Icon" ...>`

## Cara Mengganti Ikon Sertifikat Card

1. **Lokasi File**: `index.html` baris sekitar 291-293
2. **Kode yang perlu diubah**:
   ```html
   <img src="assets/icons/settings.png" alt="Certificate Icon" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" class="w-12 h-12 object-contain">
   ```
3. **Untuk mengganti**: Ubah `settings.png` dengan nama file ikon PNG yang Anda inginkan
4. **Contoh**: `<img src="assets/icons/analisys.png" alt="Certificate Icon" ...>`

## Ikon yang Tersedia di Folder assets/icons/

- `computer.png` - Ikon komputer (saat ini digunakan untuk CV)
- `settings.png` - Ikon pengaturan (saat ini digunakan untuk sertifikat)
- `programming.png` - Ikon pemrograman
- `analisys.png` - Ikon analisis
- `coding.png` - Ikon coding
- `database.png` - Ikon database
- `excel.png` - Ikon Excel
- `github.png` - Ikon GitHub
- `linkedin.png` - Ikon LinkedIn
- `machine-learning.png` - Ikon machine learning
- `microcontroller.png` - Ikon mikrokontroler
- `pcb-design.png` - Ikon desain PCB
- `power-systems.png` - Ikon sistem tenaga
- `problem-solving.png` - Ikon problem solving
- `python.png` - Ikon Python
- `simulation.png` - Ikon simulasi
- `web.png` - Ikon web
- Dan masih banyak lagi...

## Cara Menambah Ikon Baru

1. Masukkan file ikon PNG baru ke folder `assets/icons/`
2. Pastikan ukuran ikon sekitar 64x64px atau 128x128px untuk hasil terbaik
3. Gunakan format PNG dengan latar belakang transparan
4. Ubah nama file di HTML sesuai nama ikon baru Anda

## Fitur Fallback

Jika ikon PNG tidak dapat dimuat, sistem akan otomatis menampilkan ikon Lucide sebagai fallback:
- CV Card: ikon `file-text`
- Sertifikat Card: ikon `award`

## Animasi dan Styling

Ikon download cards sudah dilengkapi dengan:
- ✅ Animasi hover dengan scaling dan rotasi
- ✅ Efek glow dan shadow
- ✅ Animasi floating yang halus
- ✅ Responsif untuk mobile
- ✅ Dark mode support
- ✅ Transisi yang smooth

Semua styling sudah dikonfigurasi di `style.css` sehingga Anda hanya perlu mengganti nama file ikon tanpa mengubah CSS.
