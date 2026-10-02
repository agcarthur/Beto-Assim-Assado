/**
 * Seção "Localização": mapa do Google Maps ao fundo e card com o endereço.
 *
 * O mapa e os botões usam SOMENTE o endereço informado pelo restaurante (nada de
 * coordenadas digitadas à mão): o Google Maps localiza o endereço sozinho.
 */
export const localizacao = {
  nome: 'Beto Assim & Assado',
  /** Linhas do endereço exatamente como exibidas no card. */
  endereco: ['Avenida José Ivair F. Mattos, nº 405', 'Santo Agostinho — Governador Valadares/MG'],
  /** Texto pesquisado no Google Maps (nome + endereço informado). */
  consultaMapa: 'Beto Assim & Assado, Avenida José Ivair F. Mattos, 405, Santo Agostinho, Governador Valadares - MG',
};

const q = () => encodeURIComponent(localizacao.consultaMapa);

/** Mapa incorporado (sem chave de API), centralizado no endereço. */
export const urlMapaIncorporado = () => `https://maps.google.com/maps?q=${q()}&z=16&hl=pt-BR&output=embed`;
/** Rota até o restaurante a partir de onde a pessoa estiver. */
export const urlComoChegar = () => `https://www.google.com/maps/dir/?api=1&destination=${q()}`;
/** O endereço aberto no Google Maps. */
export const urlAbrirNoMaps = () => `https://www.google.com/maps/search/?api=1&query=${q()}`;
