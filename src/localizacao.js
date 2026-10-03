import { localizacao, urlMapaIncorporado, urlComoChegar, urlAbrirNoMaps } from './config/localizacao.js';

const el = (tag, className, texto) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (texto != null) node.textContent = texto;
  return node;
};

const link = (className, texto, href, rotulo) => {
  const a = el('a', className, texto);
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', `${rotulo} (abre o Google Maps em nova aba)`);
  return a;
};

/** Monta a seção de localização: mapa do Google ao fundo e card com endereço e botões. */
export function montarLocalizacao(secao) {
  const mapa = el('div', 'localizacao__mapa');

  // Camada 1 (sempre visível): imagem real do mapa, com o restaurante no mesmo
  // ponto onde o mapa interativo coloca o endereço.
  const { imagemMapa } = localizacao;
  const camada = el('div', 'localizacao__camada');
  const picture = el('picture');
  const source = el('source');
  source.srcset = imagemMapa.avif;
  source.type = 'image/avif';
  const img = el('img');
  img.src = imagemMapa.src;
  img.alt = imagemMapa.alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  picture.append(source, img);
  camada.append(picture);
  mapa.append(camada, el('span', 'localizacao__credito', imagemMapa.credito));

  // Camada 2: mapa interativo do Google, por cima da imagem (onde puder carregar).
  const iframe = el('iframe');
  iframe.title = `Mapa com a localização do ${localizacao.nome}`;
  iframe.src = urlMapaIncorporado();
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  mapa.append(iframe);

  // Onde o navegador bloqueia mapas incorporados (ex.: algumas pré-visualizações),
  // o iframe sai e fica a imagem real do mapa.
  document.addEventListener('securitypolicyviolation', (e) => {
    if (/^(frame|child)-src/.test(e.effectiveDirective) && e.blockedURI.includes('google.com')) {
      iframe.hidden = true;
    }
  });

  const card = el('div', 'localizacao__card');
  card.append(el('p', 'sobretitulo', 'Localização'), el('h2', 'localizacao__nome', localizacao.nome));
  const endereco = el('address', 'localizacao__endereco');
  localizacao.endereco.forEach((linha, i) => {
    if (i) endereco.append(el('br'));
    endereco.append(linha);
  });
  const acoes = el('div', 'localizacao__acoes');
  acoes.append(
    link('botao botao--ouro', 'Como chegar ↗', urlComoChegar(), 'Como chegar'),
    link('botao botao--contorno', 'Abrir no Google Maps ↗', urlAbrirNoMaps(), 'Abrir no Google Maps'),
  );
  card.append(endereco, acoes);

  const conteudo = el('div', 'localizacao__conteudo');
  conteudo.append(card);
  secao.append(mapa, conteudo);
}
