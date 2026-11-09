# Lançamento — roteiro do dia (preparado em 08/11/2026)

Estado: branch `site-v8`, commit `0f779c5`, no GitHub (`okamura-code/cuiabainsufilm`). Preview aprovado: ffeqg4ry4.
Produção da Vercel atual (`cuiaba-insulfilm.vercel.app`, conta okamuraextra-8814) ainda é o site antigo.

## 1. Mostrar ao cliente
Link público: gerado no painel Vercel (deploy ffeqg4ry4 → Share → Anyone with the link). Está na conversa de 08/11; não fica no repo porque o token dá acesso a quem tiver o link.
Mandar o link inteiro (o trecho `?_vercel_share=` é o que libera o acesso).

## 2. Conta do cliente — recomendação: Vercel (não Firebase)
Site é Astro estático, já configurado para Vercel (`.vercel/project.json`, previews por CLI). Firebase Hosting funcionaria, mas exigiria novo fluxo de deploy e não traz vantagem aqui.

1. Cliente cria conta em vercel.com com o e-mail dele (plano Hobby serve; uso comercial em Hobby viola os termos da Vercel → se o cliente é empresa, plano Pro ou conta no nome dele com Pro). Decidir com ele.
2. Cliente conecta o GitHub dele OU o dev adiciona o cliente como colaborador no repo `okamura-code/cuiabainsufilm` e a Vercel importa o repo (Add New → Project → Import).
3. Framework: Astro (detectado). Branch de produção: `main`. Antes, fazer merge de `site-v8` em `main` e push (ver §4).
4. Deploy inicial sai em `<nome>.vercel.app`. Conferir abertura, simulador, WhatsApp, mapa.

## 3. Domínio
- `.com.br`: comprar em registro.br (CPF/CNPJ do cliente, ~R$ 40/ano). `.com`: pode comprar na própria Vercel (Domains) ou em qualquer registrador.
- Na Vercel: Project → Settings → Domains → adicionar `dominio.com.br` e `www.dominio.com.br` (um redireciona para o outro; escolher o sem www como principal).
- DNS no registro.br: registro `A` @ → `76.76.21.21` e `CNAME` www → `cname.vercel-dns.com` (a Vercel mostra os valores exatos na tela do domínio). Propagação: minutos a algumas horas. HTTPS automático.

## 4. Trocar o domínio no código (3 lugares) e publicar
```bash
# substituir https://cuiaba-insulfilm.vercel.app pelo domínio final
grep -rn "cuiaba-insulfilm.vercel.app" src/data/site.ts astro.config.mjs public/robots.txt
```
Arquivos: `src/data/site.ts` (`url`, usado em canonical, OG e JSON-LD), `astro.config.mjs` (`site`, usado pelo sitemap), `public/robots.txt` (linha `Sitemap:`).
Depois: commit, `git checkout main && git merge site-v8 && git push`. A Vercel do cliente publica sozinha a partir de `main`.
Conferir no ar: `/robots.txt`, `/sitemap-index.xml`, canonical na home, imagem OG no compartilhamento do WhatsApp.

## 5. Google Search Console
1. search.google.com/search-console → Adicionar propriedade → tipo **Domínio** (`dominio.com.br`).
2. Verificar por registro DNS `TXT` no registro.br (valor que o Google mostra). Se o DNS ainda não propagou, verificar mais tarde no mesmo dia.
3. Sitemaps → enviar `https://dominio.com.br/sitemap-index.xml`.
4. Inspeção de URL na home → "Solicitar indexação".
5. Opcional no mesmo dia: Perfil da Empresa no Google (já existe, 31 avaliações) → adicionar o site no perfil.

## 6. Depois de publicar
- Testar no celular do cliente (Safari real): abertura, rolagem, simulador, botões de WhatsApp.
- Vercel antiga (okamuraextra-8814): deixar como backup por uma semana, depois apagar o projeto para não concorrer no Google (ou apontar redirect).
- Pendências antigas do dono continuam: uso comercial das capturas de vídeo, áudio dos vídeos, pino do mapa, linha Window Blue aplicada, tonalidades Premium.
