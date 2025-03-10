#!/usr/bin/env node
import path from 'path';
import chalk from 'chalk';
import { rollup } from 'rollup';

// Plugin untuk mengganti semua method console agar kompatibel dengan Google Apps Script
function replaceConsoleMethods() {
  return {
    name: 'replace-console-methods',
    transform(code, id) {
      if (id.endsWith('.js') || id.endsWith('.mjs') || id.endsWith('.cjs')) {
        return {
          code: code
            .replace(/console\.log/g, 'Logger.log')
            .replace(/console\.error/g, 'Logger.log'),
          map: null,
        };
      }
    },
  };
}

// Ambil argumen dari CLI
const args = process.argv.slice(2);
const inputFile = args[0];
const outputFile = args[1];

// Jika argumen tidak diberikan, tampilkan pesan error
if (!inputFile || !outputFile) {
  console.error(chalk.red('[ERROR] Harap tentukan file input dan output!'));
  console.log(`
Usage:
  gasc <inputFile> <outputFile>

Contoh:
  gasc index.js Kode.js
  gasc index.js src/Kode.js
  `);
  process.exit(1);
}

// Tentukan path input dan output
const inputPath = path.resolve(process.cwd(), inputFile);
const outputPath = path.resolve(process.cwd(), outputFile);

// Logging informasi awal
console.log(chalk.blue('[INFO] Memulai konversi...'));
console.log(chalk.blue('[INFO] Input File:'), chalk.yellow(inputPath));
console.log(chalk.blue('[INFO] Output File:'), chalk.yellow(outputPath));

(async () => {
  try {
    console.log(chalk.blue('[INFO] Mempersiapkan konversi...'));

    const bundle = await rollup({
      input: inputPath,
      plugins: [replaceConsoleMethods()], // Tambahkan plugin custom
    });

    console.log(chalk.blue('[INFO] Menulis hasil konversi...'));

    await bundle.write({
      file: outputPath,
      format: 'cjs', // Paksa output selalu dalam format CJS
    });

    console.log(
      chalk.green(`✅ Konversi berhasil: ${chalk.yellow(outputFile)}`)
    );
  } catch (error) {
    console.error(
      chalk.red(
        `❌ Terjadi kesalahan saat konversi ${chalk.yellow(inputFile)} → ${chalk.yellow(outputFile)}:`
      )
    );
    console.error(error);
  }
})();
