#!/usr/bin/env node
import path from 'path';
import { rollup } from 'rollup';

// Plugin untuk mengganti console.log dan console.error ke Logger.log
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

// Logging informasi awal
console.log(`Memulai bundling...`);
console.log(`Input File: ${inputPath}`);
console.log(`Output File: ${outputPath}`);

(async () => {
  try {
    console.log('Mempersiapkan bundler...');

    const bundle = await rollup({
      input: inputPath,
      plugins: [replaceConsoleMethods()], // Tambahkan plugin custom
    });

    console.log('Menulis hasil bundling...');

    await bundle.write({
      file: outputPath,
      format: 'cjs', // Paksa output selalu dalam format CJS
    });

    console.log(`✅ Bundle berhasil dibuat: ${outputFile}`);
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat bundling:');
    console.error(error);
  }
})();
