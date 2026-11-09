# Lançamento — roteiro do dia (preparado em 08/11/2026)

Estado: branch `site-v8`, commit `0f779c5`, no GitHub (`okamura-code/cuiabainsufilm`). Preview aprovado: ffeqg4ry4.
No ar desde 09/11/2026: https://cuiaba-insulfilm.pages.dev (Cloudflare Pages, conta okamuraextra, ligado ao GitHub, branch `main`). Vercel antiga (`cuiaba-insulfilm.vercel.app`) ainda mostra o site velho. Falta domínio no registro.br.

## 1. Mostrar ao cliente
Link público: gerado no painel Vercel (deploy ffeqg4ry4 → Share → Anyone with the link). Está na conversa de 08/11; não fica no repo porque o token dá acesso a quem tiver o link.
Mandar o link inteiro (o trecho `?_vercel_share=` é o que libera o acesso).

## 2. Hospedagem — decisão: Cloudflare Pages (grátis, uso comercial permitido)
Vercel Hobby proíbe uso comercial; Cloudflare Pages não tem essa cláusula. Site é Astro estático: build `npm run build`, saída `dist`. `.node-version` = 22 (Astro 7 exige ≥ 22.12) já está no repo.

1. Cliente cria conta em dash.cloudflare.com com o e-mail dele (plano Free).
2. Workers & Pages → Create → Pages → Connect to Git → autorizar o GitHub (o dev adiciona o cliente como colaborador em `okamura-code/cuiabainsufilm`, ou o cliente faz fork/transfer do repo).
3. Configuração: branch de produção `main`; framework preset **Astro**; build command `npm run build`; output `dist`. Nada de variável de ambiente.
4. Primeiro deploy sai em `<projeto>.pages.dev`. Conferir abertura (vídeo), simulador, WhatsApp, mapa, `/robots.txt`, `/sitemap-index.xml`.
5. Cada push em `main` publica em produção; outras branches geram preview `<hash>.<projeto>.pages.dev`.

## 3. Domínio
- `.com.br` em registro.br, no CPF/CNPJ do cliente (~R$ 40/ano). Conta e pagamento no nome dele.
- Dois caminhos de DNS:
  - **Recomendado**: adicionar o domínio na Cloudflare (Add a site → Free) e, no registro.br, trocar os servidores DNS para os dois que a Cloudflare indicar (`xxx.ns.cloudflare.com`). Depois, no projeto Pages → Custom domains → adicionar `dominio.com.br` e `www.dominio.com.br` (a Cloudflare cria os registros sozinha). Ganha CDN, HTTPS e redirect www automáticos.
  - Alternativa sem mover DNS: no registro.br criar `CNAME www → <projeto>.pages.dev`; o apex (`dominio.com.br`) não aceita CNAME no registro.br, então o domínio sem www não funcionaria. Por isso o caminho recomendado é o de cima.
- Propagação de troca de servidores DNS: até 24 h, normalmente 1–2 h. HTTPS automático quando o domínio ativar.

## 4. Trocar o domínio no código (3 lugares) e publicar
```bash
# substituir https://cuiaba-insulfilm.vercel.app pelo domínio final
grep -rn "cuiaba-insulfilm.vercel.app" src/data/site.ts astro.config.mjs public/robots.txt
```
Arquivos: `src/data/site.ts` (`url`, usado em canonical, OG e JSON-LD), `astro.config.mjs` (`site`, usado pelo sitemap), `public/robots.txt` (linha `Sitemap:`).
Depois: commit e push em `main` (já é a branch padrão; `site-v8` está igual). O Cloudflare Pages publica sozinho.
Conferir no ar: `/robots.txt`, `/sitemap-index.xml`, canonical na home, imagem OG no compartilhamento do WhatsApp.

## 5. Google Search Console
1. search.google.com/search-console → Adicionar propriedade → tipo **Domínio** (`dominio.com.br`).
2. Verificar por registro DNS `TXT` no registro.br (valor que o Google mostra). Se o DNS ainda não propagou, verificar mais tarde no mesmo dia.
3. Sitemaps → enviar `https://dominio.com.br/sitemap-index.xml`.
4. Inspeção de URL na home → "Solicitar indexação".
5. Opcional no mesmo dia: Perfil da Empresa no Google (já existe, 31 avaliações) → adicionar o site no perfil.

## 6. Depois de publicar
- Testar no celular do cliente (Safari real): abertura, rolagem, simulador, botões de WhatsApp.
- Vercel antiga (okamuraextra-8814, `cuiaba-insulfilm.vercel.app`): deixar como backup por uma semana, depois apagar o projeto para não concorrer no Google.
- Search Console: também dá para verificar o domínio por TXT direto na zona DNS da Cloudflare (mais rápido que no registro.br).
- Pendências antigas do dono continuam: uso comercial das capturas de vídeo, áudio dos vídeos, pino do mapa, linha Window Blue aplicada, tonalidades Premium.
