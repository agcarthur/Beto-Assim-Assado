// Verifica se toda imagem referenciada em src/config/images.js existe em public/.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { todasAsImagens, hero, pratos } from '../src/config/images.js';

const publicDir = new URL('../public', import.meta.url).pathname;
let falhas = 0;

for (const caminho of todasAsImagens()) {
  const arquivo = join(publicDir, caminho);
  if (!existsSync(arquivo) || statSync(arquivo).size === 0) {
    console.error(`✗ ausente ou vazio: ${caminho}`);
    falhas++;
  } else {
    console.log(`✓ ${caminho}`);
  }
}

if (!hero) console.warn('! hero sem foto definida — aguardando a foto da picanha.');
const semFoto = pratos.filter((p) => !p.foto).map((p) => p.nome ?? p.id);
if (semFoto.length) console.warn(`! pratos sem foto: ${semFoto.join(', ')}`);
const semNome = pratos.filter((p) => !p.nome).map((p) => p.id);
if (semNome.length) console.warn(`! pratos sem nome informado: ${semNome.join(', ')}`);

if (falhas) {
  console.error(`\n${falhas} imagem(ns) com problema.`);
  process.exit(1);
}
console.log('\nTodas as imagens configuradas foram encontradas.');
