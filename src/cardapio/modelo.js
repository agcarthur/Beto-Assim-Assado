/**
 * Lê o texto copiado do iFood (conteudo/cardapio-ifood.md) e monta a vitrine
 * "Nosso Cardápio". Nome e link de cada prato saem do texto do iFood, nunca
 * digitados à mão; a configuração (src/config/cardapio.js) só escolhe quais
 * pratos entram e com qual foto.
 *
 * Não depende do navegador: o mesmo código roda em scripts/verificar-cardapio.mjs.
 */

const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
export const LINK_IFOOD = /^https:\/\/www\.ifood\.com\.br\//;

/** Lê o texto do iFood: categorias na ordem do arquivo, itens exatamente como estão. */
export function lerIfood(texto) {
  const categorias = [];
  let categoria = null;
  let item = null;

  for (const bruta of texto.split('\n')) {
    const linha = bruta.trim();
    if (!linha) continue;

    const links = [...linha.matchAll(LINK)].map(([, rotulo, url]) => ({ rotulo, url }));
    if (!links.length) {
      // Linha sem link = título de categoria
      categoria = { titulo: linha, itens: [] };
      categorias.push(categoria);
      item = null;
      continue;
    }

    const id = new URL(links[0].url).searchParams.get('prato');
    if (!id) throw new Error(`Link sem id de prato: ${linha}`);
    if (!categoria) throw new Error(`Item antes de qualquer categoria: ${linha}`);
    if (!item || item.id !== id) {
      item = { id, url: links[0].url, linhas: [] };
      categoria.itens.push(item);
    }
    item.linhas.push(links);
  }

  for (const cat of categorias) cat.itens = cat.itens.map(interpretarItem);
  return categorias;
}

function interpretarItem({ id, url, linhas }) {
  const [nome, descricao, ...resto] = linhas;
  if (!descricao) throw new Error(`Item sem descrição: ${id}`);
  const item = { id, url, nome: nome[0].rotulo, descricao: descricao[0].rotulo };
  for (const links of resto) {
    const rotulo = links[0].rotulo;
    if (/^Serve \d+ pessoas?$/.test(rotulo)) item.servePorcao = rotulo;
    else if (/R\$ \d/.test(rotulo)) {
      item.preco = rotulo;
      if (links[1]) item.precoAnterior = links[1].rotulo;
    } else if (rotulo === 'Fechado') item.statusLoja = rotulo; // status da loja, não do prato
    else throw new Error(`Linha não reconhecida no item ${id}: ${rotulo}`);
  }
  return item;
}

/** Pratos do iFood por id (cada prato uma vez, mesmo se repetido em categorias). */
export function pratosIfood(texto) {
  const pratos = new Map();
  for (const cat of lerIfood(texto)) for (const item of cat.itens) if (!pratos.has(item.id)) pratos.set(item.id, item);
  return pratos;
}

/**
 * Monta os cards da vitrine. Cada item da configuração aponta para um prato do
 * iFood pelo id (`?prato=` do link); nome e link vêm de lá. Erros interrompem o
 * build em vez de exibir algo errado.
 */
export function prepararVitrine(texto, config) {
  const pratos = pratosIfood(texto);
  return config.itens.map((c) => {
    const prato = pratos.get(c.ifood);
    if (!prato) throw new Error(`Prato ${c.ifood} não existe em conteudo/cardapio-ifood.md.`);
    if (c.descricaoCurta && !prato.descricao.includes(c.descricaoCurta)) {
      throw new Error(`A descrição curta de "${prato.nome}" não é um trecho da descrição do iFood.`);
    }
    if (!LINK_IFOOD.test(prato.url)) throw new Error(`Link de "${prato.nome}" não é do iFood: ${prato.url}`);
    return {
      id: prato.id,
      nome: prato.nome,
      descricaoCurta: c.descricaoCurta ?? null,
      link: prato.url,
      foto: c.foto ?? null,
    };
  });
}
