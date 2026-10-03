/**
 * Dados de contato e links de ação. Preencha apenas com informações reais
 * fornecidas pelo restaurante. Enquanto um campo estiver `null`, o botão
 * correspondente aparece como "link a definir" (em modo rascunho) ou some.
 */
export const contato = {
  /** Número do WhatsApp só com dígitos, com DDI e DDD (do link enviado pelo restaurante). */
  whatsapp: '5533988173429',
  /** Número como aparece na seção de contato. */
  whatsappExibicao: '(33) 98817-3429',
  /** Link do WhatsApp enviado pelo restaurante; usado como está em todos os botões de WhatsApp. */
  whatsappUrl: 'https://api.whatsapp.com/send/?phone=5533988173429&text=Ol%C3%A1%2C+tudo+bem%3F+Como+podemos+te+ajudar%3F&type=phone_number&app_absent=0',
  /** Mensagem pré-preenchida ao abrir o WhatsApp para reservar. */
  mensagemReserva: 'Olá! Gostaria de reservar uma mesa.',
  /**
   * Link de reserva (sistema de reservas, formulário etc.).
   * Se ficar `null` e houver WhatsApp, "Reservar mesa" abre o WhatsApp.
   */
  reservaUrl: 'https://api.whatsapp.com/send/?phone=5533988173429&text=Ol%C3%A1%2C+tudo+bem%3F+Como+podemos+te+ajudar%3F&type=phone_number&app_absent=0', // link enviado pelo restaurante para "Reservar mesa"
  /** Link da página da loja no iFood, enviado pelo restaurante. */
  ifoodUrl: 'https://www.ifood.com.br/delivery/governador-valadares-mg/beto-assim-e-assado-lagoa-santa-santo-agostinho/f5c03b97-23b1-4aa4-8855-46a7b4e51200',
  /** Instagram completo. Ex.: 'https://instagram.com/perfil' */
  instagramUrl: null,
  /** Endereço como deve aparecer no site. */
  endereco: 'Av. José Ivair F. Mattos, 405 - Santo Agostinho, Gov. Valadares',
  /** Horários, um item por linha. Ex.: ['Ter a Dom · 11h às 16h'] */
  horarios: [
    'Quarta a sexta · 18:30–23:30',
    'Sábado e domingo · 11:30–23:30',
    'Almoço: sábado e domingo · 11:00–14:00',
    'Segunda e terça · Fechado',
  ],
};

export function linkWhatsApp(mensagem) {
  if (contato.whatsappUrl) return contato.whatsappUrl;
  if (!contato.whatsapp) return null;
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : '';
  return `https://wa.me/${contato.whatsapp}${texto}`;
}

export function linkReserva() {
  return contato.reservaUrl ?? linkWhatsApp(contato.mensagemReserva);
}
