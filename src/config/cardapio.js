/**
 * Vitrine "Nosso Cardápio": cards com foto e nome que levam ao prato no iFood.
 *
 * Nome e link de cada prato vêm SOMENTE de conteudo/cardapio-ifood.md (texto
 * copiado do iFood). Aqui só se escolhe quais pratos aparecem, em que ordem, e
 * com qual foto. Depois de mudar, rode `npm run check:cardapio`.
 *
 * Para adicionar um prato:
 *   { ifood: '<id do prato>', foto: fotos.algumaFoto, descricaoCurta: '<trecho>' }
 *   - ifood: o valor de `?prato=` no link do prato no iFood (precisa estar no texto);
 *   - foto: só uma foto que mostre com certeza aquele prato;
 *   - descricaoCurta (opcional): trecho copiado da descrição do iFood.
 */
import { fotos } from './images.js';

export const vitrineCardapio = {
  itens: [
    // Porção de Picanha Nobre Nacional + Mix de Acompanhamentos Premium — foto
    // enviada pelo restaurante para este prato (fotos-originais/porcao-picanha-mix-premium.png).
    { ifood: 'b6415976-5afd-461b-aaa5-8eae2d484071', foto: fotos.porcaoPicanhaMixPremium },
    // Salada Tropical Wellness + Frango Grelhado — única salada do iFood; a foto
    // (fotos-originais/ass4.avif) mostra folhas, tomate-cereja, cebola roxa,
    // croûtons, gergelim preto e o molho, como na descrição.
    { ifood: '683a5444-1f78-4c22-a463-27d878174d34', foto: fotos.saladaCroutons },
    // Picanha Argentina Importada + Mix de Acompanhamentos Prime — foto enviada
    // pelo restaurante para este prato (fotos-originais/picanha-argentina-mix-prime.webp).
    { ifood: 'b43b3c1c-372e-41c2-9c17-958e26bf58c0', foto: fotos.picanhaArgentinaMixPrime },
    // Coraçãozinho Na Brasa — foto enviada com o texto "Acompanhamento Arroz Farora
    // E Vinagrete", que é exatamente a descrição deste prato no iFood (e só dele);
    // a foto mostra os espetinhos de coraçãozinho (fotos-originais/coracaozinho-na-brasa.png).
    { ifood: '741c35a2-71ea-4b1a-9735-a638d88f462a', foto: fotos.coracaozinhoNaBrasa },
  ],

  /**
   * Enquanto o site estiver em modo rascunho (modoRascunho em images.js), a
   * grade é completada com molduras marcadas até este número de cards, para
   * visualizar o layout. Fora do rascunho, só os pratos acima aparecem.
   */
  cardsNoRascunho: 6,
};
