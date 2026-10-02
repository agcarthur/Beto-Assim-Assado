// Confere o cardápio do site contra o texto oficial do iFood (conteudo/cardapio-ifood.md):
// todo produto da fonte aparece exatamente uma vez, nenhum produto foi inventado, e
// nome, descrição, porção e preços são idênticos ao texto. Falha o build se algo divergir.
import { readFileSync } from 'node:fs';
import { lerIfood, montarCardapio, infoPessoas } from '../src/cardapio/modelo.js';
import { ajustesCardapio } from '../src/config/cardapio.js';

const texto = readFileSync(new URL('../conteudo/cardapio-ifood.md', import.meta.url), 'utf8');
const fonte = new Map();
for (const cat of lerIfood(texto)) for (const item of cat.itens) fonte.set(item.id, item);

const abas = montarCardapio(texto, ajustesCardapio);
const erros = [];
const avisos = [];
const exibidos = new Map();

for (const aba of abas) {
  for (const item of aba.itens) {
    if (exibidos.has(item.id)) erros.push(`"${item.nome}" aparece em duas abas.`);
    exibidos.set(item.id, aba.titulo);

    const original = fonte.get(item.id);
    if (!original) {
      erros.push(`"${item.nome}" não existe no conteúdo do iFood.`);
      continue;
    }
    const descricao = [item.serve && `${item.serve} |`, item.subtitulo, item.descricao].filter(Boolean).join(' ');
    const conferir = [
      ['nome', item.nome, original.nome],
      ['descrição', descricao, original.descricao],
      ['porção', item.servePorcao, original.servePorcao ?? null],
      ['preço', [item.precoPrefixo, item.preco].filter(Boolean).join(' '), original.preco],
      ['preço anterior', item.precoAnterior, original.precoAnterior ?? null],
    ];
    for (const [campo, site, ifood] of conferir) {
      if (site !== ifood) erros.push(`${campo} de "${original.nome}": site="${site}" iFood="${ifood}"`);
    }
    for (const preco of [item.preco, item.precoAnterior].filter(Boolean)) {
      if (!/^R\$ \d{1,3}(\.\d{3})*,\d{2}$/.test(preco)) erros.push(`Preço com formato inesperado em "${item.nome}": ${preco}`);
    }
    if (item.dias && !original.descricao.includes(item.dias)) erros.push(`Dias de "${item.nome}" não estão na descrição.`);

    const pessoas = infoPessoas(item);
    if (pessoas.length > 1) avisos.push(`"${item.nome}": a descrição diz "${item.serve}" e o iFood diz "${item.servePorcao}" (as duas informações são exibidas).`);
  }
}

for (const [id, item] of fonte) {
  if (!exibidos.has(id)) erros.push(`"${item.nome}" (${id}) está no iFood mas não aparece no site.`);
}

// Resumo
const entradas = lerIfood(texto).reduce((n, c) => n + c.itens.length, 0);
console.log(`Fonte: ${entradas} entradas, ${fonte.size} produtos únicos. Site: ${exibidos.size} produtos.`);
for (const aba of abas) {
  console.log(`\n${aba.titulo} (${aba.itens.length})`);
  for (const i of aba.itens) {
    const preco = [i.precoAnterior && `~~${i.precoAnterior}~~`, i.precoPrefixo, i.preco].filter(Boolean).join(' ');
    const extras = [...i.selos, i.foto && 'com foto'].filter(Boolean).join(', ');
    console.log(`  ✓ ${i.nome} · ${infoPessoas(i).join(' / ') || 'sem porção informada'} · ${preco}${extras ? ` [${extras}]` : ''}`);
  }
}
for (const aviso of avisos) console.warn(`\n! ${aviso}`);

if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s) no cardápio:\n  - ${erros.join('\n  - ')}`);
  process.exit(1);
}
console.log('\nCardápio confere com o conteúdo do iFood.');
