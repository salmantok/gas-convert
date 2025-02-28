#!/usr/bin/env node
import path from 'path';
import { rollup } from 'rollup';

// Plugin untuk mengganti console.log menjadi Logger.log
function replaceConsoleLog() {
  return {
    name: 'replace-console-log',
    transform(code, id) {
      if (id.endsWith('.js') || id.endsWith('.mjs') || id.endsWith('.cjs')) {
        return {
          code: code.replace(/console\.log/g, 'Logger.log'),
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

// Jika argumen tidak diberikan, tampilkan Usage
if (!inputFile || !outputFile) {
  console.error(`
Error: Harap tentukan file input dan output!

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

(async () => {
  try {
    const bundle = await rollup({
      input: inputPath,
      plugins: [replaceConsoleLog()], // Tambahkan plugin custom
    });

    await bundle.write({
      file: outputPath,
      format: 'cjs', // Paksa output selalu dalam format CJS
    });

    console.log(`Bundle berhasil dibuat: ${outputFile}`);
  } catch (error) {
    console.error('Terjadi kesalahan saat bundling:', error);
  }
})();
