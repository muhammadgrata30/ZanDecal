# Daftar Permintaan Klien

Dicatat: 11 November 2026.

Item 1–6 sudah diimplementasikan pada kode website; verifikasi visual di browser masih diperlukan. Pengelolaan dokumentasi mengikuti mode penyimpanan browser yang saat ini dipakai proyek. Dokumen asli klien belum diterima untuk dimasukkan.

## 1. Interval animasi 3D
- [x] Atur jeda antar sapuan animasi 3D menjadi 3 detik sesuai revisi terbaru, setelah gerakan 5,2 detik selesai (siklus total 8,2 detik).
- Verifikasi logika: 12 siklus lolos. Lint komponen dan TypeScript lolos.

## 2. Headline saat tema diganti
- [x] Perbaiki status intro selesai yang terhapus saat pergantian tema sehingga headline kembali tersembunyi.
- Status intro sekarang dikelola React agar tetap tersimpan saat tema berubah.
- Uji regresi browser ditambahkan untuk tema gelap dan terang, tetapi belum dijalankan karena Playwright belum tersedia.

## 3. Warna decal bertumpuk
- [x] Perbaiki warna/livery yang masih tersangkut setelah beberapa kali pergantian.
- Penyebab pada kode: program shader yang dipakai ulang dapat menyimpan referensi parameter warna/tekstur lama; warna material juga diubah oleh dua efek berbeda.
- Renderer sekarang memakai satu shader dengan parameter aktif yang diperbarui langsung. Tekstur lama diganti penuh, ukuran tekstur GPU tetap, dan satu pengelola menangani warna bodi/livery.
- Penghapusan livery mengembalikan cat dasar. Pemuatan gambar yang dibatalkan tidak dapat menimpa pilihan terbaru; gambar yang gagal dimuat menampilkan pemberitahuan.
- Verifikasi: 1.280 perubahan material motor/mobil dan 145 kombinasi penempatan stiker pada 29 panel lolos. Build produksi dan TypeScript lolos.
- Verifikasi visual browser belum selesai: akses Computer Use dihentikan alat karena URL browser tidak dapat dipastikan. Status implementasi selesai, penerimaan visual masih tertunda.

### Tindak lanjut: error tekstur GLTF (11 November 2026)
- Log menunjukkan `Failed to allocate memory`, error tekstur `blob:`, kegagalan shader lingkungan, dan kehilangan konteks WebGL.
- Loader studio sekarang membatasi decoding menjadi dua gambar bersamaan, memakai gambar HTML tanpa ImageBitmap paralel, dan mengecilkan tekstur model ke maksimum 512 px sambil mempertahankan rasio gambar.
- Semua gambar model asli tetap digunakan; hanya resolusi preview runtime yang diperkecil. Jika tekstur gagal, loader menolak model yang tidak lengkap dan membersihkan URL sementara.
- Pencahayaan studio memakai pembangkitan environment yang terjaga dengan lampu langsung sebagai cadangan bila shader environment gagal.
- Uji lolos: 48 gambar asli PNG/JPEG, kedua model lengkap, antrean sesudah gambar gagal, pembersihan URL gagal, dan 1.280 pergantian material.
- Server lokal sudah direstart dan halaman merespons HTTP 200. Verifikasi visual sesudah restart belum selesai karena koneksi native Computer Use tidak tersedia.

## 4. Arsip karakter menuju galeri
- Implementasi website: `/gallery`, navigasi Galeri, serta tautan arsip pada homepage. Mockup tetap tersedia di `/design-preview/arsip-history/index.html` sebagai referensi.
- Revisi mockup: tiga layar review (`#home`, `#gallery`, `#admin`). Section homepage mengarah ke Gallery lengkap; satu kartu katalog mewakili satu proyek dengan album dokumentasi, tanpa membuat landing page baru.
- [x] Sediakan akses untuk melihat semua arsip karakter dari section terkait.
- [x] Arahkan akses tersebut ke menu Gallery.
- [x] Galeri mendukung dokumentasi foto dan video.
- Catatan: klien menyebut “dissection”; section yang dimaksud perlu dicocokkan saat pengerjaan.

## 5. Dokumentasi sebagai history
- Mockup menyediakan unggah beberapa foto/video, tahap pengerjaan, tanggal, catatan, dan preview history. Unggahan hanya berlaku di sesi preview, belum disimpan ke server.
- Klarifikasi pengguna: history mencakup **keduanya**, arsip dokumentasi pengerjaan lama dan urutan proses per proyek (kondisi awal, proses, hasil akhir).
- Tanggal dokumentasi adalah tanggal pengambilan asli, bukan tanggal unggah. Arsip lama boleh belum memiliki label tahap; tahap yang belum didokumentasikan ditampilkan sebagai belum tersedia, tanpa membuat riwayat fiktif.
- Alur admin pada mockup: pilih katalog → unggah banyak berkas → simpan draft → atur caption, tanggal, tahap, cover, dan urutan → publikasikan ke Gallery preview. Draft tidak tampil ke pengunjung.
- [x] Sediakan unggahan banyak dokumentasi foto dan video per proyek melalui admin, dengan tanggal asli, tahap pengerjaan dan draft/publik.
- [ ] Masukkan dokumentasi klien setelah berkas sumber tersedia.

## 6. Banyak foto per katalog
- Mockup menyediakan carousel, thumbnail, navigasi keyboard, geser di ponsel, dan pemutar video pada detail katalog.
- Revisi: foto cover dan urutan slide dapat diatur dari admin preview. Perubahan cover/urutan baru masuk Gallery setelah dipublikasikan. History bisa dikelompokkan berdasarkan tanggal atau tahap.
- Penyempurnaan motion pada mockup: GSAP ScrollTrigger untuk reveal kartu dan parallax ringan foto, transisi masuk Gallery, animasi masuk detail, serta perpindahan carousel horizontal. Navigasi carousel memakai panah, thumbnail, keyboard, dan swipe; klik cepat diantrekan agar slide tidak bertumpuk. Video tidak diputar otomatis dan efek mengikuti preferensi reduced motion.
- [x] Setiap item katalog di galeri dapat memiliki lebih dari satu foto.
- [x] Tampilkan foto sebagai slide image/carousel agar mudah dilihat.

## 7. Batas durasi video
- [x] Batasi unggahan video baru dari admin maksimal 30 detik; video lama tetap kompatibel.
- [x] Validasi durasi unggahan di browser dan nilai durasi media baru pada penyimpanan konten; tampilkan pesan jelas jika batas dilewati.

## Catatan pengerjaan
- Build produksi, TypeScript, lint komponen baru, uji album/persistensi dan integrasi backend admin lolos.
- Penyimpanan lintas perangkat/server belum diaktifkan; admin saat ini tetap mode browser sebagaimana konfigurasi proyek sebelum perubahan ini.
- Berikutnya: verifikasi visual, penerimaan klien, serta pengisian foto/video dokumentasi asli.
