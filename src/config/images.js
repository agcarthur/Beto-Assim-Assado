/**
 * Mapeamento central de todas as imagens do site.
 *
 * Para trocar uma foto, substitua o arquivo em public/images/... ou altere
 * o caminho aqui. Caminhos são relativos à pasta public/ (sem "/" inicial).
 * Cada foto tem a versão AVIF (`avif`, o arquivo original enviado) e uma cópia
 * JPG (`src`) para navegadores que não abrem AVIF.
 *
 * Regras do projeto:
 *  - Usar apenas fotos reais do restaurante (nada de banco de imagens ou IA).
 *  - Só associar uma foto a um prato quando a correspondência for certa.
 *  - Não inventar pratos, descrições ou preços: preencher só com dados informados.
 */

/**
 * Enquanto `true`, o site mostra "a definir" onde faltam dados (nomes dos
 * pratos, contatos) e molduras onde faltam fotos. Trocar para `false` antes
 * de publicar o site oficial: o que estiver sem conteúdo passa a ficar oculto.
 */
export const modoRascunho = true;

export const logo = {
  /** Arquivo original fornecido (900x900, fundo verde). Não editar. */
  original: { src: 'images/logo/logo-original.jpg', alt: 'Beto Assim & Assado — Lagoa Santa' },
  /** Recorte do original sem a margem verde, usado no cabeçalho e no hero. */
  emblema: { src: 'images/logo/logo-emblema.jpg', alt: 'Beto Assim & Assado — Lagoa Santa' },
  favicon: { src: 'images/logo/favicon.png', alt: '' },
};

/**
 * Fotos reais enviadas pelo restaurante (originais em fotos-originais/).
 * Os nomes dos arquivos descrevem o que aparece na foto, não o nome do prato
 * no cardápio, que ainda não foi informado.
 */
const fotos = {
  // fotos-originais/ass5.avif
  chapaCompleta: {
    src: 'images/pratos/chapa-carne-acompanhamentos.jpg',
    avif: 'images/pratos/chapa-carne-acompanhamentos.avif',
    alt: 'Carne fatiada servida na chapa de ferro, com acompanhamentos',
  },
  // fotos-originais/ass3.avif
  cortesNaChapa: {
    src: 'images/pratos/cortes-na-chapa.jpg',
    avif: 'images/pratos/cortes-na-chapa.avif',
    alt: 'Cortes de carne grelhados na chapa de ferro',
  },
  // fotos-originais/ASS1.avif
  carneMolhoBranco: {
    src: 'images/pratos/carne-molho-branco.jpg',
    avif: 'images/pratos/carne-molho-branco.avif',
    alt: 'Carne fatiada na chapa coberta com molho branco e cebolinha',
  },
  // fotos-originais/Ass2.avif
  chapasFrangoECarne: {
    src: 'images/pratos/chapas-frango-e-carne.jpg',
    avif: 'images/pratos/chapas-frango-e-carne.avif',
    alt: 'Chapas com frango grelhado e com carne ao molho branco, servidas com arroz',
  },
  // fotos-originais/ass6.avif
  ovosTorresmoCouve: {
    src: 'images/pratos/ovos-torresmo-couve.jpg',
    avif: 'images/pratos/ovos-torresmo-couve.avif',
    alt: 'Prato com ovos fritos, torresmo e couve',
  },
  // fotos-originais/ass4.avif
  saladaCroutons: {
    src: 'images/pratos/salada-croutons.jpg',
    avif: 'images/pratos/salada-croutons.avif',
    alt: 'Salada com folhas, tomate-cereja, cebola roxa e croutons',
  },
};

/**
 * Mídia principal do HERO: vídeo do restaurante. O original é vertical (9:16,
 * em videos-originais/); esta versão é 4:3, mesma proporção do espaço do hero,
 * com o vídeo inteiro no centro e as laterais preenchidas pelo próprio vídeo
 * desfocado. `poster` é um quadro do vídeo, exibido enquanto ele carrega.
 */
export const hero = {
  video: 'videos/hero/hero-video.mp4',
  /** Mesmo vídeo em WebM (VP9), alternativa para navegadores sem H.264. */
  webm: 'videos/hero/hero-video.webm',
  poster: 'videos/hero/hero-video-poster.jpg',
  alt: 'Vídeo do Beto Assim & Assado: pratos na chapa, salão e música ao vivo',
};

/**
 * Pratos da seção "Cardápio". `nome`, `descricao` e `preco` ficam `null`
 * até o restaurante informar; não preencher por suposição.
 */
export const pratos = [
  { id: 'cortes-na-chapa', nome: null, descricao: null, preco: null, foto: fotos.cortesNaChapa },
  { id: 'carne-molho-branco', nome: null, descricao: null, preco: null, foto: fotos.carneMolhoBranco },
  { id: 'chapas-frango-e-carne', nome: null, descricao: null, preco: null, foto: fotos.chapasFrangoECarne },
  { id: 'ovos-torresmo-couve', nome: null, descricao: null, preco: null, foto: fotos.ovosTorresmoCouve },
  { id: 'salada-croutons', nome: null, descricao: null, preco: null, foto: fotos.saladaCroutons },
];

/** Fotos da galeria. A primeira aparece maior. */
export const galeria = [
  fotos.chapaCompleta,
  fotos.cortesNaChapa,
  fotos.carneMolhoBranco,
  fotos.chapasFrangoECarne,
  fotos.ovosTorresmoCouve,
];

/** Lista de todos os arquivos de imagem e vídeo configurados — usada na verificação. */
export function todasAsImagens() {
  const imagens = [
    ...Object.values(logo),
    ...(hero ? [hero] : []),
    ...pratos.map((p) => p.foto).filter(Boolean),
    ...galeria,
  ];
  const caminhos = imagens.flatMap((img) => [img.src, img.avif, img.video, img.webm, img.poster].filter(Boolean));
  return [...new Set(caminhos)];
}
