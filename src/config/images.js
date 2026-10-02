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
export const fotos = {
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
  // fotos-originais/porcao-picanha-mix-premium.png — enviada como foto da
  // "Porção de Picanha Nobre Nacional + Mix de Acompanhamentos Premium"
  porcaoPicanhaMixPremium: {
    src: 'images/pratos/porcao-picanha-mix-premium.jpg',
    avif: 'images/pratos/porcao-picanha-mix-premium.avif',
    alt: 'Picanha ao molho de alho na chapa, com mandioca frita, pães de alho e queijo coalho com melaço',
  },
  // fotos-originais/picanha-argentina-mix-prime.webp — enviada como foto da
  // "Picanha Argentina Importada + Mix de Acompanhamentos Prime" (é a mesma
  // imagem de fotos-originais/ass5.avif, usada na galeria)
  picanhaArgentinaMixPrime: {
    src: 'images/pratos/picanha-argentina-mix-prime.jpg',
    avif: 'images/pratos/picanha-argentina-mix-prime.avif',
    alt: 'Picanha fatiada na chapa, com batata frita com cheddar e bacon, arroz, farofa, vinagrete e tropeiro',
  },
  // fotos-originais/coracaozinho-na-brasa.png — enviada com o texto "Acompanhamento
  // Arroz Farora E Vinagrete", que é a descrição do "Coraçãozinho Na Brasa" no iFood
  coracaozinhoNaBrasa: {
    src: 'images/pratos/coracaozinho-na-brasa.jpg',
    avif: 'images/pratos/coracaozinho-na-brasa.avif',
    alt: 'Espetinhos de coraçãozinho de frango na brasa',
  },
  // fotos-originais/chorizo-angus-tropeiro.png — enviada como foto do
  // "Chorizo Angus Estância 92 + Tropeiro Mineiro"
  chorizoAngusTropeiro: {
    src: 'images/pratos/chorizo-angus-tropeiro.jpg',
    avif: 'images/pratos/chorizo-angus-tropeiro.avif',
    alt: 'Chorizo fatiado na chapa, com arroz, tropeiro com torresmo, farofa e vinagrete',
  },
  // fotos-originais/mexidao-baby-beef.png — enviada como foto do
  // "Mexidão Mineiro Especial + Baby Beef Estância 92 Grelhado na Brasa"
  mexidaoBabyBeef: {
    src: 'images/pratos/mexidao-baby-beef.jpg',
    avif: 'images/pratos/mexidao-baby-beef.avif',
    alt: 'Baby beef fatiado na chapa e mexidão mineiro com ovos fritos, torresmo e couve',
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
 * em videos-originais/); esta versão é horizontal 4:3, mesma proporção do
 * espaço do hero, recortada cena a cena para manter a comida/pessoas em
 * quadro (ver scripts/gerar-video-hero.sh). `poster` é um quadro do vídeo,
 * exibido enquanto ele carrega.
 */
export const hero = {
  video: 'videos/hero/hero-video.mp4',
  /** Mesmo vídeo em WebM (VP9), alternativa para navegadores sem H.264. */
  webm: 'videos/hero/hero-video.webm',
  poster: 'videos/hero/hero-video-poster.jpg',
  alt: 'Vídeo do Beto Assim & Assado: pratos na chapa, salão e música ao vivo',
};

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
    ...galeria,
  ];
  const caminhos = imagens.flatMap((img) => [img.src, img.avif, img.video, img.webm, img.poster].filter(Boolean));
  return [...new Set(caminhos)];
}
