# Cuiabá Insulfilm v5 — "Cinema e peso": hero 3D, intro, cenas de scroll

Branch de trabalho: `redesign-v5-3d` (a partir de `redesign-v4-fotos`). Estado anterior fica na tag `v4-fotos`.

## Direção (personalidade do autor)
Cinema e peso: escuro, tipografia gigante, cenas que param na tela. Sem crédito visível. Sem números inventados.

## 1. Hero 3D (substitui os 75 frames)
- `Hero.astro`: `.hero__media` ganha `<canvas class="hero__3d">`; `<picture>` atual vira poster e fica atrás até o modelo carregar; canvas entra com fade. `public/media/cine/` e `scripts/cine-frames.sh` saem.
- `src/scripts/hero3d.ts`: `import('three')` dinâmico após `load`. Modelo SUV low-poly CC0 em `public/3d/car.glb` (Draco, ≤ 1,5 MB); licença e origem em `public/3d/LICENSE.txt`.
- Cena: chão escuro com reflexo leve; `DirectionalLight` "sol" gira de zênite a horizonte com `p`, cor branco→laranja; `HemisphereLight`; vidro `MeshPhysicalMaterial` com `transmission`, cor/opacidade de claro (G70) a escuro (G5) com `p`.
- `p` = progresso do hero (350vh sticky, já existe). Controla sol, vidro, câmera (~35° de órbita) e véu de calor CSS.
- Desktop: parallax leve da câmera com o mouse. Mobile: arrasto horizontal gira o carro; `pixelRatio` 1, sem sombras.
- Travas: `prefers-reduced-motion` ou sem WebGL → poster estático; erro de carga → poster.

## 2. Intro termômetro
- `Intro.astro` só na home, overlay fixo `--ink`, primeira visita por sessão (`sessionStorage.intro`).
- Número mono gigante conta `28°`→`41°` em 1,6 s (só o grau sobe; sem afirmar recorde). Label `CUIABÁ–MT · AGORA LÁ FORA`, logo lime, `--heat` subindo do rodapé.
- Sai em 2 s, clique, toque ou tecla; botão `PULAR` em mono. Saída = cortina sobe. Overlay só CSS/JS inline, sem imagem (LCP inalterado).
- Reduced-motion: não renderiza.

## 3. Raio-X do vidro (#calor, 3 atos)
- `HeatFacts.astro` vira cena 300vh pinada no desktop (trava padrão). SVG em corte: vidro, banco, raios vindo da direita.
- Ato 1 (p 0–.33): raios atravessam, banco esquenta (gradiente). Ato 2 (.33–.66): película desliza sobre o vidro (faixa lime). Ato 3 (.66–1): raios rebatem, banco esfria, contadores verificados animam.
- Três linhas de texto trocam por ato com a máscara `.line` existente.
- Mobile: 3 quadros estáticos empilhados.

## 4. Termômetro lateral
- `Base.astro`: `<div class="thermo">` fixo à direita, desktop ≥ 1100px. Preenchimento = `scrollY / (scrollHeight − innerHeight)`, cor `--heat`→`--lime`. Label mono com a seção atual (IO existente). Some no finale. Inexistente no mobile e em reduced-motion.

## 5. Antes/depois automático e line-up dos níveis
- `BeforeAfter.astro`: ao entrar 60% na tela, `--pos` anima 0→100→50 em 2,4 s uma vez; qualquer pointerdown cancela. Script atual intacto.
- `ProtectionLevels.astro` desktop: palco único 400vh sticky; foto à direita com crossfade por faixa de `p`, índice `01/04` gigante e título à esquerda. Mobile: lista atual.

## 6. Orçamento e verificação
- Three.js + modelo ≤ 1,5 MB gzip, só após `load`. Lighthouse desktop ≥ 95, mobile ≥ 85.
- Verificar: WebGL desligado → poster; reduced-motion → nada anima; teclado passa pela intro; toque gira no celular; Lenis + scroll do hero no Chrome real.
- Trava padrão de pin: `(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)`.

## Emenda (2026-11-05, após ver o hero 3D no preview)
O SUV low-poly sobre a foto real parecia brinquedo. Decisão do autor: o hero mantém o scroll-cinema de 75 frames (v4). O carro 3D (Kenney, já em `public/3d/car.glb`) passa a viver no **Raio-X do vidro (#calor)**, onde o estilo diagrama combina: o carro em corte/vista lateral, raios do sol atravessando o vidro, película (escurecimento por shader) entrando no ato 2. Seção 1 original fica cancelada; a seção 3 absorve o 3D. Mobile: o raio-X 3D também roda leve (pixelRatio 1, sem sombras); sem WebGL ou reduced-motion → os 3 quadros estáticos em SVG do plano original.
