import textoIfood from '../../conteudo/cardapio-ifood.md?raw';
import { prepararVitrine } from './modelo.js';
import { vitrineCardapio } from '../config/cardapio.js';
import { logo } from '../config/images.js';

const ICONE_SAIR =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>';

const el = (tag, className, texto) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (texto != null) node.textContent = texto;
  return node;
};

/**
 * Monta a vitrine "Nosso Cardápio" em `raiz`. `img` é o criador de imagens do
 * resto do site (AVIF + JPG). Devolve quantos cards foram exibidos.
 */
export function montarVitrine(raiz, { img, modoRascunho }) {
  const pratos = prepararVitrine(textoIfood, vitrineCardapio);
  const grade = el('div', 'vitrine__grade');

  for (const prato of pratos) grade.append(cartao(prato, { img, modoRascunho }));
  if (modoRascunho) {
    for (let i = pratos.length; i < vitrineCardapio.cardsNoRascunho; i++) grade.append(cartaoPendente());
  }

  if (grade.children.length) raiz.append(grade);
  return grade.children.length;
}

function cartao(prato, { img, modoRascunho }) {
  // Com link: o card inteiro abre o prato no iFood. Sem link: botão preparado, desativado.
  const card = el(prato.link ? 'a' : 'article', 'prato-ifood');
  if (prato.link) {
    card.href = prato.link;
    card.target = '_blank';
    card.rel = 'noopener';
    card.setAttribute('aria-label', `${prato.nome}: pedir no iFood (abre em nova aba)`);
  } else {
    card.classList.add('prato-ifood--sem-link');
  }

  const foto = el('div', 'prato-ifood__foto');
  if (prato.foto) foto.append(img({ ...prato.foto, alt: prato.nome }));
  else {
    // Sem foto real: a marca da casa, nunca uma foto inventada
    foto.classList.add('prato-ifood__foto--marca');
    const marca = el('img');
    marca.src = logo.emblema.src;
    marca.alt = '';
    marca.loading = 'lazy';
    foto.append(marca);
  }

  const corpo = el('div', 'prato-ifood__corpo');
  corpo.append(el('h3', 'prato-ifood__nome', prato.nome));
  if (prato.descricaoCurta) corpo.append(el('p', 'prato-ifood__descricao', prato.descricaoCurta));
  if (prato.link || modoRascunho) corpo.append(botao(prato.link ? 'Pedir no iFood' : 'Link do iFood a definir'));

  card.append(foto, corpo);
  return card;
}

/** Moldura do modo rascunho: mostra onde entra um prato ainda não enviado. */
function cartaoPendente() {
  const card = el('article', 'prato-ifood prato-ifood--sem-link prato-ifood--pendente');
  const foto = el('div', 'prato-ifood__foto foto-pendente');
  foto.append(el('span', null, 'Foto do prato · aguardando envio'));
  const corpo = el('div', 'prato-ifood__corpo');
  corpo.append(el('h3', 'prato-ifood__nome', 'Nome do prato'), botao('Link do iFood a definir'));
  card.append(foto, corpo);
  return card;
}

function botao(texto) {
  // <span> com visual de botão: o clique é no card inteiro (link), área grande para o dedo
  const b = el('span', 'botao botao--ouro prato-ifood__botao');
  b.append(el('span', null, texto));
  if (texto === 'Pedir no iFood') b.insertAdjacentHTML('beforeend', ICONE_SAIR);
  return b;
}
