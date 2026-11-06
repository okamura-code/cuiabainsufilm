# Cuiabá Insulfilm Som e Acessórios — relatório de contexto do site (06/11/2026)

Relatório de leitura do projeto, sem alterações. Serve para outro assistente planejar o design seção por seção sem acesso ao código. Onde algo não foi encontrado, está dito. Legenda de estado: **[implementado]** está no código e funciona no preview; **[incompleto]** existe mas depende de material ou ajuste; **[ideia]** só registrado em documento/conversa.

---

## 1. Visão geral

- **Negócio:** loja automotiva em Dom Aquino, Cuiabá-MT (Av. Carmindo de Campos, 75, cruzamento com a Av. Miguel Sutil). Revenda autorizada de películas Window Blue, com garantia vitalícia e certificado. Só automotivo, B2C, todo tipo de carro. Atende com hora marcada e a domicílio em Cuiabá e região. Horário: seg–sex 8h–18h, sáb 8h–12h. Fonte: `src/data/site.ts` e `CONTEUDO-A-CONFIRMAR.md`.
- **Serviços apresentados (6, em `services`):** películas automotivas (carro-chefe), PPF (proteção de pintura), som e multimídia, envelopamento, alarmes/travas/engates/capota marítima, teto solar (manutenção).
- **Público:** motorista de Cuiabá que sofre com calor; donos de carro de passeio, SUV e caminhonete; cliente que decide pelo WhatsApp.
- **Ação principal:** iniciar conversa no WhatsApp (65) 99340-1663. Não existe e-mail nem telefone fixo no site. Todo CTA, formulário e card desemboca em um link `wa.me` com mensagem pré-preenchida (função `wa()` em `site.ts`). A home tem 17 links de WhatsApp.
- **Tom aprovado pelo dono:** descontraído, inovador, com credibilidade. Cores: as da logo (preto + verde-limão).
- **Prova social:** nota 5,0 com 32 avaliações no Google; 3 avaliações reais com nome (autorizadas em 04/11/2026). Regra do projeto: nunca inventar depoimentos, números, certificações ou dados técnicos.

---

## 2. Estrutura atual (branch `redesign-v6-video-hero`, preview https://cuiaba-insulfilm-celno78c1-okamuraextra-8814.vercel.app; produção https://cuiaba-insulfilm.vercel.app ainda está na v2 antiga)

### Home (`src/pages/index.astro`), na ordem
1. **Header** [implementado] — wordmark em HTML/CSS imitando a logo ("CUIABÁ / insulfilm / SOM E ACESSÓRIOS"), links Serviços · Simulador · Galeria · Avaliações · Contato, botão WhatsApp verde. Fixo, menu hambúrguer no celular. (`src/components/Header.astro`)
2. **Hero** (`#topo`) [implementado, rejeitado pelo dono do projeto] — vídeo gerado por IA (Gemini, 5,2 s, carro branco acelerando e virando rastros de luz) toca uma vez; a logo real aparece centralizada nos últimos 0,8 s; ao terminar, logo desliza para o canto e entram o H1 "Lá fora é Cuiabá. Aqui dentro, não.", subtítulo, 2 CTAs (WhatsApp e "Ver a diferença") e 4 perks. Poster = primeiro frame. (`src/components/Hero.astro`, `public/media/hero-video.mp4`, `hero-poster.webp`, `logo-hero.webp`)
3. **Orçamento em 2 campos** (`#orcamento-rapido`) [implementado] — card claro sobreposto ao fim do hero: campo "qual é o seu carro?" + select de serviço → abre WhatsApp com a mensagem montada. (`QuickQuote.astro`)
4. **Manifesto** (`#manifesto`) [implementado] — texto gigante condensado "O calor não pede licença…" cujas palavras acendem em cascata ao entrar na tela; 3 linhas mono abaixo. (`Manifesto.astro`)
5. **Raio-X do vidro** (`#calor`) [implementado, rejeitado] — seção pinada no desktop (300vh) em 3 atos: foto real do SUV na oficina com "termografia" em CSS (véu laranja que esfria, película que desce, barra de calor) + 3 frases numeradas + 4 contadores reais (nota 5, 6 tonalidades, 70 % luz mínima, 1 carro por vez). Um 3D anterior (Three.js) foi removido. (`HeatFacts.astro`)
6. **Simulador de tonalidade** (`#simulador`) [implementado, manter] — ver seção 5 deste relatório. (`VltSimulator.astro`)
7. **Antes e depois** (`#antes-depois`) [implementado, manter] — comparador com divisória arrastável sobre a mesma foto do Porsche (lateral esquerda): sem película × película G5. Input range nativo (mouse, toque, teclado), leitura "Divisória 50 %", demo automática de 2,4 s ao entrar na tela, CTA WhatsApp. (`BeforeAfter.astro`)
8. **Quiz "Qual película é a sua?"** (`#questionario`) [implementado] — 3 perguntas (o que incomoda; dirige à noite; aparência clara/escura) e recomendação de tonalidade com CTA. (`Quiz.astro`)
9. **Níveis de proteção** (`#servicos`) [implementado, recém-feito] — desktop: palco pinado de 500vh com 5 quadros (capa + 4 níveis: película, PPF, som, envelopamento/acessórios); carro recortado (Porsche branco em 4 ângulos, fundo transparente) muda de ângulo, tamanho e posição por scroll; textos entram escalonados; nav lateral com tracinhos; grão. Celular: 4 painéis empilhados com foto. (`ProtectionLevels.astro`, `public/media/car/`)
10. **Bastidores / processo** (`#processo`) [implementado, rejeitado] — 5 fichas: diagnóstico, escolha, preparação, aplicação, acabamento, com fotos. (`Process.astro`)
11. **Vitrine / galeria** (`#galeria`) [implementado, rejeitado] — grade com filtro por serviço e por tipo de veículo, lightbox `<dialog>` com CTA. (`GalleryPro.astro`)
12. **Avaliações** (`#avaliacoes`) [implementado] — nota 5,0 grande, 3 cards com as avaliações reais, diferenciais. (`Reviews.astro`)
13. **FAQ** (`#duvidas`) [implementado] — 7 perguntas (lei de escurecimento, garantia, tempo, agendamento, domicílio, remoção, pagamento) com JSON-LD FAQPage. (`Faq.astro`)
14. **Finale** (`#final`) [implementado] — "O sol continua o mesmo. Seu carro, não." em contorno que preenche ao entrar + CTA WhatsApp + "Como chegar". (`Finale.astro`)
15. **Footer** + botão flutuante de WhatsApp [implementado].

### Páginas internas [implementadas, estilo v3]
- `/servicos/` — cabeçalho "O que fazemos, e como fazemos." + um bloco por serviço (foto, texto, inclusos, para quem é, CTA).
- `/sobre/` — "Uma loja de bairro que entende de calor", revenda autorizada, "três coisas que não abrimos mão", localização (sem data de fundação: o dono não sabe).
- `/galeria/` — mesma galeria filtrável.
- `/contato/` — formulário (nome, carro, serviço, mensagem) que monta o texto e abre o WhatsApp; não envia e-mail.
- `/404`.

---

## 3. Identidade visual

- **Logo:** oficial em preto + verde-limão, "insulfilm" em script; arquivos: `public/media/logo-512.png` (OG/ícone), `raw/logo-2k.png`, `raw/cliente/IMG_6304.jpg.jpeg` (fundo preto, usada no hero como `logo-hero.webp`). **Falta** logo em vetor (SVG/PDF); o header usa texto estilizado em vez do arquivo. Grafia a confirmar: "Insulfilm" (logo) × "Insufilme" (como o dono escreveu).
- **Cores (tokens em `src/styles/global.css`):** fundo `--ink #0b0d10`, superfícies `--asphalt #15181d` / `--steel #262b33`, texto `--fog #ece8df`, secundário `--mist #b4aea2`, claro `--paper #f6f4ee`, acento único `--lime #a4e52e` (versão escura `--lime-deep #3d6b00` para fundo claro), calor `--heat` laranja translúcido (só em gradientes).
- **Fontes (self-hosted em `public/fonts/`):** Barlow Condensed 700/800 para títulos (maiúsculas, gigantes), Open Sans para texto, Montserrat + Kaushan Script só no wordmark, monoespaçada do sistema para rótulos técnicos.
- **Estilo da v3–v6:** "cinema e peso": escuro, tipografia condensada em escala editorial, rótulos mono com índices (01/04, coordenadas), uma cor de acento, seções pinadas. Seções claras só em processo, avaliações e FAQ. Este estilo foi **rejeitado** em 06/11; direção nova desejada: componentes modernos tipo 21st.dev/shadcn (ver seção 9).
- **Celular:** tudo empilha; nada de pin, Lenis, cursor ou cenas de scroll abaixo de 900 px; hero cobre a tela com o vídeo 16:9 cortado; comparador vira 4:3; galeria em 2 colunas. Verificado em emulação 375×812 e nas capturas do iPhone do dono.

---

## 4. Interações e animações (estado real)

- **Ao abrir:** vídeo do hero toca uma vez (sem loop), texto escondido até o fim; logo real pousa no centro e depois vai ao canto; se autoplay for bloqueado, reduced-motion ou vídeo travar 7 s, pula para o estado final. Não existe mais intro/splash (houve um termômetro de abertura na v5, removido).
- **Ao rolar (desktop ≥ 900 px, sem reduced-motion):** Lenis (scroll suave) + cursor customizado com botões magnéticos; reveal por IntersectionObserver em quase todas as seções (`.reveal.is-in`); manifesto acende palavra a palavra; **scrollytelling existe em 3 lugares:** Raio-X (300vh, 3 atos por progresso), Simulador (400vh, o scroll escurece o vidro G70→G3 e o range acompanha), Níveis (500vh, 5 quadros com hold). Padrão técnico comum: seção alta + palco `position: sticky` + progresso `p = (68 − top) / (altura − viewport + 68)` em `requestAnimationFrame`. Finale preenche o título ao entrar.
- **Ao clicar/selecionar:** simulador troca vista e tonalidade; comparador arrasta; quiz avança 3 passos; galeria filtra e abre lightbox; nav lateral dos níveis rola até o quadro; links do header rolam com offset; páginas trocam com View Transitions do Astro (header e botão flutuante persistem).
- **Celular/reduced-motion:** só reveals; nada pinado.
- Observação: um antigo "termômetro lateral" (barra com rótulo da seção) ainda existe no layout no desktop (`Base.astro`, `.thermo`).

---

## 5. Simulador da Porsche

- **Onde:** home, seção `#simulador` ("03 · Simulador de tonalidade — Escolha o tom. Veja antes de aplicar."), também linkada no header. O mesmo carro aparece no antes/depois (`#antes-depois`) e numa ficha do processo.
- **Opções reais:** 4 vistas (Frente, Lateral esq., Lateral dir., Traseira) × 6 tonalidades por um range de 0 a 5: **G3 (3 % de luz), G5 (5 %), G20 (20 %), G35 (35 %), G50 (50 %), G70 (70 %)**. Padrão inicial: G35, vista frontal. Cada tom tem descrição curta e aviso legal (≥ 70 % permitido em para-brisa e dianteiros; abaixo disso só traseiros/vigia; Resolução CONTRAN 960/2022).
- **Como a imagem muda:** duas `<img>` sobrepostas fazem crossfade entre o frame do tom inferior e o superior; no desktop o scroll também move o tom continuamente. O CTA de WhatsApp muda o texto com o tom escolhido ("Simulei a tonalidade G35…").
- **Imagens:** 4 pastas × 6 frames pré-renderizados em `public/media/porsche/frames/{frente,lateral-esquerda,lateral-direita,traseira}/g3…g70.webp` (1500×750), gerados a partir de fotos de divulgação de um Porsche 911 branco enviadas pelo dono do projeto (`raw/porsche/`, com crista/nome visíveis) por um script de tingimento dos vidros (`scripts/frames.mjs` citado no código; a pasta `scripts/` não existe mais no repositório, só o nome no comentário). `lateral-esquerda/original.webp` é a base do antes/depois.
- **Estado:** funciona (mouse, toque, teclado, scroll), é o único recurso que o dono quer manter. Pendências registradas: confirmar direito de uso das fotos da Porsche ou trocar por carro do cliente; confirmar com o dono quais tonalidades Window Blue realmente vende (os 6 nomes não foram confirmados); "cenários de iluminação" (sol/noite) foram ideia, não implementados.

---

## 6. Imagens e materiais

- **Fotos reais da loja** (`raw/cliente/`, originais; versões WebP em `public/media/`): `sobre.webp` (fachada verde), `processo-preparacao`, `processo-aplicacao`, `processo-acabamento`, `gal-suv-oficina` (SUV cinza VW na oficina), `gal-hatch-lateral`, `gal-hatch-frente`, `gal-bancos-protegidos`. Dois vídeos do cliente (`IMG_3337.mov`, `copy_…MOV`) estão em `raw/cliente/`, não usados no site. Fotos vieram em retrato (celular).
- **Geradas por IA (Higgsfield, ilustrativas, autorizadas pelo dono sem rótulo):** `svc-insulfilm`, `svc-ppf`, `svc-som`, `svc-envelopamento`, `svc-acessorios`, `svc-teto`, `gal-2` (caminhonete), `quiz-conforto`, `processo-inspecao`, `og.jpg` (prévia de link). Usadas nos cards de serviço, galeria, quiz e páginas internas.
- **Vídeo do hero:** gerado no Gemini pelo dono do projeto (`raw/hero-video/carro-logo.mp4`, 10 s; cortado em 5,2 s e reencodado para `public/media/hero-video.mp4`, 2,5 MB). Rejeitado.
- **Carro recortado dos Níveis:** `public/media/car/{frente34,lateral,traseira34,topo}.webp`, gerados no ChatGPT a partir das fotos do Porsche (fundo transparente). A traseira mostra "PORSCHE" escrito.
- **Logo:** ver seção 3. **Falta:** vetor da logo; mais fotos horizontais (carros prontos de lado/frente, PPF, som, capota); certificado Window Blue; foto de carro do cliente para substituir o Porsche; datasheet Window Blue (rejeição de calor/UV, hoje não citada por falta de fonte). Lista completa em `PEDIDO-AO-CLIENTE.md`.
- Regra vigente para imagens geradas: sem texto, logos, placas ou pontos turísticos reconhecíveis; originais ficam em `raw/` (fora do git e do deploy).

---

## 7. Base técnica

- **Framework:** Astro 7 (site estático), `@astrojs/sitemap`; deploy Vercel (`npx vercel --prod --yes`, feito pelo dono do projeto). Sem React, Tailwind ou shadcn hoje. Dependências: `lenis` (scroll suave), `sharp` (conversão de imagens), `@fontsource/barlow-condensed` (dev). Three.js foi instalado na v5 e removido.
- **Estilos:** `src/styles/global.css` (tokens, tipografia, header, botões, cards, reveal) e `src/styles/scenes.css` (hero, manifesto, raio-X, simulador pinado, antes/depois, níveis, finale, motion).
- **Layout:** `src/layouts/Base.astro` (head, fontes preloaded, JSON-LD AutoPartsStore + FAQPage, View Transitions, termômetro, scripts de reveal e contadores).
- **Scripts:** `src/scripts/smooth.ts` (Lenis), `src/scripts/pointer.ts` (cursor/magnéticos). Os demais comportamentos são scripts inline por componente (`is:inline data-astro-rerun`).
- **Dados:** `src/data/site.ts` (`site`, `services`, `reviews`, `faq`, `gallery`, `concept`, `counters`, `levels`, `process`, helpers `wa`, `srcset`, `mapsLink`).
- **Componentes:** `Header`, `Hero`, `QuickQuote`, `Manifesto`, `HeatFacts`, `VltSimulator`, `BeforeAfter`, `Quiz`, `ProtectionLevels`, `Process`, `GalleryPro`, `Reviews`, `Faq`, `Finale`, `Footer`, `WhatsAppFloat`, `SceneHead`, `Icons` (todos em `src/components/`).
- **Git:** branch atual `redesign-v6-video-hero`; tags `v2-antes-redesign`, `v3-cinema`, `v4-fotos`, `v5-cinema-3d`. Docs: `docs/superpowers/specs/2026-11-05-v5-cinema-3d-design.md` e `docs/superpowers/plans/2026-11-05-v5-cinema-3d.md` (v5, superada).
- **Desempenho medido (Lighthouse, máquina lenta):** desktop 97–100; mobile 71–77 (TBT alto nesta máquina; em medições anteriores a base era 69–71); acessibilidade 100.

---

## 8. Funcionalidades e pendências

**Funciona (observado em preview):** todos os CTAs WhatsApp; formulário de contato e orçamento rápido abrindo o WhatsApp com mensagem; simulador; comparador; quiz; galeria com filtros e lightbox; navegação por âncoras e View Transitions; FAQ; mapa (link Google Maps); sitemap e robots.

**Pendências registradas (`CONTEUDO-A-CONFIRMAR.md`, `DOMINIO-E-GOOGLE.md`, `PEDIDO-AO-CLIENTE.md`):** domínio próprio não existe (`cuiabainsulfilm.com.br` sugerido; canonical hoje aponta para o `.vercel.app`); Google Search Console; logo vetorial; grafia; CEP a conferir; tonalidades e garantias por serviço a confirmar; certificações sem detalhe; datasheet Window Blue; fotos/vídeos adicionais.

**Problemas observados:** (a) hero, raio-X, bastidores e vitrine rejeitados pelo dono do projeto; (b) comparador no celular ficou desalinhado numa versão (corrigido com `clip-path`); (c) Safari do iPhone não roda as animações `animation-timeline: view()` (substituídas por IntersectionObserver no manifesto e finale, mas o zoom das fotos dos níveis e o "desenho" do diagrama ainda usam `view()` e não animam no iOS); (d) as páginas internas continuam no estilo v3 e não foram revistas desde a v4.

**Suspeitas, não verificadas:** iPad antigo em 1024×768 pode perder o pin do raio-X; Lighthouse mobile real deve ser mais alto que o medido aqui; a imagem traseira do Porsche com "PORSCHE" escrito pode ferir a regra "sem marcas".

---

## 9. Decisões e orientações já registradas

- **Regras do projeto (conversa com o dono do projeto, mantidas em todas as rodadas):** Higgsfield é a ferramenta oficial de imagem/vídeo; credenciais só em variáveis de ambiente; não gerar depoimentos falsos; preferir fotos reais; imagens ilustrativas sem texto/logos/placas/pontos turísticos; originais em `raw/`; não inventar números, certificações, marcas, garantias ou dados técnicos; manter todos os links de WhatsApp; preservar simulador, comparador, orçamento rápido, galeria, avaliações, FAQ e localização; deploy de produção feito pelo dono.
- **Do dono da loja (`CONTEUDO-A-CONFIRMAR.md`):** tom descontraído e inovador com credibilidade; cores da logo; sem blog, sem Analytics; contato só WhatsApp; avaliações e imagens por IA autorizadas.
- **Conceito v3 (aprovado em 05/11, hoje em revisão):** "Lá fora é Cuiabá. Aqui dentro, não." em `concept` de `site.ts`; spec v5 "Cinema e peso" (intro, 3D, cenas) em `docs/superpowers/specs/`.
- **Decisões de 06/11 (conversa):** o dono do projeto rejeitou hero com IA, animação do calor, bastidores e vitrine; quer recomeçar com visual **21st.dev/shadcn**, mantendo os seletores de película do Porsche. Um plano (estrutura "SaaS premium": hero com badge + moldura de foto, marquee de confiança, bento de serviços, simulador, antes/depois, como funciona em tabs, avaliações, FAQ, CTA final; stack Astro + Tailwind + React islands) foi apresentado e **recusado**; nada dele foi implementado. Referências levantadas: heroes do 21st.dev (Hero Section 6 @meschacirung, Modern Hero @ravikatiyar162, Glowy Waves @moumensoliman, Illuminated Hero @efferd), Magic UI (marquee, bento-grid, border-beam, number-ticker), roundup dev.to "Top 14 shadcn hero sections"; sites vivos vistos: oaperformance.com (intro de logo sobre vídeo), poezabride.com (logo que cresce sobre vídeo), davidalaba.com (scroll-cinema vertical), lucidmotors.com. Um componente "Lycoris Specimen" do 21st.dev foi usado só como referência de mecânica (quadros por scroll com hold, reveals escalonados, nav lateral).
- **Proposta em aberto (não é o site atual):** seis seções com scrollytelling e abertura com animação da logo. Nada disso está especificado em arquivo; só o que está descrito acima existe.

---

## Resumo do estado atual

Site Astro estático, funcional e publicado em preview, com conteúdo real validado (serviços, avaliações, FAQ, endereço, horário) e uma camada visual "cinema" (v3–v6) que o dono do projeto não aprovou. O que deve sobreviver ao recomeço: dados de `site.ts`, simulador de tonalidade e antes/depois do Porsche, fotos reais da loja, logo, JSON-LD/SEO e o fluxo de conversão por WhatsApp.

**Decisões de design ainda a tomar:** tema claro ou escuro no novo estilo; qual hero (com ou sem abertura animada da logo, com foto real ou efeito de fundo); quais seis seções compõem o scrollytelling e qual mecânica cada uma usa; se os componentes 21st.dev entram como React islands ou recriados em Astro/CSS; destino da galeria e do processo (reformular ou cortar); substituir ou não o Porsche por carro do cliente; o que fazer com as páginas internas; regra para imagens geradas no novo site (complemento ou nenhuma).
