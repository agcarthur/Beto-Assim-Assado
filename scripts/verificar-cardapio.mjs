// Confere a vitrine "Nosso Cardápio" contra o texto do iFood (conteudo/cardapio-ifood.md):
// cada prato existe no iFood, nome e link são exatamente os do iFood, o link é do
// domínio do iFood e a descrição curta (se houver) é trecho da descrição original.
// Falha o build se algo divergir.
import { readFileSync } from 'node:fs';
import { pratosIfood, prepararVitrine, LINK_IFOOD } from '../src/cardapio/modelo.js';
import { vitrineCardapio } from '../src/config/cardapio.js';

const texto = readFileSync(new URL('../conteudo/cardapio-ifood.md', import.meta.url), 'utf8');
const ifood = pratosIfood(texto);
const erros = [];

let vitrine = [];
try {
  vitrine = prepararVitrine(texto, vitrineCardapio);
} catch (e) {
  erros.push(e.message);
}

const vistos = new Set();
for (const prato of vitrine) {
  const original = ifood.get(prato.id);
  if (vistos.has(prato.id)) erros.push(`"${prato.nome}" aparece duas vezes na vitrine.`);
  vistos.add(prato.id);
  if (prato.nome !== original.nome) erros.push(`Nome de "${original.nome}" diferente do iFood: "${prato.nome}".`);
  if (prato.link !== original.url) erros.push(`Link de "${original.nome}" diferente do iFood.`);
  if (!LINK_IFOOD.test(prato.link)) erros.push(`Link de "${prato.nome}" não é do iFood.`);
  if (new URL(prato.link).searchParams.get('prato') !== prato.id) erros.push(`Link de "${prato.nome}" aponta para outro prato.`);
  console.log(`✓ ${prato.nome}${prato.foto ? ' · com foto' : ' · SEM FOTO'}\n    ${prato.link}`);
}

console.log(`\nVitrine: ${vitrine.length} prato(s). Disponíveis no texto do iFood: ${ifood.size}.`);
if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s) na vitrine:\n  - ${erros.join('\n  - ')}`);
  process.exit(1);
}
console.log('Vitrine confere com o conteúdo do iFood.');
