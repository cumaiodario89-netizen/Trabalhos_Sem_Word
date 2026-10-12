// ===== CONFIGURAÇÃO (editar aqui) =====
const SITE = {
  checkout: "https://pay.tutora.co.mz/e1893a58b82c4165be92db661b087532",  // link de pagamento
  whatsapp: "258867355701",      // só para dúvidas (258, sem + nem espaços)
  preco: "",                      // opcional, ex: "299 MT" (vazio esconde)
  precoAntigo: "",                // opcional, ex: "499 MT" (aparece riscado)
  // Urgência REAL (opcional): só preenche se o preço realmente mudar nessa data.
  // Formato: "2026-10-31T23:59:00+02:00". Vazio = sem contagem regressiva.
  fimOferta: "",
  textoOferta: "Preço de lançamento termina em",
  pixelMeta: "",                  // ID do Pixel do Meta (opcional, para anúncios)
  depoimentos: []                 // ex: { nome: "Maria, Maputo", texto: "Fiz o meu CV numa noite." }
};
