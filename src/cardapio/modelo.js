/**
 * Transforma o texto copiado do iFood (conteudo/cardapio-ifood.md, fonte oficial)
 * no cardápio do site. Nenhum nome, descrição ou preço é digitado à mão: tudo sai
 * do texto. Os ajustes (src/config/cardapio.js) só dizem como exibir.
 *
 * Não depende do navegador: o mesmo código roda em scripts/verificar-cardapio.mjs.
 */

const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;

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
  if (!item.preco) throw new Error(`Item sem preço: ${id}`);
  return item;
}

/** Campos que precisam ser idênticos quando o mesmo produto aparece em mais de uma categoria. */
export const CAMPOS_PRODUTO = ['nome', 'descricao', 'servePorcao', 'preco', 'precoAnterior'];

/**
 * Monta as abas do cardápio:
 *  - cada produto aparece uma única vez, na primeira categoria (fora as de selo) em que está;
 *  - categorias de selo (ex.: "Destaques") viram um selo no produto em vez de aba;
 *  - um produto repetido com conteúdo diferente interrompe tudo (precisa de decisão humana).
 */
export function montarCardapio(texto, ajustes) {
  const categoriasIfood = lerIfood(texto);
  const produtos = new Map(); // id -> { item, categorias: [] }

  for (const cat of categoriasIfood) {
    for (const item of cat.itens) {
      const existente = produtos.get(item.id);
      if (existente) {
        const diferentes = CAMPOS_PRODUTO.filter((c) => existente.item[c] !== item[c]);
        if (diferentes.length) {
          throw new Error(
            `"${item.nome}" aparece em "${existente.categorias[0]}" e "${cat.titulo}" com ` +
              `${diferentes.join(', ')} diferente(s). Confirmar com o restaurante qual vale.`,
          );
        }
        existente.categorias.push(cat.titulo);
      } else {
        produtos.set(item.id, { item, categorias: [cat.titulo] });
      }
    }
  }

  const selos = ajustes.categoriasSelo ?? {};
  const abas = [];
  const porTitulo = new Map();
  const garantirAba = (titulo) => {
    if (!porTitulo.has(titulo)) {
      const aba = {
        id: slug(ajustes.titulos?.[titulo] ?? titulo),
        titulo: ajustes.titulos?.[titulo] ?? titulo,
        tituloIfood: titulo,
        itens: [],
      };
      porTitulo.set(titulo, aba);
      abas.push(aba);
    }
    return porTitulo.get(titulo);
  };
  // Abas na ordem do iFood; categorias de selo só viram aba se tiverem produto exclusivo.
  for (const cat of categoriasIfood) if (!(cat.titulo in selos)) garantirAba(cat.titulo);

  // Percorre na ordem do iFood para manter a ordem original dentro de cada aba.
  for (const cat of categoriasIfood) {
    for (const { id } of cat.itens) {
      const { item, categorias } = produtos.get(id);
      const casa = categorias.find((c) => !(c in selos)) ?? categorias[0];
      if (casa !== cat.titulo || porTitulo.get(casa)?.itens.some((i) => i.id === id)) continue;
      garantirAba(casa).itens.push(
        prepararItem(item, {
          categorias,
          selos: categorias.filter((c) => c in selos).map((c) => selos[c]),
          ajuste: ajustes.itens?.[item.id] ?? {},
        }),
      );
    }
  }

  return abas.filter((aba) => aba.itens.length);
}

function prepararItem(item, { categorias, selos, ajuste }) {
  // "Serve até 3 pessoas | resto da descrição"
  let serve = null;
  let resto = item.descricao;
  const corte = resto.indexOf(' | ');
  if (corte > 0 && /^Serve /.test(resto)) {
    serve = resto.slice(0, corte);
    resto = resto.slice(corte + 3);
  }

  // Subtítulo (ex.: "200g de picanha argentina in natura"), indicado nos ajustes
  let subtitulo = null;
  if (ajuste.subtitulo) {
    if (!resto.startsWith(`${ajuste.subtitulo} `)) {
      throw new Error(`Subtítulo de "${item.nome}" não corresponde ao início da descrição.`);
    }
    subtitulo = ajuste.subtitulo;
    resto = resto.slice(subtitulo.length + 1);
  }

  // "A partir de R$ 39,14" -> prefixo + valor
  const [, precoPrefixo = '', preco] = item.preco.match(/^(.*?)\s*(R\$ [\d.,]+)$/) ?? [];
  if (!preco) throw new Error(`Preço em formato desconhecido em "${item.nome}": ${item.preco}`);

  return {
    id: item.id,
    url: item.url,
    nome: item.nome,
    descricaoOriginal: item.descricao,
    serve,
    servePorcao: item.servePorcao ?? null,
    subtitulo,
    descricao: resto,
    dias: item.descricao.match(/Disponível apenas ([^.]+)\./)?.[0].slice(0, -1) ?? null,
    precoOriginal: item.preco,
    precoPrefixo: precoPrefixo || null,
    preco,
    precoAnterior: item.precoAnterior ?? null,
    categorias,
    selos,
    foto: ajuste.foto ?? null,
  };
}

/** Textos de "quantas pessoas serve" a exibir, sem repetir a mesma informação. */
export function infoPessoas(item) {
  const lista = [];
  if (item.serve) lista.push(item.serve);
  if (item.servePorcao) {
    const numero = item.servePorcao.match(/\d+/)[0];
    // Só repete o campo do iFood se ele trouxer um número que a descrição não tem
    if (!(item.serve?.match(/\d+/g) ?? []).includes(numero)) lista.push(item.servePorcao);
  }
  return lista;
}

function slug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
