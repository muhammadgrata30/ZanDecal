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

## Hero B3 dan studio 3D ‚Äî catatan terbaru

- Pengguna telah mengizinkan implementasi hero B3, studio Colour Chamber, serta animasi seluruh section pada 30 Oktober 2026.
- Hero yang sedang dipertimbangkan: B3 / The Material Atelier, `public/design-preview/hero-study-v4-b3.png`.
- Studio yang disukai: bagian studio dari opsi ketiga / Colour Chamber, `public/design-preview/hero-studio-v3-3.png`. Preferensi ini mencakup studio saja, bukan hero opsi tersebut.
- Gunakan Ducati Streetfighter V4 S lokal. Perubahan warna harus mengenai panel cat utama, bukan rangka dan komponen mekanis.
- Konsep animasi awal yang disimpan: motor muncul dengan sorotan pada cat; lembar vinyl bergerak perlahan; hero pinned saat scroll; kamera mengitari motor; headline keluar bertahap; vinyl menyapu layar sebagai transisi ruang gelap hero ke studio putih; motor menetap di panggung lalu kontrol tampil.
- Gerakan transisi mengikuti posisi scroll dan dapat dibalik saat scroll ke atas. Pendekatan yang diusulkan menggabungkan model/kamera 3D dengan animasi teks, transisi, dan kontrol 2D.
- Implementasi mencakup Ducati dan BYD dengan roda berputar, perpindahan kendaraan dan kamera mengikuti scroll, transisi masuk yang berbeda per section, serta tema light/dark. Optimasi memakai satu Canvas, pembaruan berbasis ref, animasi transform/opacity, dan penghentian render ketika section tidak terlihat.
- Revisi yang disetujui: hero kendaraan maju, studio kendaraan masuk dari kiri ke kanan, transisi pintu garasi mengikuti scroll. Kain dihapus; hero dan studio memakai arsitektur garasi 3D. Zoom memakai pinch dua jari, sementara scroll biasa tetap menavigasi halaman.
- Revisi hero terbaru: latar hero dipisahkan dari garasi studio menjadi arena arsitektur terbuka dengan portal cahaya. Kendaraan diperbesar, headline lebih dominan dan beranimasi, sementara alur berkendara dan transisi dipertahankan. Studio diperkaya alat decal/modifikasi dan 12 pilihan warna.

## Hero final yang dipilih ‚Äî studi VI opsi 4

- Target visual: `public/design-preview/hero-v6-4.png`, tampak depan kendaraan dengan sisi kiri gelap/lavender dan kanan terang/putih; headline ‚ÄúSATU BENTUK. BANYAK KARAKTER.‚Äù
- Hero memakai gambar, bukan Canvas atau model 3D. Ducati dan BYD bergantian: 3.000 ms diam, 1.000 ms transisi, berulang.
- Tampilan awal mempertahankan pembagian 50/50 mockup. Pilih Light menyapu terang dari kanan ke kiri hingga penuh dan menerapkan tema terang seluruh website. Pilih Dark menyapu gelap dari kiri ke kanan hingga penuh dan menerapkan tema gelap seluruh website. Preferensi tema global tetap tersimpan.
- Studio 3D dengan alat decal dan 12 warna tetap ada sebagai section tersendiri di bawah hero.
- Pembuatan admin dinamis belum dimulai. Pengguna meminta konfirmasi tersendiri sebelum tahap admin.
- Pengguna kemudian secara eksplisit mengizinkan pengerjaan admin setelah penyesuaian warna kendaraan hero. Izin ini menggantikan status menunggu konfirmasi sebelumnya.

## Hero bertema dan admin dinamis

- Light menggunakan gambar kendaraan full pearl white; Dark menggunakan full lavender; belum memilih tema menampilkan gambar split seperti mockup. Preferensi yang tersimpan dipulihkan saat halaman dibuka kembali.
- Admin `/admin`: akun pertama ditentukan pengguna, kemudian login. Pengelolaan bahan, foto/video portofolio, preset warna studio dan video latar galeri terhubung ke konten publik yang persisten pada filesystem lokal.

## Hero produksi ó Apex Livery (7 November 2026)

- Pengguna menyetujui pemasangan versi pilihan ke project utama.
- Halaman utama memakai ApexLiveryHero: tujuh pita 2D melengkung dari atas ke bawah sepanjang hero, tanpa objek kiri bawah atau panel mockup.
- Decal tetap memakai logo ZAN asli, material vinyl realistis, dan pencahayaan studio adaptif.
- Lenis dipasang sekali di layout; perangkat sentuh dan reduced motion mempertahankan scroll native.
- Perangkat ringan memakai geometri/tekstur kecil tanpa HDRI atau bayangan dinamis; renderer berhenti ketika hero diam atau tidak terlihat.

## Pilihan section terbaru ó galeri 10 mockup (7 November 2026)

- Komisi Baru dipilih dari mockup 8 / Night Manifesto: varian komisi 3 / A Colour Manifesto, headline WARNA PUNYA SUARA., visual pembuka penuh layar, parallax, dan brief setelah pembuka.
- Footer dipilih dari mockup 2 / Technical Edition: varian footer 4 / Cut & Close, headline POTONG YANG BIASA., jalur cutting saat scroll dan wordmark besar.
- Nomor 8 dan 2 mengacu pada kombinasi mockup, bukan nomor varian pada dropdown masing-masing section.
- Interactive Studio belum dipilih; pertahankan studio produksi sekarang.
- Pilihan ini disimpan untuk tahap pemasangan berikutnya; halaman utama belum diubah oleh pemilihan ini.

## Pemasangan Komisi Baru dan Footer ó 7 November 2026

- Pengguna meminta pemasangan sekarang; pilihan di atas sudah diterapkan ke halaman utama.
- Komisi Baru memakai A Colour Manifesto dari mockup 8: foto penuh layar, headline WARNA PUNYA / SUARA., alur tiga tahap, dan form konsultasi produksi yang mempertahankan detail kendaraan, layanan, finishing, catatan, serta WhatsApp.
- Footer memakai Cut & Close dari mockup 2: bidang lavender, headline POTONG YANG BIASA., garis cutting mengikuti scroll, wordmark besar, navigasi section dan tautan kontak/admin.
- Animasi GSAP/ScrollTrigger memakai scope per section dan dinonaktifkan untuk prefers-reduced-motion.
- Interactive Studio dan hero Apex Livery tidak diubah dalam pemasangan ini.
- Intro hero mengunci scroll halaman dan Lenis sampai class settled aktif; skip, fallback renderer, dan unmount melepaskan kunci. Sapuan berulang pada hero tidak mengunci scroll.

## Footer dan keterbacaan form - 7 November 2026

- Headline footer diganti menjadi TRUST ME IT WORKS.
- Wordmark ZAN DECAL berada paling akhir footer dengan setengah bawah huruf terpotong di batas section.
- Semua kelompok teks footer memakai reveal GSAP per huruf saat masuk viewport, dengan reduced-motion tetap statis.
- Tombol panah dan Mulai komisi di footer menuju #komisi-visual (gambar Komisi Baru).
- Teks isi/footer sekitar 14px, detail kecil minimal 12px; label form 14px dan input 16px.
- Form mendapat label permanen, area input berbingkai, pilihan layanan lebih lapang, dan ringkasan pilihan. Alur WhatsApp dipertahankan.

## Interactive Studio: zoom dan grid - 7 November 2026

- Batas zoom dihitung dari bounding sphere model yang sudah dinormalisasi, FOV, rasio canvas, dan ruang kontrol. Target kamera mengikuti pusat model.
- Resize, pergantian kendaraan, dan pergantian view mengatur ulang framing supaya kendaraan tetap utuh.
- Tambahkan grid kotak pada lantai preview, toggle Grid, tombol Pas ke layar, serta bingkai tipis di viewport.
- Zoom Ctrl/pinch dan rotasi dipertahankan; scroll halaman biasa tetap berjalan.

## Zoom, intro, dan navigasi langsung - 7 November 2026

- Rentang zoom-in studio diperluas menjadi 45 persen dari framing awal, tetap dibatasi agar model utuh. Tambahkan tombol minus/plus dengan interpolasi kamera berbasis demand render.
- Navbar menavigasi langsung memakai satu pemilik scroll (Lenis atau native), offset tinggi navbar aktual, dan anchor flow stabil untuk studio yang sticky.
- Intro-ke-hero memakai kedatangan teks pendek tanpa flip atau flex berulang; gutter scrollbar stabil untuk mengurangi pergeseran saat scroll dibuka.
- Resize renderer diabaikan setelah disposal/context loss untuk mencegah error callback tertunda.

## Zoom rapat dan halaman bersih - 7 November 2026

- Batas zoom kini memakai proyeksi delapan sudut bounding box pada arah kamera aktif, bukan batas bola yang terlalu longgar. Kamera menjaga seluruh model tetap masuk frame saat orbit berubah.
- Studio memakai alur normal agar target navbar tidak ikut tertahan sticky. Navigasi memakai offset header aktual dan tiga koreksi frame singkat setelah loncat.
- Nomor section/nav, kode studi, label edisi, dan tagline mikro dekoratif di hero, studio, material, custom sticker, galeri, cara order, komisi, dan footer dihapus.
- Label kontrol, informasi layanan, keterangan bahan, dan atribusi model tetap dipertahankan.

## Lima arah Interactive Studio - 8 November 2026

- Permintaan terbaru: zoom kembali lewat pinch atau Ctrl/Meta + scroll, jarak 4-14; tombol minus/plus dihapus. Grid dan reset tetap tersedia.
- Mockup: /studio-directions?option=1 sampai option=5. Oxide Gallery, Acid Pitlane, Aubergine Atelier, Ice Archive, Olive Foundry.
- Masing-masing mempunyai layout, palet, kontrol model 3D, finishing, uraian motion dan alasan adaptasi referensi Awwwards: Lusion v3, KPR, Unseen Studio, Igloo Inc, Rouser.
- Desain utama belum diganti oleh mockup. TypeScript, ESLint dan HTTP kelima opsi lolos. Verifikasi visual belum tersedia karena browser access host tidak aktif.

## Studio pink-biru dan kendaraan masuk - 8 November 2026

- Studio utama dipoles dengan warna brand pink #FF9A9E, cyan #8FD3F4, lavender #A18CD1; panggung biru pucat, panel pink, teks navy dan varian gelap yang terbaca.
- Ukuran kontrol/material diperbesar, swatch bulat, finishing dua kolom, heading besar dan tiga spesimen warna. Tanpa menambah nomor section atau tombol zoom.
- Kendaraan dan bayangannya bergerak bersama dari sisi panggung ke tengah dengan easing 1.35 detik saat section terlihat; pergantian kendaraan mengulang entrance. Reduced motion menempatkan model langsung di tengah.
- Render tetap demand, animasi memakai ref tanpa update React setiap frame, berhenti saat selesai atau tab tidak aktif. Tidak ada postprocessing baru.
- TypeScript dan ESLint lolos; homepage HTTP 200. Belum diverifikasi visual/performa perangkat lewat browser otomatis.

## Pilihan dikoreksi: opsi 1 dengan palet Zan - 8 November 2026

- Pengguna memilih opsi 1 (Oxide Gallery), bukan layout kotak dari revisi sebelumnya. Studio utama kini memakai judul kiri, panggung arch, bidang pink di belakang, dan rail kontrol terpisah di kanan. Mobile ditumpuk tanpa kehilangan bentuk arch.
- Warna utama pink #FF9A9E dan cyan #8FD3F4, didukung lavender, navy, dan putih studio. Mockup opsi 1 juga diperbarui ke palet brand.
- Roda memakai rig terpisah yang sudah ada. Rotasi setiap roda = minus jarak tempuh / radius aktual; translasi memakai progress easing yang sama sehingga roda melambat dan berhenti bersama kendaraan. Yaw tambahan dihapus agar gerak maju selaras sumbu roda.
- Verifikasi rig: Ducati 2 roda, BYD 4 roda, geometri utuh. Homepage dan opsi 1 HTTP 200. Pengaturan reduced motion dan demand rendering dipertahankan.

## Pilihan akhir Studio: opsi 3 mengikuti tema - 8 November 2026

- Permintaan terbaru mengganti pilihan opsi 1 ke opsi 3 (Aubergine Atelier). Studio utama memakai headline penuh di atas, kontrol kiri, panggung arch tinggi di kanan, dan komposisi bertumpuk pada layar kecil.
- Background section dan permukaan kontrol memakai token bg-primary dari tema situs. Clear color canvas menyamai tema global: terang #f5f3ef, gelap #17141d. Tidak memakai background aubergine tetap dari mockup.
- Pink dan cyan tetap sebagai aksen brand. Warna teks mengikuti token tema dengan aksen judul yang disesuaikan kontrasnya.
- Animasi kendaraan datang dengan roda berputar tetap dipertahankan. Homepage HTTP 200 dengan headline opsi 3.

## Pilihan akhir diperbarui: opsi 4, intro dan scroll - 8 November 2026

- Pengguna mengganti pilihan ke opsi 4 (Ice Archive). Panggung persegi tinggi di kiri, judul dan kontrol di kanan. Background memakai tema aktif; warna canvas terang #f5f3ef dan gelap #17141d tetap sama dengan situs. Aksen pink/cyan dan roda masuk dipertahankan.
- Intro kini menambahkan kelas settled setelah frame hero pertama dirender. Tombol skip hanya menandai permintaan; runtime menyelesaikan handoff sebelum scroll dibuka.
- Resize renderer mengabaikan notifikasi yang tidak mengubah ukuran maupun pixel ratio, sehingga drawing buffer tidak dikosongkan tanpa kebutuhan saat handoff.
- Tinggi hero dideklarasikan tetap sebelum/sesudah settled. ScrollStage hanya sticky bila panel muat dalam viewport; panel tinggi memakai alur normal dan progress berdasarkan perjalanan penuh melewati viewport.
- Regresi scroll diuji dua arah: progress kembali melalui posisi yang sama, tanpa snap 1px pada panel panjang. TypeScript, ESLint, tes scroll stage, scroll lock intro, material hero/HDRI, dan anggaran kualitas hero lolos. Homepage HTTP 200. Verifikasi visual browser belum tersedia.

## Perbaikan konflik scroll tepat di Studio - 8 November 2026

- Sumber konflik: listener capture pada canvas memakai stopImmediatePropagation untuk wheel biasa. Event tidak sampai ke Lenis sehingga scroll native dan smooth scroll bergantian saat pointer melintasi viewport 3D.
- Listener kini hanya menonaktifkan zoom OrbitControls selama dispatch wheel biasa, tanpa menghentikan event. Ctrl/Meta wheel tetap untuk zoom dan diberi penanda agar tidak menggerakkan halaman. Zoom pinch dipulihkan sesudah dispatch dan sebelum pointerdown.
- Pemulihan memakai task timer, bukan microtask yang dapat berjalan di antara callback listener browser. Cleanup menghapus listener/timer dan mengembalikan touch-action.
- Lenis allowNestedScroll menangani batas daftar swatch; motor-palette tidak lagi dikecualikan secara penuh dari pemilik scroll.
- Tes regresi melewatkan wheel naik/turun, Ctrl/Meta zoom, kontrol nonaktif, dukungan pinch dan cleanup. Tes lolos; homepage HTTP 200. Verifikasi gesture visual browser belum tersedia.

## Bahan sebelum Studio dan curtain GSAP - 8 November 2026

- Urutan MaterialCurtain ditukar menjadi bahan lalu Interactive Studio, dalam normal document flow. Anchor dan ID section dipertahankan.
- Studio memakai curtain dua panel pink/cyan yang membuka ke samping saat viewport 3D memasuki layar. GSAP menggerakkan transform scaleX, judul naik pendek, dan kontrol stagger. Tanpa pin, perubahan tinggi atau wheel handler baru.
- Curtain diputar sekali sampai selesai meski pengguna membalik arah scroll. Entrance kendaraan dimulai setelah pembukaan curtain berjalan 0.32 detik, dengan roda tetap mengikuti jarak tempuh.
- Reduced motion melewati curtain dan memulai model lewat IntersectionObserver. Konten tetap terlihat tanpa GSAP atau jika import gagal; timeline dan trigger dibersihkan saat unmount.
- HTTP 200 mengonfirmasi bahan berada sebelum Studio dan markup curtain tersedia. Regresi scroll canvas tetap lolos.

## Curtain tambahan Hero-Bahan dan Komisi-Footer - 8 November 2026

- Pengguna memilih penempatan 3 dan 2: curtain pembuka Bahan setelah Hero serta curtain Footer setelah Komisi Baru.
- BoundaryCurtain memakai dua lapisan transform translateY ke atas, sekali saat section masuk viewport. Bahan memakai permukaan tema dengan tepi cyan dan lapisan pink; footer memakai navy.
- Overlay absolut setinggi maksimal viewport; tanpa pin, scroll lock, tambahan runway atau handler wheel. Pointer events none, fokus kontrol langsung menyingkap overlay, reduced motion melewati seluruh efek.
- GSAP diimpor dinamis, scoped matchMedia, timeline/ScrollTrigger dibersihkan saat unmount. Default overlay hidden menjaga konten tersedia bila import gagal.
- HTTP 200 mengonfirmasi kedua curtain baru dan curtain Studio hadir, dengan urutan Bahan sebelum Studio tetap benar. Regresi input Studio dan progress scroll dua arah lolos. Verifikasi visual browser belum tersedia.
