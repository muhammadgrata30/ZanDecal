# Admin dummy Zan Decal

Buka /admin. Username: zandecal. Password: zandecal123.

Mode demo ini memakai data awal dari lib/content-defaults.json tanpa database. Login hanya simulasi di browser, bukan autentikasi produksi.

Admin dapat menambah, mengubah, dan menghapus bahan, portofolio foto/video, serta preset warna. Minimal satu warna tetap tersedia untuk studio 3D. Video latar galeri dapat diganti atau dihapus.

Klik Simpan & terbitkan untuk menyimpan perubahan; penambahan melalui drawer langsung disimpan saat tombol tersebut diklik. Muat ulang membuang perubahan yang belum disimpan. Data tersimpan di localStorage dan dipakai website di browser serta origin yang sama, termasuk tab lain. Data tidak dibagikan antar perangkat. Menghapus data situs akan mengembalikan data awal.

Media dummy maksimal 2 MB per file dan kapasitas total mengikuti browser. Jika penuh, kurangi media. Keluar mengakhiri sesi tab tanpa menghapus konten tersimpan.

## Katalog, album dan history dokumentasi

Menu Portofolio sekarang mengelompokkan dokumentasi per proyek, maksimal 60 media dalam satu katalog. Katalog lama dengan satu foto tetap terbaca tanpa migrasi manual.

Pilih katalog, isi tahap serta tanggal pengambilan asli bila diketahui, lalu unggah beberapa foto/video sekaligus. Pilihan tahap: arsip dokumentasi, kondisi awal, proses pengerjaan, dan hasil akhir. Arsip lama boleh tanpa tanggal. Video baru diperiksa di browser dan harus berdurasi maksimal 30 detik; batas penyimpanan demo tetap 2 MB per berkas.

Media baru masuk sebagai draft. Klik **Simpan & terbitkan** di header untuk menyimpan album, termasuk draft yang belum ditampilkan. Centang **Publik di Gallery** pada media yang siap ditampilkan, lalu simpan lagi. Cover, caption, tanggal, tahap, serta urutan slide dapat diedit sebelum menyimpan. Draft tidak ditampilkan dalam album pengunjung; proyek tanpa media publik tidak ditampilkan sebagai kartu.

Pengunjung membuka `/gallery` melalui menu Galeri atau tautan arsip pada homepage. Klik **Buka album** untuk memakai slider foto/video dengan panah, thumbnail, keyboard, dan swipe. Tab History mengelompokkan dokumentasi berdasarkan tanggal asli atau tahap pengerjaan. Animasi GSAP menghormati preferensi reduced motion, dan video tidak diputar otomatis.

Fitur ini mengikuti penyimpanan browser yang memang dipakai proyek saat ini; tidak mengaktifkan database atau sinkronisasi lintas perangkat. Nilai album baru juga divalidasi oleh jalur penyimpanan konten server yang sudah tersedia.

Pemeriksaan album: `node scripts/verify-portfolio-albums.mjs`.

## Library Studio: livery dan stiker

Menu **Library Studio** mengelola 9 preset livery dan 8 gambar stiker awal. Tambah atau edit aset, pilih kendaraan yang kompatibel, simpan draft, lalu gunakan **Uji 3D** untuk memeriksa aset langsung di Interactive Studio website. Preview draft memerlukan sesi admin pada tab yang sama. Setelah sesuai, **Publikasikan** agar aset muncul di koleksi pengguna. Aset juga bisa ditarik kembali ke draft atau dihapus.

Setiap tindakan Library Studio disimpan langsung, terpisah dari draft konten bahan/portofolio. Data mengikuti mode admin yang sudah ada: localStorage pada browser dan origin yang sama. Pembaruan tersinkron ke Studio pengguna pada tab lain; belum dibagikan antar perangkat. Konflik revisi dan kegagalan kapasitas penyimpanan ditampilkan tanpa menimpa data tersimpan.

Panduan **upload livery & stiker** tersedia di menu ini dan di form upload. Ada contoh PNG camo untuk diunduh, langkah menyiapkan motif seamless, gambar transparan, pemeriksaan hasil, dan penjelasan template UV. Upload motif menerima PNG/WebP/JPG; stiker menerima PNG/WebP, maksimal 2 MB. Upload livery utuh berbasis UV belum didukung: file UV tidak boleh diunggah sebagai motif berulang.

Studio pengguna memiliki tab Warna, Livery, dan Stiker. Penempatan tersedia pada 17 bagian mobil dan 12 bagian motor, ditambah pilihan klik langsung pada model. Ukuran, rotasi, duplikasi dan penghapusan tersedia per lapisan. Konsep dapat disimpan di browser, preview diunduh sebagai PNG, dan ringkasan livery/stiker disertakan dalam konsultasi. Preview bukan file produksi cetak.

Pemeriksaan integrasi:

```text
node scripts/verify-studio-livery.mjs
node scripts/verify-studio-assets.mjs
node scripts/check-studio-input.mjs
node scripts/check-studio-camera.mjs
node scripts/verify-vehicle-rig.mjs
```
