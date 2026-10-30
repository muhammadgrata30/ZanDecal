# Admin Zan Decal

Buka `http://localhost:3000/admin` saat `npm run dev` berjalan. Kunjungan pertama menampilkan pembuatan akun; tentukan username dan password sendiri (minimal 12 karakter). Tidak ada password bawaan. Kunjungan selanjutnya memakai login yang sama.

## Mengelola konten

- **Jenis bahan:** tambah, ubah atau hapus nama, deskripsi, fitur dan spesifikasi. Hasilnya tampil di informasi bahan pada halaman utama.
- **Portofolio:** tambah proyek customer, pilih kategori, isi kendaraan/bahan/finishing, lalu unggah foto atau video. Media tampil di galeri publik dan dialog detail.
- **Preset warna:** tambah, ubah atau hapus preset warna bodi studio 3D. Minimal satu preset harus tersedia.
- **Video galeri:** unggah video untuk latar “Built to Stand Out”, atau pilih video portofolio yang sudah diunggah. Poster video bisa diunggah terpisah.

Klik **Simpan & terbitkan** setelah mengedit. Upload saja belum menerbitkan proyek. Website membaca data terbaru pada kunjungan baru, saat tab kembali aktif, atau paling lambat pada pembaruan otomatis 30 detik. **Muat ulang** mengambil data tersimpan dan membuang draft pada form.

Format upload: JPG, PNG, WebP, GIF, MP4 dan WebM; maksimal 50 MB per file. Foto maksimal 16.000 piksel pada tiap sisi. Video publik mendukung byte-range untuk seeking dan pemutaran browser. Hapus proyek menghapusnya dari galeri, tetapi file upload tetap disimpan agar media yang dipakai di tempat lain tidak rusak.

## Penyimpanan dan hosting

Implementasi ini menggunakan penyimpanan filesystem pada **satu server Node dengan disk persisten**:

- `data/content.json`: bahan, portofolio, preset dan video latar.
- `data/admin.json`: hash password, salt dan kunci penandatangan sesi. Jangan dipublikasikan.
- `data/uploads/`: media yang diunggah.

Data tidak disimpan di browser dan tidak ikut Git. Restart server tidak menghapus data. Cadangkan seluruh folder `data` secara rutin; file dan konten harus dipulihkan bersama. Lokasi dapat dipindahkan melalui `ZAN_DATA_DIR`.

**Filesystem lokal ini bukan penyimpanan serverless bersama.** Sebelum memakai Netlify/Vercel/serverless atau beberapa instance, pindahkan konten ke database dan upload ke object storage persisten. Deploy aplikasi saja tidak membuat data lokal laptop tersedia di hosting.

Pada development, setup akun pertama diperbolehkan dari localhost. Pada production atau setup non-localhost, isi `ADMIN_SETUP_TOKEN` di environment server, lalu masukkan token yang sama pada bagian “Setup dari luar localhost”. Production harus memakai HTTPS karena cookie sesi menggunakan `Secure`. Inisialisasi akun sebelum membuka instalasi development ke jaringan umum.

## Verifikasi

`node scripts/verify-admin.mjs` menjalankan pengujian handler dengan direktori sementara terpisah: setup/login, signed cookie, pembatasan akses, origin check, foto/video, serving range, validasi, publish/edit/delete dan konflik revisi. Test tidak membuat akun pada instalasi localhost asli.

`node scripts/verify-split-hero.mjs` memeriksa durasi slideshow dan gambar kendaraan untuk tema Light/Dark.
