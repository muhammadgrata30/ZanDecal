# Admin Zan Decal

Buka `http://localhost:3000/admin` saat `npm run dev` berjalan. Kunjungan pertama menampilkan pembuatan akun; tentukan username dan password sendiri (minimal 12 karakter). Tidak ada password bawaan. Kunjungan selanjutnya memakai login yang sama.

## Mengelola konten

- **Jenis bahan:** tambah, ubah atau hapus nama, deskripsi, fitur dan spesifikasi. Hasilnya tampil di informasi bahan pada halaman utama.
- **Portofolio:** tambah proyek customer, pilih kategori, isi kendaraan/bahan/finishing, lalu unggah foto atau video. Media tampil di galeri publik dan dialog detail.
- **Preset warna:** tambah, ubah atau hapus preset warna bodi studio 3D. Minimal satu preset harus tersedia.
- **Video galeri:** unggah video untuk latar “Built to Stand Out”, atau pilih video portofolio yang sudah diunggah. Poster video bisa diunggah terpisah.

Klik **Simpan & terbitkan** setelah mengedit. Upload saja belum menerbitkan proyek. Website membaca data terbaru pada kunjungan baru, saat tab kembali aktif, atau paling lambat pada pembaruan otomatis 30 detik. **Muat ulang** mengambil data tersimpan dan membuang draft pada form.

Tombol **Tambah bahan**, **Tambah portofolio**, dan **Tambah warna** membuka drawer dari kanan. Isi form lalu klik **Simpan & terbitkan** di drawer untuk menyimpan sekaligus menampilkan konten di halaman pengunjung. Portofolio wajib memiliki judul, kendaraan dan foto/video; warna wajib memiliki nama dan kode hex valid. **Batal** atau Escape menutup drawer tanpa menambahkan draft ke data tersimpan. Saat upload atau simpan berjalan, drawer terkunci sampai proses selesai. Jika penerbitan gagal, isian tetap tersedia untuk diperbaiki atau dicoba kembali. Perubahan lain yang belum disimpan ikut diterbitkan dan diberi keterangan pada drawer.

Format upload: JPG, PNG, WebP, GIF, MP4 dan WebM; maksimal 50 MB per file. Foto maksimal 16.000 piksel pada tiap sisi. Video publik mendukung byte-range untuk seeking dan pemutaran browser. Hapus proyek menghapusnya dari galeri, tetapi file upload tetap disimpan agar media yang dipakai di tempat lain tidak rusak.

## Penyimpanan dan hosting

Localhost tanpa konfigurasi Supabase menggunakan penyimpanan filesystem pada **satu server Node dengan disk persisten**. Untuk database dan upload online di Netlify, ikuti [DATABASE.md](DATABASE.md). Aplikasi otomatis memakai Supabase ketika URL proyek dan secret key server tersedia.

Penyimpanan lokal:

- `data/content.json`: bahan, portofolio, preset dan video latar.
- `data/admin.json`: hash password, salt dan kunci penandatangan sesi. Jangan dipublikasikan.
- `data/uploads/`: media yang diunggah.

Data tidak disimpan di browser dan tidak ikut Git. Restart server tidak menghapus data. Cadangkan seluruh folder `data` secara rutin; file dan konten harus dipulihkan bersama. Lokasi dapat dipindahkan melalui `ZAN_DATA_DIR`.

**Filesystem lokal ini bukan penyimpanan serverless bersama.** Integrasi Supabase PostgreSQL dan Storage sudah tersedia. Jalankan migration dan isi environment sesuai DATABASE.md sebelum memakai Netlify. Deploy aplikasi saja tidak membuat data lokal laptop tersedia di hosting.

Pada development, setup akun pertama diperbolehkan dari localhost. Pada production atau setup non-localhost, isi `ADMIN_SETUP_TOKEN` di environment server, lalu masukkan token yang sama pada bagian “Setup dari luar localhost”. Production harus memakai HTTPS karena cookie sesi menggunakan `Secure`. Inisialisasi akun sebelum membuka instalasi development ke jaringan umum.

## Origin pada Netlify / reverse proxy

Validasi admin menerima domain deployment secara persis, termasuk URL publik dari `URL`, `DEPLOY_URL` dan `DEPLOY_PRIME_URL` jika tersedia. Ini menangani perbedaan URL internal server dengan alamat browser. Domain Netlify lain dan header `X-Forwarded-Host` palsu tidak otomatis dipercaya.

Untuk menetapkan domain secara eksplisit, isi `ZAN_SITE_URL=https://nama-situs.netlify.app` pada environment Netlify dengan scope **Functions**, lalu redeploy. Untuk domain tambahan milik sendiri, gunakan `ZAN_ALLOWED_ORIGINS` berisi daftar origin lengkap yang dipisahkan koma. Jangan gunakan wildcard atau menghapus pengecekan origin.

Perbaikan origin tidak mengubah batasan penyimpanan filesystem di atas: admin, konten dan upload pada Netlify serverless tetap memerlukan database/object storage persisten, bukan folder lokal dari laptop.

## Verifikasi

`node scripts/verify-admin.mjs` menjalankan pengujian handler dengan direktori sementara terpisah: setup/login, signed cookie, pembatasan akses, origin check, foto/video, serving range, validasi, publish/edit/delete dan konflik revisi. Test tidak membuat akun pada instalasi localhost asli.

`node scripts/verify-split-hero.mjs` memeriksa durasi slideshow dan gambar kendaraan untuk tema Light/Dark.
