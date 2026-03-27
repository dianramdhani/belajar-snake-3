# Product Requirement Document (PRD): Snake AI Auto-Play

## 1. Ringkasan Produk
**Snake AI Auto-Play** adalah aplikasi berbasis web yang mendemonstrasikan berbagai algoritma pencarian jalur (pathfinding) dalam permainan klasik Snake. Aplikasi ini memungkinkan pengguna untuk melihat bagaimana AI mengambil keputusan secara real-time untuk mencari makanan sambil menghindari rintangan (tubuh sendiri dan batas dinding).

## 2. Tujuan Proyek
- Menyediakan platform visualisasi untuk algoritma AI (BFS, A*, dll).
- Mengedukasi pengguna tentang perbedaan efisiensi antar algoritma.
- Memberikan pengalaman interaktif dalam memantau performa AI melalui statistik dan metrik performa.

## 3. Fitur Utama

### A. Gameplay Otomatis (Auto-Play)
- AI menggerakkan ular secara otomatis tanpa input pengguna.
- Pemilihan algoritma secara dinamis saat permainan berlangsung.
- Deteksi tabrakan otomatis dan penanganan Game Over.

### B. Algoritma AI yang Tersedia
- **BFS (Breadth-First Search):** Mencari jalur terpendek secara absolut (tidak mempertimbangkan bobot).
- **A\* (A-Star):** Algoritma pencarian jalur cerdas menggunakan heuristik (jarak Manhattan).
- **Greedy BFS:** Fokus pada langkah tercepat menuju target tanpa mempertimbangkan panjang jalur keseluruhan.
- **Greedy A\*:** Variasi A* yang lebih condong ke arah target untuk kecepatan eksekusi.

### C. Panel Kontrol (Control Panel)
- **Start/Pause/Resume:** Mengontrol jalannya simulasi.
- **Speed Control:** Mengatur kecepatan gerak ular (ms interval).
- **Algorithm Selector:** Memilih algoritma yang akan digunakan oleh AI.
- **Grid Size Selector:** Mengatur ukuran arena permainan.

### D. Statistik & Performa
- **Score Tracking:** Skor saat ini dan skor tertinggi (High Score).
- **Game Stats:** Jumlah makanan yang dimakan, total langkah, dan rata-rata skor.
- **Performance Monitor:** FPS (Frames Per Second) dan waktu eksekusi algoritma (ms).

## 4. Stack Teknologi
- **Frontend Framework:** React 19
- **Bahasa Pemrograman:** TypeScript 5.8
- **State Management:** Zustand 5
- **Styling:** Tailwind CSS 4 (menggunakan sistem desain modern & dark mode)
- **Build Tool:** Vite

## 5. Arsitektur Teknis

### A. Struktur Folder
- `/src/ai`: Logika algoritma, heuristik, dan sistem keamanan (safety checker).
- `/src/game`: Mesin permainan (grid, tabrakan, generator makanan).
- `/src/components`: Komponen UI (Board, Controls, Stats).
- `/src/store`: Manajemen keadaan aplikasi menggunakan Zustand.
- `/src/hooks`: Logika kustom untuk game loop dan integrasi AI.

### B. Alur Logika Utama
1. **Game Loop:** Dijalankan via `useGameLoop` dengan interval waktu tertentu.
2. **AI Decision:** Pada setiap "tick", `useAI` memanggil algoritma yang dipilih untuk mendapatkan koordinat target berikutnya.
3. **Validation:** Langkah yang dipilih divalidasi oleh `safetyChecker.ts` agar ular tidak menabrak dirinya sendiri secara konyol.
4. **State Update:** Koordinat baru dikirim ke `gameStore` untuk merender ulang UI.

## 6. Desain Visual (UI/UX)
- **Dark Mode Aesthetic:** Latar belakang gelap (`gray-950`) dengan aksen gradien (`purple-400` ke `cyan-400`).
- **Responsive Layout:** Sidebar kontrol di sebelah kanan (atau bawah pada mobile) dan papan permainan di tengah.
- **Micro-animations:** Transisi halus pada pergerakan ular dan efek visual saat memakan makanan.

## 7. Roadmap Masa Depan (Rencana Pengembangan)
- **Genetic Algorithm:** Menambahkan pembelajaran mesin (Reinforcement Learning) agar ular belajar dari kesalahan.
- **Multi-Food Mode:** Menambahkan lebih banyak target makanan sekaligus untuk menguji kompleksitas AI.
- **Obstacle Mode:** Menambahkan rintangan statis atau dinamis di dalam grid.
- **Leaderboard:** Integrasi database untuk menyimpan skor tertinggi dari berbagai pengguna.
- **Replay System:** Kemampuan untuk merekam dan memutar ulang sesi permainan AI tertentu.
