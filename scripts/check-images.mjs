// Verifica se toda imagem referenciada em src/config/images.js existe em public/.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { todasAsImagens, hero } from '../src/config/images.js';
import { ajustesCardapio } from '../src/config/cardapio.js';

const publicDir = new URL('../public', import.meta.url).pathname;
let falhas = 0;

const fotosCardapio = Object.values(ajustesCardapio.itens).flatMap(({ foto }) => (foto ? [foto.src, foto.avif] : []));
for (const caminho of new Set([...todasAsImagens(), ...fotosCardapio.filter(Boolean)])) {
  const arquivo = join(publicDir, caminho);
  if (!existsSync(arquivo) || statSync(arquivo).size === 0) {
    console.error(`✗ ausente ou vazio: ${caminho}`);
    falhas++;
  } else {
    console.log(`✓ ${caminho}`);
  }
}

if (!hero) console.warn('! hero sem foto definida — aguardando a foto da picanha.');

if (falhas) {
  console.error(`\n${falhas} imagem(ns) com problema.`);
  process.exit(1);
}
console.log('\nTodas as imagens configuradas foram encontradas.');
