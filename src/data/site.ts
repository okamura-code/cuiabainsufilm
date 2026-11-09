export const site = {
  name: 'Cuiabá Insulfilm',
  legalName: 'Cuiabá Insulfilm Som e Acessórios',
  url: 'https://cuiabainsufilm.pages.dev',
  description:
    'Película automotiva Window Blue com certificado de garantia, PPF, som e acessórios em Cuiabá-MT. Revenda autorizada em Dom Aquino. Orçamento pelo WhatsApp.',
  phoneDisplay: '(65) 99340-1663',
  phoneE164: '+5565993401663',
  whatsapp: 'https://wa.me/5565993401663',
  instagram: 'https://www.instagram.com/cuiaba_insulfilm/',
  instagramHandle: '@cuiaba_insulfilm',
  brand: 'Window Blue',
  address: {
    street: 'Av. Carmindo de Campos, 75',
    neighborhood: 'Dom Aquino',
    city: 'Cuiabá',
    state: 'MT',
    zip: '78015-100',
    reference: 'Cruzamento com a Av. Miguel Sutil',
  },
  hours: [
    { days: 'Segunda a sexta', time: '8h às 18h', schema: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '18:00' },
    { days: 'Sábado', time: '8h às 12h', schema: ['Saturday'], opens: '08:00', closes: '12:00' },
    { days: 'Domingo', time: 'fechado', schema: [], opens: '', closes: '' },
  ],
  rating: { value: 5, count: 32 },
  mapsQuery: 'Cuiabá insulfilm som e acessórios, Av. Carmindo de Campos, 75, Dom Aquino, Cuiabá - MT',
};

export const wa = (text: string) => `${site.whatsapp}?text=${encodeURIComponent(text)}`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

/* Services confirmed in the 2026-11-06 planning package. Película is the main service; the rest are complementary.
   No prices, brands, durations, percentages or guarantees beyond what the owner confirmed. */
export type Service = { slug: string; title: string; short: string; wa: string; image?: string; alt?: string };
export const services: Service[] = [
  { slug: 'pelicula-automotiva', title: 'Películas automotivas', short: 'Conforto térmico, proteção UV e o visual que combina com você. As características variam conforme a película escolhida.', wa: 'Olá! Quero um orçamento de película automotiva para meu carro.' },
  { slug: 'ppf', title: 'PPF', short: 'Uma camada de proteção para a pintura. Consulte opções de aplicação para seu veículo.', wa: 'Olá! Quero um orçamento de PPF (proteção de pintura).', image: '/media/services/ppf.webp', alt: 'Película transparente de proteção sendo aplicada sobre a pintura de um carro (imagem ilustrativa)' },
  { slug: 'ppf-multimidia', title: 'PPF na multimídia', short: 'Película transparente na tela da central multimídia, para ajudar a evitar riscos e marcas do uso diário.', wa: 'Olá! Quero um orçamento de PPF para a tela da multimídia.', image: '/media/services/ppf-multimidia.webp', alt: 'Película transparente sendo aplicada na tela da central multimídia de um carro (imagem ilustrativa)' },
  { slug: 'acessorios-e-multimidia', title: 'Acessórios e multimídia', short: 'Som, multimídia, câmera e sensor de ré, além de iluminação LED interna. Consulte compatibilidade e opções de instalação.', wa: 'Olá! Quero um orçamento de som, multimídia ou acessórios.', image: '/media/services/som-multimidia.webp', alt: 'Alto-falante instalado na porta e central multimídia ao fundo (imagem ilustrativa)' },
  { slug: 'teto-solar', title: 'Película térmica no teto solar', short: 'Reduz o calor que entra pelo teto e deixa a cabine mais confortável, sem perder a vista do céu.', wa: 'Olá! Quero um orçamento de película térmica para teto solar.', image: '/media/services/teto-solar.webp', alt: 'Teto solar panorâmico aberto visto de dentro do carro (imagem ilustrativa)' },
  { slug: 'start-stop', title: 'Sistema start-stop', short: 'Consulte o serviço disponível para seu modelo.', wa: 'Olá! Quero saber sobre o serviço de sistema start-stop para meu carro.', image: '/media/services/start-stop.webp', alt: 'Botão de partida start-stop no painel de um carro (imagem ilustrativa)' },
];

export const reviews = [
  // texto e nomes como publicados no Google; uso dos nomes autorizado pelo dono em 2026-11-04
  { text: "Preço e qualidade que cabe a todos os bolsos. Ótimo atendimento!! Super recomendo", author: "Claudia Lopes", meta: "Local Guide · 4 meses atrás" },
  { text: "Excelente materiais excelente atendimento prestam bastante atenção nos detalhes instalação rápida com certificação e durabilidade e tem uma durabilidade muito boa contra os raios UV", author: "Carlos Mateus", meta: "Local Guide · 11 meses atrás" },
  { text: "Ótimo atendimento, super profissional e com seriedade. Realmente valeu a pena cada centavo. Estão realmente de parabéns pelo trabalho", author: "Junior Venancio", meta: "10 meses atrás" },
];

/* Seven answers approved in documentos/faq-aprovado.md (2026-11-06). Keep the wording. */
export const faq = [
  { q: 'Como faço para agendar?', a: 'Fale com a loja pelo WhatsApp, informe o modelo do carro e o serviço desejado e consulte os horários disponíveis.' },
  { q: 'Quanto tempo leva a aplicação?', a: 'O prazo depende do veículo, dos vidros atendidos e da necessidade de remover película antiga. Confirme a previsão para o seu carro no orçamento.' },
  { q: 'A película tem garantia?', a: 'As películas automotivas Window Blue oferecidas pela loja acompanham certificado de garantia vitalícia, conforme as condições e a cobertura da linha aplicada. Guarde seu certificado.' },
  { q: 'Vocês atendem a domicílio?', a: 'Sim, em Cuiabá e região. Consulte pelo WhatsApp a disponibilidade para seu endereço e o serviço desejado, mediante agendamento.' },
  { q: 'Atendem aos sábados?', a: 'Sim, das 8h às 12h. De segunda a sexta, o atendimento é das 8h às 18h.' },
  { q: 'Posso baixar os vidros e lavar logo depois?', a: 'A película precisa de um período de fixação. Siga os prazos e cuidados indicados para o produto aplicado antes de movimentar ou limpar os vidros.' },
  { q: 'Como recebo um orçamento?', a: 'Envie pelo WhatsApp o modelo e o ano do carro, o serviço desejado e, se houver, fotos do que precisa ser feito.' },
];
