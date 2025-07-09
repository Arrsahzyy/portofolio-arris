# How to Convert SVG to PNG

Jika Anda ingin menggunakan file PNG sebenarnya, berikut adalah cara untuk mengkonversi SVG ke PNG:

## Option 1: Using Online Converter
1. Buka website seperti https://convertio.co/svg-png/ atau https://cloudconvert.com/svg-to-png
2. Upload file SVG yang ada di folder `assets/icons/social/`
3. Download hasil konversi PNG
4. Ganti ekstensi di HTML dari `.svg` ke `.png`

## Option 2: Using Node.js (Advanced)
```bash
npm install sharp
```

```javascript
const sharp = require('sharp');

// Convert SVG to PNG
sharp('linkedin.svg')
  .png()
  .toFile('linkedin.png');
```

## Option 3: Using Command Line (jika ada ImageMagick)
```bash
convert linkedin.svg linkedin.png
```

## Option 4: Manual Download
Anda juga bisa download ikon PNG dari:
- Font Awesome
- Feather Icons
- Heroicons
- Atau membuat sendiri di Figma/Canva

## Current Implementation
Saat ini website menggunakan text-based icons yang sudah dioptimalkan dan berfungsi dengan baik tanpa perlu file PNG eksternal.

## Alternatif Mudah
Jika Anda ingin ikon yang lebih baik, saya sarankan:
1. Download icon pack dari Flaticon atau IconFinder
2. Atau gunakan Font Awesome CDN
3. Atau tetap gunakan implementasi text-based yang sudah ada
