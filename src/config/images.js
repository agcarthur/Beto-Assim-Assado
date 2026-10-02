/**
 * Mapeamento central de todas as imagens do site.
 *
 * Para trocar uma foto, substitua o arquivo em public/images/... ou altere
 * o caminho `src` aqui. Caminhos são relativos à pasta public/ (começam com "/").
 *
 * Regras do projeto:
 *  - Usar apenas fotos reais do restaurante (nada de banco de imagens ou IA).
 *  - Só associar uma foto a um prato quando a correspondência for certa.
 *    Na dúvida, deixe `foto: null` e o prato aparece sem imagem.
 */

export const logo = {
  /** Arquivo original fornecido (900x900, fundo verde). Não editar. */
  original: { src: '/images/logo/logo-original.jpg', alt: 'Beto Assim & Assado — Lagoa Santa' },
  /** Recorte do original sem a margem verde, usado no cabeçalho e no hero. */
  emblema: { src: '/images/logo/logo-emblema.jpg', alt: 'Beto Assim & Assado — Lagoa Santa' },
  favicon: { src: '/images/logo/favicon.png', alt: '' },
};

/**
 * Foto principal do HERO — deve ser uma das melhores fotos reais de
 * picanha/carne. Enquanto for `null`, o hero mostra a logo oficial.
 *
 * Exemplo: { src: '/images/pratos/picanha-na-chapa.jpg', alt: 'Picanha fatiada na chapa' }
 */
export const hero = null;

/**
 * Pratos exibidos na seção "Nossos pratos".
 *
 * Exemplo de item:
 *   {
 *     id: 'picanha-na-chapa',
 *     nome: 'Picanha na chapa',
 *     descricao: 'Picanha fatiada servida na chapa com acompanhamentos.',
 *     foto: { src: '/images/pratos/picanha-na-chapa.jpg', alt: 'Picanha na chapa' },
 *   }
 */
export const pratos = [];

/**
 * Fotos de carnes, produtos e ambiente para a galeria.
 *
 * Exemplo de item:
 *   { src: '/images/galeria/cortes-de-carne.jpg', alt: 'Cortes de carne no balcão' }
 */
export const galeria = [];

/** Lista plana de todas as imagens configuradas — usada na verificação. */
export function todasAsImagens() {
  return [
    ...Object.values(logo),
    ...(hero ? [hero] : []),
    ...pratos.map((p) => p.foto).filter(Boolean),
    ...galeria,
  ];
}
