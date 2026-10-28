# 🏁 Zan Decal — Premium Decal & Custom Sticker Studio

Website landing page modern untuk studio otomotif spesialis decal, full body wrap, livery motorsport, dan cutting sticker presisi tinggi bernama **Zan Decal**.

Dibangun menggunakan stack mutakhir: **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **Three.js** untuk 3D visualizer interaktif.

---

## ✨ Fitur Unggulan

### 🌗 1. Dual-Theme System
* **Clean Studio Mode (`#F8F9FE`):** Latar belakang terang minimalis dengan card putih bersih dan bayangan halus.
* **Midnight Garage Mode (`#0B0914`):** Nuansa garasi malam mewah dengan card semi-transparan *glassmorphism* dan aksen glow.
* **Aksen Warna Utama (Tri-Tone Gradient):** Soft Pink (`#FF9A9E`), Ungu Lavender (`#A18CD1`), dan Biru Muda (`#8FD3F4`).

### 🏎️ 2. 3D Decal Visualizer Interaktif (Three.js)
* **Tab Switcher Kendaraan:** Beralih antara **Mobil (BYD Seal 6 Aero)** dan **Motor (Superbike Track)**.
* **Kontrol Kamera 360° (OrbitControls):** Klik & geser untuk rotasi bebas, zoom in/out, tombol auto-rotate, dan reset kamera.
* **Control Dock Real-Time:**
  * Pilihan warna gradien (Zan Signature, Cyberpunk Neon, Sunset Flare, Nordic Aurora).
  * Pilihan warna solid (Midnight Black, Chalk Grey, Aero Cyan, Royal Lavender, Alpine White, Monza Red).
  * Karakter finishing material (**Glossy**, **Matte**, **Satin**) yang langsung mengubah roughness, metalness, dan clearcoat shader material 3D.
* **Unggah Model 3D Kustom:** Dukungan memuat file `.glb` / `.gltf` lokal langsung ke dalam kanvas 3D.
* **Order Otomatis ke WhatsApp:** Merangkai spesifikasi model, warna, finishing, dan kode preset langsung ke pesan WhatsApp studio (*tanpa pencantuman harga*).

### 🍱 3. Material & Keunggulan (Bento Grid)
* Layout Bento Grid futuristik menampilkan material decal internasional ternama:
  * **Oracal** (*970RA Premium Cast, RapidAir® Germany*)
  * **Maxdecal** (*9700 Pro Series Special Cast*)
  * **TeckWrap** (*USA Supergloss & Chameleon Series*)
* 3 Poin Keunggulan Utama:
  * **Ketahanan Cuaca:** Tahan panas hingga 90°C dan garansi anti-pudar 5-7 tahun cuaca tropis.
  * **Bubble-Free:** Saluran mikro heksagonal pelepas udara bebas gelembung.
  * **Garansi Resmi & Cat Aman:** Formula non-korosif, *zero adhesive residue*, dan garansi pengerjaan studio.
  * **Clean Room Facility:** Instalasi di ruangan ber-AC tertutup bebas debu.

### 🧭 4. Interactive Stepper Cara Order
* 4 tahapan alur pemesanan terstruktur dengan progress bar interaktif:
  1. *Pilih / Eksplorasi Desain*
  2. *Konsultasi WhatsApp & Mockup 3D*
  3. *Produksi Presisi & Quality Check*
  4. *Pemasangan Profesional di Clean Room*

### 📸 5. Galeri Portofolio Customer
* Filter kategori: **Semua**, **Mobil (BYD & Sport)**, **Motor Sport**, dan **Custom Sticker**.
* Detail hasil pengerjaan pelanggan dengan badge video reels/high-res photo, merk bahan, finishing, dan badge *Showroom Ready*.
* *Interactive Lightbox Modal* dengan tombol pemesanan desain serupa via WhatsApp.

### ✂️ 6. Floating Glassmorphism Navbar & Peeling Sticker Logo
* Navbar mengambang dengan efek *glassmorphism blur* dan tombol *Theme Switcher* Sun/Moon.
* Logo SVG kustom huruf **Z** sporty aerodinamis dengan efek potongan stiker terkelupas (*peeling decal flap*) dengan bayangan 3D realistis.

---

## 🚀 Memulai Proyek (Local Development)

1. Clone repository:
   ```bash
   git clone https://github.com/muhammadgrata30/ZanDecal.git
   cd ZanDecal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka di browser:
   ```
   http://localhost:3000
   ```

---

## 🌐 Deploy ke Vercel

Proyek ini telah dikonfigurasi dan siap di-deploy langsung ke Vercel dengan satu klik:

1. Buka [Vercel Dashboard](https://vercel.com/new).
2. Pilih repository **`muhammadgrata30/ZanDecal`**.
3. Vercel akan otomatis mendeteksi konfigurasi **Next.js**.
4. Klik **Deploy** dan website akan langsung online!

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
* **UI Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **3D Engine:** [Three.js](https://threejs.org/) & OrbitControls
* **Icons:** [Lucide React](https://lucide.dev/)
* **Language:** TypeScript
