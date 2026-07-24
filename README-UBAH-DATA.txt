PANDUAN UBAH DATA PORTOFOLIO MICHAEL - NEO3D

Folder utama:
Portofolio-Michael-Neo3D/

File yang paling sering diubah:
1. index.html
   - Ubah teks profil, deskripsi, project, pengalaman, sertifikat, dan link.

2. css/base.css
   - Ubah warna global, navbar, button, card dasar, background, animasi global, dan modal preview.

3. css/sections.css
   - Ubah layout hero, about, skill, project, pengalaman, sertifikat, dan kontak.

4. js/main.js
   - Ubah interaksi: menu mobile, scroll progress, 3D tilt, project filter, preview gambar, copy email, typewriter, counter.

Ganti gambar tanpa mengubah kode:
- images/Michael.jpg
- images/tingmo.png
- images/galonku.png
- images/bintang-serasi.png
- images/belajar-sma.png
- images/bem-it-del.png
- images/jadwal-kuliah.png
- images/kelas-trpl.png
- images/cert-ai.png
- images/cert-python.png

Cara kerja filter project:
Di setiap card project ada atribut seperti:
data-project-categories="mobile backend team"

Contoh:
- TingMo: mobile backend team
- GalonKu: mobile backend
- Website: web / web team

Jika ingin project muncul pada filter tertentu, tambahkan kategori pada data-project-categories.

Catatan desain:
- Versi ini memakai konsep 3D premium, tilt hover, spotlight card, preview gambar, typewriter, counter, dan magnetic button.
- Pada layar kecil, elemen floating 3D otomatis disembunyikan supaya tidak menutup teks.
- Bagian kontak tetap memakai ikon SVG karena membantu navigasi.

Jika setelah update tampilan lama masih muncul, tekan Ctrl + F5 di browser.
