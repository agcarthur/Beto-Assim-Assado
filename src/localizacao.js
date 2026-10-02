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
  const iframe = el('iframe');
  iframe.title = `Mapa com a localização do ${localizacao.nome}`;
  iframe.src = urlMapaIncorporado();
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  mapa.append(iframe);

  // Onde o navegador bloqueia mapas incorporados (ex.: algumas pré-visualizações),
  // fica o fundo da seção no lugar de uma página de erro.
  document.addEventListener('securitypolicyviolation', (e) => {
    if (/^(frame|child)-src/.test(e.effectiveDirective) && e.blockedURI.includes('google.com')) {
      mapa.classList.add('localizacao__mapa--indisponivel');
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
