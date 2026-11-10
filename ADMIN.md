# Admin dummy Zan Decal

Buka /admin. Username: zandecal. Password: zandecal123.

Mode demo ini memakai data awal dari lib/content-defaults.json tanpa database. Login hanya simulasi di browser, bukan autentikasi produksi.

Admin dapat menambah, mengubah, dan menghapus bahan, portofolio foto/video, serta preset warna. Minimal satu warna tetap tersedia untuk studio 3D. Video latar galeri dapat diganti atau dihapus.

Klik Simpan & terbitkan untuk menyimpan perubahan; penambahan melalui drawer langsung disimpan saat tombol tersebut diklik. Muat ulang membuang perubahan yang belum disimpan. Data tersimpan di localStorage dan dipakai website di browser serta origin yang sama, termasuk tab lain. Data tidak dibagikan antar perangkat. Menghapus data situs akan mengembalikan data awal.

Media dummy maksimal 2 MB per file dan kapasitas total mengikuti browser. Jika penuh, kurangi media. Keluar mengakhiri sesi tab tanpa menghapus konten tersimpan.

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
