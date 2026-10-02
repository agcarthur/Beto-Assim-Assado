/**
 * Ajustes de exibição do cardápio.
 *
 * O conteúdo (nomes, descrições, porções, preços) vem SOMENTE de
 * conteudo/cardapio-ifood.md, o texto copiado do iFood. Para atualizar o
 * cardápio, substitua aquele arquivo e rode `npm run check:cardapio`.
 *
 * Aqui ficam apenas decisões de apresentação, identificadas pelo id do prato no
 * iFood (o `?prato=` do link). Nada aqui pode mudar preço, nome ou descrição.
 */
import { fotos } from './images.js';

export const ajustesCardapio = {
  /**
   * Categorias do iFood que viram selo em vez de aba. Os produtos delas já
   * aparecem em outra categoria; assim ninguém vê o mesmo prato duas vezes.
   */
  categoriasSelo: { Destaques: 'Destaque' },

  /** Títulos de categoria exibidos de outra forma. */
  titulos: { 'Carnes Nobres (1)': 'Carnes Nobres' },

  /**
   * Por prato:
   *  - subtitulo: trecho do início da descrição (após "Serve ... |") exibido como
   *    destaque. Precisa ser exatamente o começo do texto, senão o build falha.
   *  - foto: só quando a foto mostra com certeza aquele prato.
   */
  itens: {
    // Mexidão Mineiro Especial + Baby Beef Estância 92 Grelhado na Brasa
    'b91709af-508a-40f1-86c7-a34e98054a56': { subtitulo: 'Sabor mineiro autêntico' },
    // Jantar a Dois - Picanha Nobre + Filé de Frango + Sobremesa + Refri
    '2edccb68-f540-4ec4-afe6-5cbce56d96aa': { subtitulo: 'Experiência completa para um Jantar a Dois' },
    // Porção de Picanha Nobre Nacional + Mix de Acompanhamentos Premium
    'b6415976-5afd-461b-aaa5-8eae2d484071': {
      subtitulo: 'A pedida perfeita para happy hour ou assistir o jogo com estilo',
    },
    // Salada Tropical Wellness + Frango Grelhado — única salada do cardápio; a foto
    // (fotos-originais/ass4.avif) mostra folhas, tomate-cereja, cebola roxa,
    // croûtons, gergelim preto e o molho, como na descrição.
    '683a5444-1f78-4c22-a463-27d878174d34': { foto: fotos.saladaCroutons },
    // Picanha Argentina Importada + Acompanhamentos
    '7d95824b-50eb-45b6-86f0-fc8618a93460': { subtitulo: '200g de picanha argentina in natura' },
    // Picanha Argentina Importada + Mix de Acompanhamentos Prime
    'b43b3c1c-372e-41c2-9c17-958e26bf58c0': { subtitulo: '500g de picanha argentina in natura' },
    // Picanha Nobre Nacional Ao Molho de Alho
    '7b4fc90b-06a7-44ca-a71e-1bb3716e9408': { subtitulo: '200g de picanha nacional in natura' },
    // Baby Beef Estância 92 + Mix de Acompanhamentos Prime
    '425b699f-c2df-4778-9d1c-bb591844b2ad': { subtitulo: '500g de baby beef in natura' },
    // Filé de Frango na Brasa + Acompanhamentos
    'dbf2c40d-298c-47f6-8052-80fe3c1a04dd': { subtitulo: '200g de frango in natura' },
    // Queridinho Mix - Picanha + Coraçãozinho + Linguiça Caipira
    '862d6c00-b93a-4642-b2de-e7267b0f689e': {
      subtitulo: '1.100g de proteínas (in natura) + 2 pães de alho',
    },
    // Batata Frita Premium c/ Leitoa Desfiada ao Barbecue
    '2dbf5b90-0196-42ef-b2f8-2229dd0ddc0c': { subtitulo: 'Batata frita premium irresistível' },
    // Chorizo Angus Estância 92 + Tropeiro Mineiro
    'f522ca44-af25-41cf-97e9-4e0024d29c7b': { subtitulo: '200g de Chorizo Angus in natura' },
    // Picanha Angus Estância 92 + Mix de Acompanhamentos Prime
    '22af34aa-1a2f-420b-b670-18be506c295d': { subtitulo: '200g de picanha in natura.' },
  },
};
