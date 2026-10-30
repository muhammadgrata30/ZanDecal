# Pilihan redesign Zan Decal

Status: dikumpulkan untuk implementasi berikutnya. Pengguna meminta jangan implementasi dahulu.

Sumber: riwayat task 01a1876a-bb01-7a82-ac64-06115a81d2c8 dan percakapan task 01a187c2-6e5d-7602-be32-0aabe130cc18, 29 Oktober 2026.

## Custom Sticker

- Mockup automotive 3: public/design-preview/automotive-3.png.
- Section pinned saat scroll.
- Motor bergerak keluar ke kanan, lalu mobil bergerak masuk dan berhenti di posisi motor sebelumnya. Transisi mengikuti scroll ketika section tertahan.
- Kendaraan hanya motor dan mobil, tanpa helm.

## Galeri

- Mockup automotive 1: public/design-preview/automotive-1.png.
- Perpanjang galeri ke bawah dengan lebih banyak motor dan mobil yang berbeda dari kendaraan pada mockup.

## Cara Order

- Mockup automotive 3: public/design-preview/automotive-3.png.
- Tipografi berkarakter, hindari kesan generik atau AI slop.
- Tambahkan efek pada teks sesuai hierarki dan keterbacaan.

## Konsultasi

- Gambar dan headline dari opsi 2 eksplorasi terbaru: public/design-preview/consultation-v2-2.png.
- Form dari opsi 3 eksplorasi terbaru: public/design-preview/consultation-v2-3.png.

## Footer

- Struktur dari opsi 2 eksplorasi terbaru: public/design-preview/consultation-v2-2.png.
- Gunakan tema warna proyek Zan Decal; jangan menyalin warna kuning footer mockup.

## Arah bersama

- Kualitas visual yang dituju setara situs Awwwards papan atas; bukan klaim telah memenangkan penghargaan.
- Komposisi dan tipografi khusus otomotif, hindari layout generik dan copy AI slop.
- Warna konsisten dengan tema proyek.
- Efek dan animasi diterapkan setelah kumpulan pilihan selesai dan pengguna meminta implementasi.
- Pratinjau mockup melalui localhost.

## Hero B3 dan studio 3D — catatan terbaru

- Pengguna telah mengizinkan implementasi hero B3, studio Colour Chamber, serta animasi seluruh section pada 30 Oktober 2026.
- Hero yang sedang dipertimbangkan: B3 / The Material Atelier, `public/design-preview/hero-study-v4-b3.png`.
- Studio yang disukai: bagian studio dari opsi ketiga / Colour Chamber, `public/design-preview/hero-studio-v3-3.png`. Preferensi ini mencakup studio saja, bukan hero opsi tersebut.
- Gunakan Ducati Streetfighter V4 S lokal. Perubahan warna harus mengenai panel cat utama, bukan rangka dan komponen mekanis.
- Konsep animasi awal yang disimpan: motor muncul dengan sorotan pada cat; lembar vinyl bergerak perlahan; hero pinned saat scroll; kamera mengitari motor; headline keluar bertahap; vinyl menyapu layar sebagai transisi ruang gelap hero ke studio putih; motor menetap di panggung lalu kontrol tampil.
- Gerakan transisi mengikuti posisi scroll dan dapat dibalik saat scroll ke atas. Pendekatan yang diusulkan menggabungkan model/kamera 3D dengan animasi teks, transisi, dan kontrol 2D.
- Implementasi mencakup Ducati dan BYD dengan roda berputar, perpindahan kendaraan dan kamera mengikuti scroll, transisi masuk yang berbeda per section, serta tema light/dark. Optimasi memakai satu Canvas, pembaruan berbasis ref, animasi transform/opacity, dan penghentian render ketika section tidak terlihat.
- Revisi yang disetujui: hero kendaraan maju, studio kendaraan masuk dari kiri ke kanan, transisi pintu garasi mengikuti scroll. Kain dihapus; hero dan studio memakai arsitektur garasi 3D. Zoom memakai pinch dua jari, sementara scroll biasa tetap menavigasi halaman.
- Revisi hero terbaru: latar hero dipisahkan dari garasi studio menjadi arena arsitektur terbuka dengan portal cahaya. Kendaraan diperbesar, headline lebih dominan dan beranimasi, sementara alur berkendara dan transisi dipertahankan. Studio diperkaya alat decal/modifikasi dan 12 pilihan warna.

## Hero final yang dipilih — studi VI opsi 4

- Target visual: `public/design-preview/hero-v6-4.png`, tampak depan kendaraan dengan sisi kiri gelap/lavender dan kanan terang/putih; headline “SATU BENTUK. BANYAK KARAKTER.”
- Hero memakai gambar, bukan Canvas atau model 3D. Ducati dan BYD bergantian: 3.000 ms diam, 1.000 ms transisi, berulang.
- Tampilan awal mempertahankan pembagian 50/50 mockup. Pilih Light menyapu terang dari kanan ke kiri hingga penuh dan menerapkan tema terang seluruh website. Pilih Dark menyapu gelap dari kiri ke kanan hingga penuh dan menerapkan tema gelap seluruh website. Preferensi tema global tetap tersimpan.
- Studio 3D dengan alat decal dan 12 warna tetap ada sebagai section tersendiri di bawah hero.
- Pembuatan admin dinamis belum dimulai. Pengguna meminta konfirmasi tersendiri sebelum tahap admin.
- Pengguna kemudian secara eksplisit mengizinkan pengerjaan admin setelah penyesuaian warna kendaraan hero. Izin ini menggantikan status menunggu konfirmasi sebelumnya.

## Hero bertema dan admin dinamis

- Light menggunakan gambar kendaraan full pearl white; Dark menggunakan full lavender; belum memilih tema menampilkan gambar split seperti mockup. Preferensi yang tersimpan dipulihkan saat halaman dibuka kembali.
- Admin `/admin`: akun pertama ditentukan pengguna, kemudian login. Pengelolaan bahan, foto/video portofolio, preset warna studio dan video latar galeri terhubung ke konten publik yang persisten pada filesystem lokal.
