export const site = {
  name: 'Cuiabá Insulfilm',
  legalName: 'Cuiabá Insulfilm Som e Acessórios',
  url: 'https://cuiaba-insulfilm.vercel.app',
  description:
    'Película térmica Window Blue com garantia vitalícia, PPF, som e acessórios automotivos em Cuiabá-MT. Revenda autorizada em Dom Aquino, ao lado da Av. Miguel Sutil. Orçamento pelo WhatsApp.',
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
// 640w + 1200w WebP pair made by scripts/webp.mjs
export const srcset = (src: string) => `${src.replace(/.webp$/, "-640.webp")} 640w, ${src} 1200w`;
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

export type Service = {
  slug: string;
  title: string;
  short: string;
  body: string;
  includes: string[];
  ideal: string;
  image: string;
  alt: string;
  wa: string;
  tags: { icon: string; label: string }[];
};

export const services: Service[] = [
  {
    slug: 'insulfilm-automotivo',
    title: 'Películas automotivas',
    short: 'Mais conforto e privacidade para acompanhar sua rotina, com película Window Blue e garantia vitalícia.',
    body:
      'Em Cuiabá o vidro do carro vira estufa em minutos. A película térmica Window Blue reflete o calor e bloqueia os raios UV, em todas as tonalidades, com a lei da Resolução CONTRAN 960/2022 respeitada. Somos revenda autorizada: corte sob medida, aplicação sem bolhas e certificado de garantia vitalícia na mão.',
    includes: [
      'Películas Window Blue em todas as tonalidades',
      'Garantia vitalícia Window Blue, com certificado',
      'Chancela obrigatória nos vidros dianteiros',
      'Remoção de película antiga sem danificar o desembaçador',
    ],
    ideal: 'Carros de passeio, SUVs e caminhonetes de qualquer marca.',
    image: '/media/svc-insulfilm.webp',
    alt: 'Rodo pressionando película térmica escura no vidro de um carro',
    wa: 'Olá! Quero um orçamento de película térmica Window Blue para meu carro.',
    tags: [{ icon: 'sun', label: 'Conforto térmico' }, { icon: 'lock', label: 'Privacidade' }, { icon: 'shield', label: 'Garantia vitalícia' }],
  },
  {
    slug: 'ppf',
    title: 'Proteção de pintura · PPF',
    short: 'Uma camada de cuidado para preservar a pintura do seu carro.',
    body:
      'O PPF (Paint Protection Film) é uma película transparente e espessa aplicada sobre a pintura. Absorve impactos de pedras e cascalho, resiste a riscos de lavagem e se regenera com o calor. No acabamento, fica invisível.',
    includes: ['Frente completa, capô, para-choques ou carro inteiro', 'Película autorregenerativa com calor', 'Acabamento invisível, sem alterar a cor'],
    ideal: 'Carros zero km, caminhonetes de estrada e quem roda em cascalho.',
    image: '/media/svc-ppf.webp',
    alt: 'Película transparente de proteção sendo aplicada no capô de um SUV',
    wa: 'Olá! Quero um orçamento de PPF (película de proteção de pintura).',
    tags: [{ icon: 'shield', label: 'Proteção' }, { icon: 'sparkle', label: 'Acabamento' }],
  },
  {
    slug: 'som-e-multimidia',
    title: 'Som e multimídia',
    short: 'Conectividade e uma nova experiência em cada viagem.',
    body:
      'Instalação de central multimídia com Android Auto e CarPlay, alto-falantes, módulos, subwoofer e câmera de ré. Tudo com chicote original e acabamento de fábrica, sem gambiarra na fiação.',
    includes: ['Centrais multimídia com Android Auto e CarPlay', 'Alto-falantes, módulos e subwoofer', 'Câmera de ré e sensor de estacionamento'],
    ideal: 'Quem quer atualizar o carro sem perder a garantia de fábrica.',
    image: '/media/svc-som.webp',
    alt: 'Técnico instalando central multimídia no painel de uma caminhonete',
    wa: 'Olá! Quero um orçamento de som / central multimídia.',
    tags: [{ icon: 'music', label: 'Multimídia' }, { icon: 'speaker', label: 'Áudio' }],
  },
  {
    slug: 'envelopamento',
    title: 'Envelopamento',
    short: 'Mude a cor, proteja a pintura original e valorize a revenda.',
    body:
      'Envelopamento total ou parcial: teto, capô, retrovisores, colunas ou o carro inteiro. O vinil protege a pintura original e sai sem deixar marcas quando você quiser voltar ao original.',
    includes: ['Envelopamento total ou parcial', 'Preto fosco, acetinado e cores sólidas', 'Remoção limpa, sem danificar a pintura'],
    ideal: 'Personalização e proteção da pintura.',
    image: '/media/svc-envelopamento.webp',
    alt: 'Aplicador esticando vinil preto acetinado na porta de um carro',
    wa: 'Olá! Quero um orçamento de envelopamento.',
    tags: [{ icon: 'palette', label: 'Estilo' }, { icon: 'shield', label: 'Proteção da pintura' }],
  },
  {
    slug: 'alarmes-travas-engates',
    title: 'Alarmes, travas e engates',
    short: 'Segurança e utilidade: alarme, trava elétrica, engate e capota marítima.',
    body:
      'Alarmes, travas elétricas, engates e capotas marítimas para caminhonetes. Instalação com acabamento original e peças de procedência.',
    includes: ['Alarmes e travas elétricas', 'Engates e capotas marítimas', 'Instalação com acabamento original'],
    ideal: 'Caminhonetes e carros de trabalho.',
    image: '/media/svc-acessorios.webp',
    alt: 'Caminhonete grafite com capota marítima e engate',
    wa: 'Olá! Quero um orçamento de alarme / trava / engate / capota marítima.',
    tags: [{ icon: 'lock', label: 'Segurança' }, { icon: 'wrench', label: 'Instalação original' }],
  },
  {
    slug: 'teto-solar',
    title: 'Teto solar',
    short: 'Manutenção e reparo: vedação, trilhos, motor e comandos.',
    body:
      'Teto solar que travou, vaza ou faz barulho tem conserto. Limpamos e lubrificamos os trilhos, trocamos vedações e diagnosticamos motor e comandos.',
    includes: ['Limpeza e lubrificação dos trilhos', 'Troca de vedação', 'Diagnóstico de motor e comandos'],
    ideal: 'Carros com teto solar que travou, vaza ou faz barulho.',
    image: '/media/svc-teto.webp',
    alt: 'Mão com luva limpando o trilho do teto solar panorâmico',
    wa: 'Olá! Preciso de manutenção no teto solar.',
    tags: [{ icon: 'droplet', label: 'Vedação' }, { icon: 'wrench', label: 'Mecânica' }],
  },
];

export const reviews = [
  // texto e nomes como publicados no Google; uso dos nomes autorizado pelo dono em 2026-11-04
  { text: "Preço e qualidade que cabe a todos os bolsos. Ótimo atendimento!! Super recomendo", author: "Claudia Lopes", meta: "Local Guide · 4 meses atrás" },
  { text: "Excelente materiais excelente atendimento prestam bastante atenção nos detalhes instalação rápida com certificação e durabilidade e tem uma durabilidade muito boa contra os raios UV", author: "Carlos Mateus", meta: "Local Guide · 11 meses atrás" },
  { text: "Ótimo atendimento, super profissional e com seriedade. Realmente valeu a pena cada centavo. Estão realmente de parabéns pelo trabalho", author: "Junior Venancio", meta: "10 meses atrás" },
];

export const faq = [
  {
    q: 'Qual escurecimento é permitido por lei?',
    a: 'Para-brisa e vidros dianteiros: mínimo de 70% de transmitância luminosa. Vidros traseiros e vigia: sem mínimo, desde que o carro tenha retrovisores externos dos dois lados. Película espelhada é proibida em qualquer vidro. Base: Resolução CONTRAN 960/2022, alterada pela 989/2022.',
  },
  {
    q: 'A película tem garantia?',
    a: 'Sim. As películas Window Blue têm garantia vitalícia, e você recebe o certificado na hora da aplicação.',
  },
  {
    q: 'Quanto tempo leva a aplicação?',
    a: 'Reserve meio período. Você deixa o carro na hora marcada e busca no mesmo turno.',
  },
  {
    q: 'Precisa agendar?',
    a: 'Sim, atendemos só com hora marcada. Mande o modelo do carro no WhatsApp e respondemos com valor e horário, de segunda a sábado.',
  },
  {
    q: 'Vocês atendem a domicílio?',
    a: 'Sim, em Cuiabá e região, com agendamento.',
  },
  {
    q: 'Vocês removem película antiga?',
    a: 'Sim. Removemos sem produtos químicos agressivos e sem danificar o desembaçador do vidro traseiro.',
  },
  {
    q: 'Como posso pagar?',
    a: 'PIX, dinheiro, cartão de débito e crédito, com parcelamento. O valor é fechado no orçamento, antes de começar.',
  },
];

export const gallery = [
  { src: '/media/gal-1.webp', alt: 'SUV preto com película escura recém-aplicada, vista traseira', cat: 'peliculas', caption: 'Proteção e privacidade', vehicle: 'suv', vehicleLabel: 'SUV', service: 'Película automotiva' },
  { src: '/media/gal-2.webp', alt: 'Caminhonete branca com vidros escurecidos', cat: 'peliculas', caption: 'Cuidado em cada detalhe', vehicle: 'caminhonete', vehicleLabel: 'Caminhonete', service: 'Película automotiva' },
  { src: '/media/quiz-conforto.webp', alt: 'Vidro lateral com película e retrovisor refletindo palmeiras ao entardecer', cat: 'peliculas', caption: 'Conforto ao dirigir', vehicle: 'sedan', vehicleLabel: 'Sedã', service: 'Película automotiva' },
  { src: '/media/svc-ppf.webp', alt: 'Película transparente PPF sendo assentada no capô preto', cat: 'ppf', caption: 'Proteção invisível', vehicle: 'suv', vehicleLabel: 'SUV', service: 'PPF' },
  { src: '/media/svc-envelopamento.webp', alt: 'Vinil grafite acetinado sendo assentado com espátula de feltro', cat: 'outros', caption: 'Envelopamento acetinado', vehicle: 'sedan', vehicleLabel: 'Sedã', service: 'Acessórios' },
  { src: '/media/svc-insulfilm.webp', alt: 'Aplicação de película térmica', cat: 'peliculas', caption: 'Aplicação de película', vehicle: 'outros', vehicleLabel: 'Detalhe', service: 'Película automotiva' },
  { src: '/media/sobre.webp', alt: 'Oficina com técnico aplicando película no vidro de um SUV preto', cat: 'peliculas', caption: 'Oficina em ação', vehicle: 'suv', vehicleLabel: 'SUV', service: 'Película automotiva' },
  { src: '/media/svc-som.webp', alt: 'Ajuste final de central multimídia no painel', cat: 'som', caption: 'Central multimídia', vehicle: 'sedan', vehicleLabel: 'Compacto', service: 'Som e multimídia' },
  { src: '/media/processo-inspecao.webp', alt: 'Inspeção final da película com luminária portátil', cat: 'peliculas', caption: 'Inspeção final', vehicle: 'suv', vehicleLabel: 'SUV', service: 'Película automotiva' },
  { src: '/media/svc-acessorios.webp', alt: 'Caminhonete grafite com capota marítima e engate', cat: 'outros', caption: 'Capota marítima e engate', vehicle: 'caminhonete', vehicleLabel: 'Caminhonete', service: 'Acessórios' },
];

/* ===== v3 concept (approved 2026-11-05): "Lá fora é Cuiabá. Aqui dentro, não." ===== */
export const concept = {
  tagline: 'Dom Aquino · Cuiabá–MT · O calor não pede licença',
  coords: "15°35'S 56°05'W",
  sub: 'Película, PPF e som que transformam o seu carro no lugar mais fresco da cidade.',
  ctaPrimary: 'Quero o meu assim',
  ctaSecondary: 'Ver a diferença',
  cue: 'Role para entrar',
  manifesto: 'O calor não pede licença. Entra pelo vidro, senta no banco e viaja junto. A película decide o que fica do lado de fora.',
  manifestoAccent: 'película',
  finale: { a: 'O sol continua o mesmo.', b: 'Seu carro, não.', cta: 'Pedir orçamento no WhatsApp' },
};

// Only verifiable numbers render here. Anything with verified:false is skipped by HeatFacts.astro.
export const counters = [
  { value: 5, decimals: 1, sup: '★', label: 'Nota no Google', note: `${site.rating.count} avaliações públicas`, verified: true },
  { value: 6, decimals: 0, sup: '', label: 'Tonalidades', note: 'De G3 a G70, todas Window Blue', verified: true },
  { value: 70, decimals: 0, sup: '%', label: 'Luz mínima nos dianteiros', note: 'Para-brisa e dianteiros · CONTRAN 960/2022', verified: true },
  { value: 1, decimals: 0, sup: '', label: 'Carro por vez', note: 'Hora marcada, orçamento fechado antes', verified: true },
  // { value: 0, decimals: 0, sup: '%', label: 'Rejeição de calor (IR)', note: '[CONFIRMAR] datasheet Window Blue', verified: false },
];

export type Level = { idx: string; slug: string; kicker: string; title: string; text: string; includes: string[]; image: string; alt: string; wa: string; placeholder?: string };
export const levels: Level[] = [
  { idx: '01', slug: 'insulfilm-automotivo', kicker: 'Nível 01 · Vidro', title: 'Películas automotivas', text: 'A primeira barreira entre o sol de Cuiabá e o seu banco. Window Blue em todas as tonalidades, dentro da lei, com garantia vitalícia e certificado na mão.', includes: ['Todas as tonalidades, de G3 a G70', 'Garantia vitalícia Window Blue', 'Chancela nos vidros dianteiros', 'Remoção da película antiga'], image: '/media/svc-insulfilm.webp', alt: 'Rodo pressionando película térmica escura no vidro de um carro', wa: 'Olá! Quero um orçamento de película térmica Window Blue para meu carro.' },
  { idx: '02', slug: 'ppf', kicker: 'Nível 02 · Pintura', title: 'Proteção de pintura · PPF', text: 'Uma camada transparente e espessa sobre a pintura. Absorve pedra, cascalho e risco de lavagem, se regenera com o calor e fica invisível.', includes: ['Frente completa, capô, para-choques ou carro inteiro', 'Autorregenerativa com calor', 'Acabamento invisível'], image: '/media/svc-ppf.webp', alt: 'Película transparente de proteção sendo aplicada no capô de um SUV', wa: 'Olá! Quero um orçamento de PPF (película de proteção de pintura).' },
  { idx: '03', slug: 'som-e-multimidia', kicker: 'Nível 03 · Cabine', title: 'Som e multimídia', text: 'Central com Android Auto e CarPlay, alto-falantes, módulos, subwoofer e câmera de ré. Chicote original, acabamento de fábrica.', includes: ['Centrais com Android Auto e CarPlay', 'Alto-falantes, módulos e subwoofer', 'Câmera de ré e sensor de estacionamento'], image: '/media/svc-som.webp', alt: 'Técnico instalando central multimídia no painel de uma caminhonete', wa: 'Olá! Quero um orçamento de som / central multimídia.' },
  { idx: '04', slug: 'envelopamento', kicker: 'Nível 04 · Carroceria', title: 'Envelopamento e acessórios', text: 'Cor nova sem tocar na pintura original. E o que o dia a dia pede: alarmes, travas, engates, capota marítima e manutenção de teto solar.', includes: ['Envelopamento total ou parcial', 'Alarmes, travas e engates', 'Capota marítima para caminhonetes', 'Reparo de teto solar'], image: '/media/svc-acessorios.webp', alt: 'Caminhonete grafite com capota marítima e engate', wa: 'Olá! Quero um orçamento de envelopamento / acessórios.', placeholder: 'foto única de envelopamento + acessórios' },
];

export const process = [
  { n: '01', icon: 'chat', title: 'Diagnóstico', text: 'Modelo do carro no WhatsApp. Respondemos com valor fechado e horário, na loja ou a domicílio.', img: '/media/sobre.webp', alt: 'Oficina com técnico ao lado de um SUV preto', placeholder: 'foto real do atendimento no balcão' },
  { n: '02', icon: 'half', title: 'Escolha', text: 'Tonalidade escolhida com você, dentro da lei: G70 nos dianteiros, a sua preferência nos traseiros.', img: '/media/porsche/frames/frente/g35.webp', alt: 'Carro branco visto de frente com película G35', square: true },
  { n: '03', icon: 'droplet', title: 'Preparação', text: 'Vidro limpo a fundo, película cortada sob medida. Nada de poeira entre o vidro e a película.', img: '/media/processo-preparacao.webp', alt: 'Mão com pano de microfibra limpando o vidro lateral' },
  { n: '04', icon: 'spray', title: 'Aplicação', text: 'Assentamento com rodo, sem bolhas, sem pressa. Reserve meio período.', img: '/media/svc-insulfilm.webp', alt: 'Rodo pressionando a película úmida no vidro lateral' },
  { n: '05', icon: 'eye', title: 'Acabamento', text: 'Bordas, encaixes e inspeção final. Entrega com chancela nos dianteiros e certificado de garantia vitalícia.', img: '/media/processo-acabamento.webp', alt: 'Cartão de acabamento alinhando a borda superior da película' },
];
