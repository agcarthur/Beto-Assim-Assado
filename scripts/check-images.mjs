// Verifica se toda imagem referenciada em src/config/images.js existe em public/.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { todasAsImagens, hero, pratos } from '../src/config/images.js';

const publicDir = new URL('../public', import.meta.url).pathname;
let falhas = 0;

for (const img of todasAsImagens()) {
  const arquivo = join(publicDir, img.src);
  if (!existsSync(arquivo) || statSync(arquivo).size === 0) {
    console.error(`✗ ausente ou vazio: ${img.src}`);
    falhas++;
  } else {
    console.log(`✓ ${img.src}`);
  }
}

if (!hero) console.warn('! hero sem foto definida — usando a logo no lugar.');
const semFoto = pratos.filter((p) => !p.foto).map((p) => p.nome);
if (semFoto.length) console.warn(`! pratos sem foto: ${semFoto.join(', ')}`);

if (falhas) {
  console.error(`\n${falhas} imagem(ns) com problema.`);
  process.exit(1);
}
console.log('\nTodas as imagens configuradas foram encontradas.');
