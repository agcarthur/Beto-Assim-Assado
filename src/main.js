import './styles.css';
import { logo, hero, pratos, galeria } from './config/images.js';

function img({ src, alt }, extra = {}) {
  const el = document.createElement('img');
  el.src = src;
  el.alt = alt;
  el.loading = extra.eager ? 'eager' : 'lazy';
  el.decoding = 'async';
  if (extra.className) el.className = extra.className;
  el.addEventListener('error', () => {
    el.dataset.erro = 'true';
    console.error(`Imagem não carregou: ${src}`);
  });
  return el;
}

// Cabeçalho
const logoTopo = document.getElementById('logo-topo');
logoTopo.src = logo.emblema.src;
logoTopo.alt = logo.emblema.alt;

// Hero: foto real de carne quando configurada; senão, a logo oficial.
const heroEl = document.getElementById('hero');
if (hero) {
  heroEl.classList.add('hero--foto');
  heroEl.append(img(hero, { eager: true, className: 'hero__foto' }));
  const texto = document.createElement('div');
  texto.className = 'hero__texto';
  texto.append(img(logo.emblema, { eager: true, className: 'hero__logo' }));
  heroEl.append(texto);
} else {
  heroEl.classList.add('hero--logo');
  heroEl.append(img(logo.emblema, { eager: true, className: 'hero__logo' }));
}

// Pratos
if (pratos.length) {
  const lista = document.getElementById('lista-pratos');
  for (const prato of pratos) {
    const card = document.createElement('article');
    card.className = 'prato';
    if (prato.foto) card.append(img(prato.foto, { className: 'prato__foto' }));
    const corpo = document.createElement('div');
    corpo.className = 'prato__corpo';
    corpo.innerHTML = '<h3></h3><p></p>';
    corpo.querySelector('h3').textContent = prato.nome;
    corpo.querySelector('p').textContent = prato.descricao ?? '';
    card.append(corpo);
    lista.append(card);
  }
  document.getElementById('pratos').hidden = false;
}

// Galeria
if (galeria.length) {
  const lista = document.getElementById('lista-galeria');
  for (const foto of galeria) lista.append(img(foto, { className: 'galeria__foto' }));
  document.getElementById('galeria').hidden = false;
}

// Esconde links de seções vazias.
for (const link of document.querySelectorAll('[data-secao]')) {
  link.hidden = document.getElementById(link.dataset.secao).hidden;
}
