import './styles.css';
import { modoRascunho, logo, hero, galeria } from './config/images.js';
import { contato, linkWhatsApp, linkReserva } from './config/contato.js';
import { montarVitrine } from './cardapio/vitrine.js';

const $ = (id) => document.getElementById(id);

/** Cria a imagem; com `avif`, usa <picture> e o JPG de `src` como reserva. */
function img({ src, avif, alt }, { eager = false, className } = {}) {
  const el = document.createElement('img');
  el.src = src;
  el.alt = alt;
  el.loading = eager ? 'eager' : 'lazy';
  el.decoding = 'async';
  if (eager) el.fetchPriority = 'high';
  el.addEventListener('error', () => {
    el.dataset.erro = 'true';
    console.error(`Imagem não carregou: ${el.currentSrc || src}`);
  });
  if (!avif) {
    if (className) el.className = className;
    return el;
  }
  const picture = document.createElement('picture');
  picture.className = `foto ${className ?? ''}`;
  const source = document.createElement('source');
  source.srcset = avif;
  source.type = 'image/avif';
  picture.append(source, el);
  return picture;
}

/** Moldura marcada para uma foto real que ainda não foi enviada. */
function espacoFoto(rotulo, className) {
  const el = document.createElement('div');
  el.className = `foto-pendente ${className ?? ''}`;
  el.innerHTML = '<span></span>';
  el.querySelector('span').textContent = rotulo;
  return el;
}

// Logos
for (const id of ['logo-topo', 'logo-rodape']) {
  $(id).src = logo.emblema.src;
  $(id).alt = logo.emblema.alt;
}

/** Vídeo em loop, sem som e sem controles, que toca sozinho também no celular. */
function video({ video: mp4, webm, poster, alt }) {
  const el = document.createElement('video');
  // Atributos (e não só propriedades) para o autoplay funcionar no Safari/iOS.
  for (const attr of ['autoplay', 'muted', 'loop', 'playsinline']) el.setAttribute(attr, '');
  el.muted = true;
  el.preload = 'auto';
  el.poster = poster;
  el.disablePictureInPicture = true;
  el.setAttribute('aria-label', alt);
  // O navegador usa o primeiro formato que consegue tocar.
  for (const [src, type] of [[mp4, 'video/mp4; codecs="avc1.640028"'], [webm, 'video/webm; codecs="vp9"']]) {
    if (!src) continue;
    const source = document.createElement('source');
    source.src = src;
    source.type = type;
    source.addEventListener('error', () => console.error(`Vídeo não carregou: ${src}`));
    el.append(source);
  }
  return el;
}

// Hero
const heroFoto = $('hero-foto');
if (hero?.video) {
  const el = video(hero);
  heroFoto.append(el);
  el.play().catch(() => {}); // se o navegador bloquear o autoplay, fica o quadro de capa
} else if (hero) heroFoto.append(img(hero, { eager: true }));
else if (modoRascunho) heroFoto.append(espacoFoto('Foto da picanha · aguardando envio'));
else heroFoto.hidden = true;

// Nosso Cardápio: vitrine de pratos que leva ao iFood (nomes e links de conteudo/cardapio-ifood.md)
$('cardapio').hidden = !montarVitrine($('vitrine-cardapio'), { img, modoRascunho });

// Galeria
const listaGaleria = $('lista-galeria');
for (const foto of galeria) listaGaleria.append(img(foto, { className: 'galeria__foto' }));
if (!galeria.length && modoRascunho) {
  for (let i = 0; i < 5; i++) {
    listaGaleria.append(espacoFoto('Foto real · aguardando envio', 'galeria__foto'));
  }
}
$('galeria').hidden = !galeria.length && !modoRascunho;

// Ações (reserva, iFood, WhatsApp)
const links = {
  reserva: linkReserva(),
  ifood: contato.ifoodUrl,
  whatsapp: linkWhatsApp(),
};
for (const el of document.querySelectorAll('[data-acao]')) {
  const href = links[el.dataset.acao];
  if (href) {
    el.href = href;
    el.target = '_blank';
    el.rel = 'noopener';
  } else if (modoRascunho) {
    el.setAttribute('aria-disabled', 'true');
    el.title = 'Link a definir';
    el.addEventListener('click', (e) => e.preventDefault());
  } else {
    el.hidden = true;
  }
}

// Dados de contato
const dados = $('dados-contato');
function linhaContato(rotulo, valor) {
  const dt = document.createElement('dt');
  dt.textContent = rotulo;
  const dd = document.createElement('dd');
  if (valor instanceof Node) dd.append(valor);
  else dd.textContent = valor;
  dados.append(dt, dd);
}
const pendente = modoRascunho ? 'A definir' : null;
const whats = contato.whatsappExibicao ?? pendente;
if (whats) {
  if (links.whatsapp) {
    const a = document.createElement('a');
    a.href = links.whatsapp;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = whats;
    linhaContato('WhatsApp', a);
  } else linhaContato('WhatsApp', whats);
}
const endereco = contato.endereco ?? pendente;
if (endereco) linhaContato('Endereço', endereco);
const horarios = contato.horarios.length ? contato.horarios.join('\n') : pendente;
if (horarios) linhaContato('Horários', horarios);
if (contato.instagramUrl) {
  const a = document.createElement('a');
  a.href = contato.instagramUrl;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = contato.instagramUrl.replace(/^https?:\/\/(www\.)?/, '');
  linhaContato('Instagram', a);
}

// Links do menu para seções ocultas
for (const link of document.querySelectorAll('[data-secao]')) {
  link.hidden = $(link.dataset.secao).hidden;
}

// Menu no celular
const botaoMenu = $('botao-menu');
const topo = $('topo');
botaoMenu.addEventListener('click', () => {
  const aberto = topo.classList.toggle('topo--aberto');
  botaoMenu.setAttribute('aria-expanded', String(aberto));
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
});
$('menu').addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    topo.classList.remove('topo--aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }
});

// Cabeçalho ganha fundo sólido após rolar
const marcarRolagem = () => topo.classList.toggle('topo--rolado', window.scrollY > 24);
window.addEventListener('scroll', marcarRolagem, { passive: true });
marcarRolagem();
