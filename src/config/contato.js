/**
 * Dados de contato e links de ação. Preencha apenas com informações reais
 * fornecidas pelo restaurante. Enquanto um campo estiver `null`, o botão
 * correspondente aparece como "link a definir" (em modo rascunho) ou some.
 */
export const contato = {
  /** Número do WhatsApp só com dígitos, com DDI e DDD. Ex.: '5531900000000' */
  whatsapp: null,
  /** Número como deve aparecer na tela. Ex.: '(31) 90000-0000' */
  whatsappExibicao: null,
  /** Mensagem pré-preenchida ao abrir o WhatsApp para reservar. */
  mensagemReserva: 'Olá! Gostaria de reservar uma mesa.',
  /**
   * Link de reserva (sistema de reservas, formulário etc.).
   * Se ficar `null` e houver WhatsApp, "Reservar mesa" abre o WhatsApp.
   */
  reservaUrl: null,
  /** Link da loja no iFood. */
  ifoodUrl: null,
  /** Instagram completo. Ex.: 'https://instagram.com/perfil' */
  instagramUrl: null,
  /** Endereço como deve aparecer no site. */
  endereco: null,
  /** Horários, um item por linha. Ex.: ['Ter a Dom · 11h às 16h'] */
  horarios: [],
};

export function linkWhatsApp(mensagem) {
  if (!contato.whatsapp) return null;
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${contato.whatsapp}${texto}`;
}

export function linkReserva() {
  return contato.reservaUrl ?? linkWhatsApp(contato.mensagemReserva);
}
