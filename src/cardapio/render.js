import textoIfood from '../../conteudo/cardapio-ifood.md?raw';
import { montarCardapio, infoPessoas } from './modelo.js';
import { ajustesCardapio } from '../config/cardapio.js';
import { logo } from '../config/images.js';

const ICONE_PESSOAS =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-7 1.7-7 4.5V20h14v-2.5C16 14.7 12.3 13 9 13Zm7.5-2.2a3.3 3.3 0 1 0-.9-6.5 5.9 5.9 0 0 1 0 6.4c.3.1.6.1.9.1Zm1.6 2.4A5.4 5.4 0 0 1 18 17.5V20h4v-2.5c0-2-1.8-3.6-3.9-4.3Z"/></svg>';
const ICONE_CALENDARIO =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3V2Zm12 8H5v9h14v-9Z"/></svg>';

const el = (tag, className, texto) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (texto != null) node.textContent = texto;
  return node;
};

/**
 * Monta o cardápio dentro de `raiz`. `img` é o mesmo criador de imagens do resto
 * do site (AVIF + JPG). Devolve o número de produtos exibidos.
 */
export function montarSecaoCardapio(raiz, { img }) {
  const abas = montarCardapio(textoIfood, ajustesCardapio);
  if (!abas.length) return 0;

  const barra = el('div', 'menu__barra');
  const lista = el('div', 'menu__abas');
  lista.setAttribute('role', 'tablist');
  lista.setAttribute('aria-label', 'Categorias do cardápio');
  barra.append(lista);
  raiz.append(barra);

  const botoes = [];
  const paineis = [];
  abas.forEach((aba, indice) => {
    const botao = el('button', 'menu__aba');
    botao.type = 'button';
    botao.id = `aba-${aba.id}`;
    botao.setAttribute('role', 'tab');
    botao.setAttribute('aria-controls', `painel-${aba.id}`);
    botao.append(el('span', null, aba.titulo), el('span', 'menu__qtd', String(aba.itens.length)));
    lista.append(botao);
    botoes.push(botao);

    const painel = el('div', 'menu__painel');
    painel.id = `painel-${aba.id}`;
    painel.setAttribute('role', 'tabpanel');
    painel.setAttribute('aria-labelledby', botao.id);
    painel.tabIndex = 0;
    const grade = el('div', 'menu__grade');
    for (const item of aba.itens) grade.append(cartao(item, img));
    painel.append(grade);
    raiz.append(painel);
    paineis.push(painel);

    botao.addEventListener('click', () => selecionar(indice, { rolar: true }));
  });

  function selecionar(indice, { rolar = false, focar = false } = {}) {
    botoes.forEach((b, i) => {
      const ativo = i === indice;
      b.setAttribute('aria-selected', String(ativo));
      b.tabIndex = ativo ? 0 : -1;
      paineis[i].hidden = !ativo;
    });
    const botao = botoes[indice];
    if (focar) botao.focus();
    // Mantém a aba ativa visível na faixa rolável (celular)
    lista.scrollTo({ left: botao.offsetLeft - (lista.clientWidth - botao.offsetWidth) / 2, behavior: 'smooth' });
    atualizarDescricoes(paineis[indice]);
    // Se a barra já está grudada no topo, leva o início da nova lista para baixo dela
    if (rolar) {
      const topoBarra = parseFloat(getComputedStyle(barra).top) || 0;
      const alvo = paineis[indice].getBoundingClientRect().top + window.scrollY - topoBarra - barra.offsetHeight - 16;
      if (window.scrollY > alvo) window.scrollTo({ top: alvo });
    }
  }

  // Teclado: setas, Home e End trocam de aba
  lista.addEventListener('keydown', (e) => {
    const atual = botoes.indexOf(document.activeElement);
    if (atual < 0) return;
    const destino = { ArrowRight: atual + 1, ArrowLeft: atual - 1, Home: 0, End: botoes.length - 1 }[e.key];
    if (destino == null) return;
    e.preventDefault();
    selecionar((destino + botoes.length) % botoes.length, { focar: true, rolar: true });
  });

  selecionar(0);
  let espera;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(() => atualizarDescricoes(paineis.find((p) => !p.hidden)), 150);
  });
  document.fonts?.ready.then(() => atualizarDescricoes(paineis.find((p) => !p.hidden)));

  return abas.reduce((n, aba) => n + aba.itens.length, 0);
}

function cartao(item, img) {
  const card = el('article', 'menu-item');
  card.id = `prato-${item.id}`;

  // Foto real quando houver; senão, a marca da casa (nunca uma foto inventada)
  const foto = el('div', 'menu-item__foto');
  if (item.foto) foto.append(img({ ...item.foto, alt: item.nome }));
  else {
    foto.classList.add('menu-item__foto--marca');
    const marca = el('img');
    marca.src = logo.emblema.src;
    marca.alt = '';
    marca.loading = 'lazy';
    marca.decoding = 'async';
    foto.append(marca);
  }
  card.append(foto);

  const corpo = el('div', 'menu-item__corpo');
  card.append(corpo);

  const selos = [...item.selos, item.precoAnterior && 'Promoção'].filter(Boolean);
  if (selos.length) {
    const linha = el('div', 'menu-item__selos');
    for (const selo of selos) {
      linha.append(el('span', `selo${selo === 'Promoção' ? '' : ' selo--cheio'}`, selo));
    }
    corpo.append(linha);
  }

  corpo.append(el('h3', 'menu-item__nome', item.nome));

  const info = [
    ...infoPessoas(item).map((texto) => [ICONE_PESSOAS, texto]),
    ...(item.dias ? [[ICONE_CALENDARIO, item.dias]] : []),
  ];
  if (info.length) {
    const ul = el('ul', 'menu-item__info');
    for (const [icone, texto] of info) {
      const li = el('li');
      li.innerHTML = icone;
      li.append(el('span', null, texto));
      ul.append(li);
    }
    corpo.append(ul);
  }

  if (item.subtitulo) corpo.append(el('p', 'menu-item__subtitulo', item.subtitulo));

  const descricao = el('p', 'menu-item__descricao', item.descricao);
  descricao.id = `descricao-${item.id}`;
  const mais = el('button', 'menu-item__mais', 'Ler descrição completa');
  mais.type = 'button';
  mais.hidden = true;
  mais.setAttribute('aria-controls', descricao.id);
  mais.setAttribute('aria-expanded', 'false');
  mais.addEventListener('click', () => {
    const aberta = descricao.classList.toggle('menu-item__descricao--aberta');
    mais.setAttribute('aria-expanded', String(aberta));
    mais.textContent = aberta ? 'Mostrar menos' : 'Ler descrição completa';
  });
  corpo.append(descricao, mais);

  const precos = el('div', 'menu-item__precos');
  if (item.precoPrefixo) precos.append(el('span', 'menu-item__prefixo', item.precoPrefixo));
  if (item.precoAnterior) {
    const anterior = el('s', 'menu-item__anterior');
    anterior.append(el('span', 'sr-only', 'Preço anterior: '), item.precoAnterior);
    precos.append(anterior);
  }
  const atual = el('strong', 'menu-item__preco');
  atual.append(el('span', 'sr-only', item.precoAnterior ? 'Preço atual: ' : 'Preço: '), item.preco);
  precos.append(atual);
  corpo.append(precos);

  return card;
}

/** Mostra "Ler descrição completa" só nas descrições que foram cortadas. */
function atualizarDescricoes(painel) {
  if (!painel) return;
  for (const descricao of painel.querySelectorAll('.menu-item__descricao')) {
    const botao = descricao.nextElementSibling;
    if (descricao.classList.contains('menu-item__descricao--aberta')) continue;
    botao.hidden = descricao.scrollHeight <= descricao.clientHeight + 1;
  }
}
