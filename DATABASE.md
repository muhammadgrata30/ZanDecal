# Database admin Zan Decal

Localhost tanpa environment Supabase menggunakan folder `data/` yang persisten. Akun lokal yang sudah ada tetap berlaku. Pada Netlify, aplikasi memerlukan Supabase PostgreSQL dan Storage; aplikasi menolak penulisan ke filesystem sementara agar perubahan tidak hilang setelah deploy.

## Mengaktifkan di Netlify

1. Buat proyek Supabase. Jalankan seluruh isi `supabase/migrations/001_zan_decal.sql` melalui SQL Editor. Migration dapat dijalankan ulang tanpa menghapus konten.
2. Isi environment Netlify dengan scope Functions: `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_SETUP_TOKEN`, dan `ZAN_SITE_URL`. Gunakan URL proyek dan secret key server dari Supabase, bukan publishable/anon key. Legacy `SUPABASE_SERVICE_ROLE_KEY` juga didukung. Jangan beri prefix `NEXT_PUBLIC_`.
3. Redeploy setelah mengubah environment. Buka `/admin`, buat akun pertama dengan username, password minimal 12 karakter dan setup token yang sama. Akun lokal laptop tidak otomatis tersalin ke database online.
4. Tambah bahan, warna, atau portofolio; unggah media; klik **Simpan & terbitkan**. Buka website publik untuk melihat hasilnya. Unggahan langsung menuju Storage melalui URL bertanda tangan agar video tidak melewati batas body serverless.

Jangan menaruh secret key di Git, frontend, atau chat. `.env.example` hanya berisi placeholder. Untuk mencoba Supabase di localhost, salin konfigurasi yang sudah diisi ke `.env.local`, lalu restart server.

## Hak akses dan penyimpanan

Admin dapat menambah, mengubah, menghapus, mengunggah dan menerbitkan. Pengunjung hanya dapat membaca konten dan media publik. Endpoint penulisan memeriksa cookie admin dan origin. Password disimpan sebagai hash scrypt dengan salt; cookie ditandatangani, HttpOnly dan Secure pada production. Saat ini tersedia satu akun pemilik, bukan manajemen banyak akun.

Database menyimpan bahan, portofolio, warna, video galeri dan akun. Tabel memakai RLS dan hanya dapat diakses melalui server dengan service role. Bucket `zan-media` dapat dibaca publik; unggahan memerlukan URL bertanda tangan. Simpan dan terbitkan memakai transaksi dengan revisi untuk mencegah tab lain menimpa perubahan tanpa diketahui. Menghapus portofolio tidak menghapus file yang mungkin masih dipakai konten lain.

Data lama di `data/` tidak otomatis dimigrasikan. Cadangkan folder tersebut sebelum berpindah penyimpanan. Untuk instalasi baru, konten bawaan website muncul sampai admin menerbitkan perubahan pertama.

## Verifikasi

- `node scripts/check-supabase.mjs`: pemeriksaan koneksi online hanya-baca untuk seluruh tabel dan bucket publik `zan-media`. Membaca environment proses atau `.env.local`; tidak mencetak key/data akun, membuat akun, mengunggah, atau mengubah konten. Exit 1 berarti konfigurasi/koneksi belum siap. Jalankan pada environment yang akan diuji; keberhasilan di laptop belum membuktikan environment Netlify sudah benar.
- `node scripts/verify-admin.mjs`: login/setup, cookie, akses admin, origin Netlify, unggah lokal, publikasi, perubahan, penghapusan dan konflik.
- `node scripts/verify-database.mjs`: menjalankan migration pada PostgreSQL PGlite, menguji transaksi, rollback, revisi, pembatasan akses dan migration berulang.
- `node scripts/verify-cloud-admin.mjs`: menguji kontrak HTTP Supabase dengan PostgreSQL nyata di PGlite dan storage simulasi; setup, role, unggahan bertanda tangan, publikasi dan URL media. Ini bukan bukti koneksi ke proyek Supabase online.

Konfigurasi salah ditampilkan pada halaman admin. Website publik memakai konten terakhir yang tersedia atau konten bawaan saat database tidak terjangkau; perubahan baru tetap memerlukan database aktif.
