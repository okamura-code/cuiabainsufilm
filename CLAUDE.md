# Cuiabá Insulfilm — instruções do projeto

Site institucional da loja Cuiabá Insulfilm (Cuiabá-MT). Astro 7 estático, sem framework de UI. Dono do projeto: Marcelo (dev), cliente: a loja.

**Se você é uma sessão nova (ex.: no notebook): leia `docs/handoff-lancamento.md` antes de qualquer coisa.** Ele traz o estado atual e o que falta fazer no lançamento.

## Regras do dono (valem sempre)
- Nunca inventar depoimentos, números, certificações, garantias ou percentuais sem fonte.
- Imagens e vídeos gerados por IA (ex.: vídeo da abertura) nunca são descritos como trabalho da loja.
- Manter todos os links de WhatsApp (`wa.me/5565993401663`).
- O simulador de película (`src/components/VltSimulator.astro`) é o único simulador; não criar outro.
- Credenciais só em variáveis de ambiente; nunca no código nem no chat. Claude não digita senhas nem cria contas: o dono faz login e avisa.
- Originais em `raw/` não são alterados.
- Responder em português, direto e curto.
- Commits terminam com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Como o site é publicado
- GitHub: `okamura-code/cuiabainsufilm`, branch padrão `main`. `site-v8` é mantida igual à `main`.
- Cloudflare Pages ligado ao GitHub: **cada push em `main` publica em produção**. Build `npm run build`, saída `dist`, Node 22 (`.node-version`).
- Endereço do site fica em 3 arquivos e precisa ser igual nos três: `src/data/site.ts` (`url`), `astro.config.mjs` (`site`), `public/robots.txt` (linha `Sitemap:`).

## Gotchas
- Astro escapa `\` dentro de `<script is:inline>`: evitar `\s`, `\d` em regex inline.
- Palco de abertura (`src/components/Stage.astro`) é controlado por rolagem (`draw()`); vídeo da abertura em `public/media/hero/abertura*.mp4`, gerado por `scripts/intro-video.mjs`.
- Dev: `npm install` e `npm run dev` (porta 4321). Para só trocar texto/endereço não precisa rodar nada local: o Cloudflare faz o build.
