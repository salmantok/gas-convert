<p><a href="https://github.com/salmantok/gas-convert.git"class="link">gas-convert </a>mengonversi dan mengoptimalkan kode JavaScript agar kompatibel dengan <a href="https://script.google.com"class="link">Google Apps Script</a>.</p>

## Instalasi

```bash
npm install -g gas-convert
```

<p>Sebelum menggunakan pastikan <a href="https://github.com/google/clasp#readme"class="link">@google/clasp </a>sudah terinstall di sistem operasi Anda, jika belum terinstall maka install terlebih dahulu.</p>

```bash
npm install -g @google/clasp
```

Setelah itu login

```bash
clasp login
```

Kemudian buat project di direktori saat ini

```bash
clasp create
```

Atau di direktori src

```bash
mkdir src && clasp create --rootDir src && mv src/.clasp.json .
```

Atau clone di direktori saat ini jika Anda sudah membuat project sebelumnya

```bash
clasp clone <scriptId> --rootDir .
```

Atau clone di direktori src jika Anda sudah membuat project sebelumnya

```bash
mkdir src && clasp clone <scriptId> --rootDir src && mv src/.clasp.json .
```

### Sintaks CLI `gas-convert`

`gasc <inputFile> <outputFile>`

```bash
gasc index.js Kode.js
```

Atau:

```bash
gasc index.js src/Kode.js
```

Unggah hasil konversi ke Google Apps Script

```bash
clasp push
```

### Contoh project

Ada 3 cara untuk konversi

Buat file sumber terlebih dahulu, misalnya (utils.js, logger.js, dan index.js), lalu gabungkan menjadi satu file.

#### Cara ke 1.

```js
// utils.js
export function sayHello(name) {
  console.log(`Halo, ${name}!`);
}
```

```js
// logger.js
export function logMessage(message) {
  console.log(`LOG: ${message}`);
}
```

```js
// index.js
import { sayHello } from './utils.js';
import { logMessage } from './logger.js';

console.log('Program dimulai');
sayHello('GAS');
logMessage('Ini adalah pesan log');
console.log('Program selesai');
```

#### Cara ke 2.

```js
// utils.js
export function sayHello(name) {
  console.log(`Halo, ${name}!`);
}
```

```js
// logger.js
export function logMessage(message) {
  console.log(`LOG: ${message}`);
}
```

```js
// index.js
import { sayHello } from './utils.js';
import { logMessage } from './logger.js';

console.log('Program dimulai');
sayHello('GAS');
logMessage('Ini adalah pesan log');
console.log('Program selesai');

// Tambahkan fungsi ke globalThis agar bisa diakses di mana saja
globalThis.sayHello = sayHello;
globalThis.logMessage = logMessage;
```

#### Cara ke 3.

```js
// utils.js
export function sayHello(name) {
  console.log(`Halo, ${name}!`);
}
```

```js
// logger.js
export function logMessage(message) {
  console.log(`LOG: ${message}`);
}
```

```js
// index.js
import { sayHello } from './utils.js';
import { logMessage } from './logger.js';

console.log('Program dimulai');

function doPost(e) {
  console.log('App Started');

  // Daftarkan fungsi ke globalThis saat doPost dipanggil
  globalThis.sayHello = sayHello;
  globalThis.logMessage = logMessage;

  // Contoh pemanggilan fungsi setelah terdaftar di globalThis
  sayHello('GAS');
  logMessage('Ini adalah pesan log');

  console.log('Program selesai');
}
globalThis.doPost = doPost;
```

### Penjelasan Hasil konversi Satu per Satu

1️⃣ **Hasil Konversi Pertama**

✅ **Penjelasan:**

- Semua kode berjalan **langsung saat script dieksekusi**.
- Fungsi `sayHello` dan `logMessage` langsung dipanggil setelah definisi.
- Tidak ada **`globalThis`**, jadi fungsi **tidak bisa diakses** dari luar file.
- Ini cocok untuk **sistem yang tidak perlu fungsi global**, tetapi kurang fleksibel untuk **Google Apps Script**.

**2️⃣ Hasil Konversi Kedua**

✅ **Penjelasan:**

- Kode tetap langsung dieksekusi seperti pada **Cara ke 1**.
- **Perbedaan utama** adalah fungsi `sayHello` dan `logMessage` **ditambahkan ke `globalThis`**, sehingga bisa dipanggil dari luar.
- Contoh:

```js
sayHello('GAS'); // Bisa dipanggil di Google Apps Script
logMessage('Pesan baru');
```

- **Kelebihan:** Bisa digunakan di luar file.
- **Kekurangan:** Masih kurang fleksibel karena **kode langsung berjalan saat file dimuat**, bukan hanya saat diperlukan.

**3️⃣ Hasil Konversi Ketiga**

✅ **Penjelasan:**

- Tidak seperti cara sebelumnya, sekarang fungsi tidak langsung berjalan kecuali melalui `doPost()`.
- **doPost() sebagai titik masuk utama** untuk Google Apps Script.
- Saat `doPost()` dipanggil:

1. `Logger.log("App Started")` dieksekusi.
2. `sayHello` dan `logMessage` ditambahkan ke `globalThis`.
3. Fungsi dipanggil untuk menunjukkan bahwa mereka bekerja.
4. `Logger.log("Program selesai")` dicetak di akhir.

- **Kelebihan:**
- **Lebih fleksibel** karena hanya berjalan saat `doPost()` dipanggil.
- Fungsi tetap bisa digunakan di luar `doPost()`.
- Kompatibel dengan **Google Apps Script**.

<div class="container">
<h2 class="mb-4">Kesimpulan</h2>
<div class="table-responsive">
<table class="table table-bordered table-striped">
<thead class="table-dark">
<tr>
<th>Versi</th>
<th>Kapan Kode Berjalan?</th>
<th>Bisa Pakai globalThis?</th>
<th>Cocok Untuk?</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Cara ke 1</strong></td>
<td>Langsung saat script dijalankan</td>
<td class="text-danger">❌ Tidak</td>
<td>Skrip mandiri</td>
</tr>
<tr>
<td><strong>Cara ke 2</strong></td>
<td>Langsung saat script dijalankan</td>
<td class="text-success">✅ Ya</td>
<td>Bisa diakses di luar file, tapi tetap langsung berjalan</td>
</tr>
<tr>
<td><strong>Cara ke 3</strong></td>
<td>Hanya saat <code>doPost()</code> dipanggil</td>
<td class="text-success">✅ Ya</td>
<td>Google Apps Script, lebih fleksibel</td>
</tr>
</tbody>
</table>
</div>
<div class="alert alert-info mt-4">
<strong>💡 Rekomendasi: </strong>Gunakan <strong>Cara ke 3 </strong>untuk <strong>Google Apps Script</strong>, karena lebih fleksibel dan tidak langsung berjalan sebelum <code>doPost()</code> dipanggil.
</div>
</div>
