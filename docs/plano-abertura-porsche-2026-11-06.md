# Plano — abertura com logo e apresentação da Porsche por scroll (v7, protótipo inicial)

Atualizado em 06/11/2026. Substitui os planos visuais anteriores (cinema v3–v6 e "SaaS premium" recusado) **apenas no trecho de abertura**. Não é um redesenho completo: as seis seções ainda estão em planejamento; este documento cobre só a sequência inicial (marca → revelação → vidros → interação → saída). Nada aqui foi implementado ainda.

## 1. O que muda em relação ao plano anterior

| Antes (v6 no ar) | Agora |
|---|---|
| Hero com vídeo gerado por IA (carro → logo) | Sai. Abertura em fundo preto com a **logo oficial** animada (referência Backstage Music: marca primeiro, site depois) |
| Scroll-cinema por frames de vídeo | **Scroll conduz a apresentação do carro** com 3 capturas reais do configurador (3/4 → lateral), aproximações e crossfades, textos entrando em pontos definidos (referência de ritmo: Lycoris Specimen, quadros com "hold") |
| Manifesto, raio-X, níveis com carro recortado | Fora deste trecho; destino decidido depois, seção por seção |
| Simulador na 6ª seção, com 4 vistas | Simulador **vira o destino da abertura** (passo 4) sobre a lateral nova; o simulador atual continua existindo e funcionando até a troca ser aprovada |
| Stack cinema (Lenis, cursor, 3D) | Mantém Astro + CSS/JS inline atuais. Nenhuma migração de tecnologia. Lenis/cursor ficam até decisão (não são exigidos pela abertura) |
| Identidade "cinema e peso" | Identidade própria: preto, branco, verde-lima da empresa. Tipografia a definir (hoje Barlow Condensed/Open Sans) |

Decisões firmes: câmera em percurso fixo (sem girar livremente); sem gerar outra Porsche; sem inventar ângulos intermediários deformando fotos; sem publicar em produção (uso comercial das capturas pendente); simulação visual nunca apresentada como medição.

## 2. Roteiro do protótipo (desktop; celular e reduced-motion no item 6)

| # | Quadro | Scroll | O que acontece |
|---|---|---|---|
| 1 | Marca | 0 | Fundo preto, logo centralizada (arquivo oficial), entrada breve (≈1,2 s: máscara/opacidade + reflexo diagonal passando uma vez). Botão WhatsApp já visível no canto e no cabeçalho. Sem bloqueio de scroll: rolar antes do fim pula para o quadro 2 |
| 2 | Revelação | 0 → 25 % | Logo encolhe e viaja para o cabeçalho (mesmo elemento, `transform`). Porsche **três quartos** entra com aproximação leve (escala 1,04 → 1,0, do preto). Texto provisório: "Seu carro. Seu estilo. Outro nível de conforto." |
| 3 | Vidros | 25 → 55 % | Texto sai (blur + sobe). Crossfade 3/4 → **lateral** com escala/posição ajustadas para alinhar a altura do carro e a linha do chão entre as duas capturas (ver item 4). Hold curto na lateral |
| 4 | Interação | 55 → 85 % | Lateral estável. Entra "Escolha o tom. Veja a diferença." + seletor de película (range G3–G70 + descrição + aviso legal, mesma lógica do `VltSimulator`). Trocar o tom só troca a camada dos vidros; carro e cenário não mudam. Continuar rolando avança a página; o seletor não é obrigatório |
| 5 | Saída | 85 → 100 % | Palco solta (fim do sticky); gradiente preto conecta ao próximo bloco (hoje: orçamento rápido). Seções seguintes planejadas depois |

Mecânica: seção alta (≈ 400–450 vh) com palco `position: sticky`, progresso `p` em `requestAnimationFrame` (padrão já usado em `VltSimulator`, `HeatFacts`, `ProtectionLevels`), quadros com hold via `sceneCoord` (porta do Lycoris já feita em `ProtectionLevels.astro`). Sem Three.js, sem vídeo.

## 3. Materiais disponíveis (verificado)

- Capturas novas, 1920×1080, em `raw/porsche/captures/`: `frontal.webp`, `tres-quartos.webp`, `lateral.webp` (copiadas dos anexos de 06/11). Fundo claro (muro branco, piso), sem transparência.
- **Frontal = mesma render dos frames do simulador** (`public/media/porsche/frames/frente/g3…g70.webp`): os frames são o recorte 5,4 % / 11,9 % / 89,4 % × 79,6 % da captura (zoom 1,12). Pode ser vista do simulador sem produzir nada.
- **Lateral nova ≠ lateral do simulador** (`frames/lateral-esquerda/*` vieram de `raw/porsche/lateral-esquerda.webp`, outra render, 1672×941). Não existem tons para a lateral nova. Decisão do dono do projeto: **gerar os tons para a lateral nova**.
- **Três quartos:** sem tons; só revelação.
- Logo: `raw/logo-2k.png`, `public/media/logo-512.png`, `raw/cliente/IMG_6304.jpg.jpeg` (fundo preto). Sem vetor.
- Simulador atual (`src/components/VltSimulator.astro`): 4 vistas × 6 tons, range, legal, CTA; CSS em `scenes.css` (`.vlt*`). Fica intacto durante o teste.
- Teste de tingimento pronto para revisão em `raw/porsche/test/`: `mask-lateral.png` (máscara dos 4 vidros: para-brisa visível, porta, quarto traseiro, vidro traseiro; polígonos em `mask-lateral-polys.json`), `lateral-clara-g70.webp`, `lateral-escura-g5.webp`, zooms `*-zoom.jpg`, `comparativo.jpg` (original / clara / escura), `mask-preview.jpg`. Método: máscara geométrica traçada sobre grade de coordenadas, borda suavizada 0,7 px, camada preta `#06080a` com opacidade 0,30 (clara) e 0,92 (escura) só dentro da máscara; carro, cenário, enquadramento e reflexos intactos.

## 4. Integração do cenário claro à identidade escura (proposta)

As capturas têm muro branco e piso claro; a abertura é preta. Sem recorte do carro (não há transparência e não vamos gerar outra Porsche), a proposta é tratar o cenário no palco, por CSS, igual para capturas e frames:
1. **Vinheta forte**: `radial-gradient` preto nas bordas (≈ 35 % de cada lado) e `linear-gradient` preto na base e no topo; o carro fica no "cone de luz".
2. **Escurecer e dessaturar o cenário**: `filter: brightness(.78) saturate(.75) contrast(1.08)` na imagem inteira; o branco do carro continua o ponto mais claro da cena. Opção a testar: `mix-blend-mode: multiply` de um gradiente grafite só na metade superior (muro).
3. **Grão fino e linhas**: ruído SVG a 5 % e uma linha fina verde-lima como horizonte/"chão", para o verde da marca aparecer sem pintar o carro.
4. Se o resultado ainda parecer "foto colada", plano B: pedir ao configurador capturas em fundo escuro (o dono do projeto exporta), mantendo o mesmo carro.
A escolha (1–3 vs plano B) é feita no protótipo, com screenshot lado a lado.

## 5. Arquivos e componentes afetados (quando implementar)

- **Novo** `src/components/Opening.astro`: palco sticky com os 5 quadros, as 2 capturas (3/4 e lateral) + camadas de tom da lateral, textos, seletor (reaproveita a lista `shades`, textos legais e a lógica de crossfade do `VltSimulator`; preferir extrair para `src/data/shades.ts` para não duplicar).
- **Novo** `src/components/BrandIntro` (ou dentro do Opening): logo centralizada → cabeçalho (`transition:persist` do header já existe).
- `src/pages/index.astro`: `<Opening />` no lugar de `<Hero />`; demais seções ficam até decisão por seção.
- `src/components/Header.astro`: logo some durante o quadro 1 e recebe a logo que viaja (classe de estado). Links e WhatsApp inalterados.
- `src/styles/scenes.css`: bloco `.opening*`; bloco do hero antigo sai.
- `src/layouts/Base.astro`: preload da logo e da captura 3/4 (LCP); termômetro lateral desligado neste trecho.
- Assets: `public/media/opening/tres-quartos.webp` (+1280 px), `lateral.webp`, `lateral-g{3,5,20,35,50,70}.webp` (só após aprovação do teste), `logo.svg|png`.
- Não mudam: `VltSimulator.astro`, `BeforeAfter.astro`, dados reais, avaliações, FAQ, contatos, JSON-LD, páginas internas.

## 6. Celular e movimento reduzido

- < 900 px: mesma ordem, sem sticky: logo (1,2 s) → 3/4 em bloco → lateral + seletor em bloco; capturas 16:9 em `object-fit: cover` com foco no carro (`object-position` por vista) ou proporção 4:3 com recorte fixo por imagem (a definir no teste).
- `prefers-reduced-motion`: sem logo animada (aparece pronta), sem crossfades (cortes), seletor funciona igual. Sem JS: tudo visível empilhado.

## 7. O que falta para testar só a sequência inicial

1. **Aprovar o teste de tom** (`raw/porsche/test/`). Se aprovado, gerar G3, G5, G20, G35, G50, G70 com a mesma máscara (opacidades a calibrar comparando com os frames frontais existentes, para o G35 "parecer" o mesmo G35).
2. **Logo em arquivo utilizável**: vetor (SVG) ou PNG ≥ 1000 px com fundo transparente. Hoje só há JPG/PNG com fundo preto (serve para o quadro 1 preto, não para o cabeçalho claro-sobre-escuro com transparência; `logo-hero.webp` funciona via `mix-blend-mode: screen`).
3. **Texto do quadro 2** confirmado ("Seu carro. Seu estilo. Outro nível de conforto." é provisório) e o do quadro 4.
4. **Decisão do tratamento escuro** (item 4) ao ver o primeiro screenshot.
5. **Uso comercial das capturas** segue pendente: só preview, sem produção.
6. Opcional: capturas em fundo escuro do configurador (plano B do item 4).

## 8. Riscos
- Crossfade 3/4 → lateral é entre dois pontos de vista diferentes; mesmo com escala alinhada haverá um "corte suave", não rotação. Aceito pela direção.
- Opacidade uniforme nos vidros não reproduz reflexos internos de película real; é ilustrativo (já é assim nos frames atuais).
- Peso: 2 capturas + 6 tons em 1920 px ≈ 1–1,5 MB; usar 1280 px no celular.
