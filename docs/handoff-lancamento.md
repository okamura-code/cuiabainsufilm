# Handoff — lançamento do site (escrito em 09/11/2026)

Contexto para continuar em outra máquina (notebook) ou em uma sessão nova do Claude. Guia passo a passo com fontes oficiais: `docs/guia-lancamento.pdf` (também `.html`).

## Onde estamos
- Site aprovado pelo dono. Código em `okamura-code/cuiabainsufilm`, branch `main`.
- **Demonstração no ar:** https://cuiaba-insulfilm.pages.dev — Cloudflare Pages na conta pessoal do dev (`okamuraextra@gmail.com`). **Essa conta é só para demonstração ao cliente.**
- Vercel antiga (`cuiaba-insulfilm.vercel.app`, conta okamuraextra-8814) ainda mostra o site velho.
- O endereço no código hoje é `https://cuiaba-insulfilm.pages.dev` (3 arquivos, ver CLAUDE.md).

## Decisões já tomadas (não rediscutir)
- Hospedagem definitiva: **Cloudflare Pages, plano Free, em conta nova do cliente** (e-mail dele).
- Domínio: **`.com.br` no Registro.br**, em nome do cliente (CPF ou CNPJ dele), pago por ele (R$ 40/ano, Pix).
- DNS do domínio vai para a Cloudflare do cliente (troca de servidores DNS no Registro.br).
- Sem versão vertical 9:16 do vídeo da abertura (dono viu no celular e dispensou).
- Nome a tentar primeiro: `cuiabainsulfilm.com.br`.

## O que falta, em ordem (dia do lançamento, na loja)
Quem faz: **C** = cliente/dev no navegador (logins e pagamentos), **IA** = Claude pode fazer.

1. **C** — Mostrar o site ao cliente: https://cuiaba-insulfilm.pages.dev
2. **C** — Registro.br: criar conta do cliente, registrar o domínio deixando os DNS do próprio Registro.br, pagar por Pix. Cadastrar o dev como contato técnico.
3. **C** — Cloudflare: criar a conta do cliente (dash.cloudflare.com → Sign up, e-mail dele, Free).
4. **C** — Na conta Cloudflare do cliente: Domains → Onboard a domain → domínio → Free → copiar os 2 servidores DNS.
5. **C** — Registro.br: tela do domínio → trocar os servidores DNS pelos 2 da Cloudflare. Esperar a zona ficar **Active** (minutos a poucas horas).
6. **C** (IA pode guiar pelo navegador depois do login) — Na conta Cloudflare do cliente: Workers & Pages → Create → Pages → Import an existing Git repository → Connect GitHub (conta `okamura-code`, só o repo `cuiabainsufilm`; o GitHub pede confirmação no celular) → Project name `cuiaba-insulfilm` (se o nome estiver ocupado pela conta demo, usar `cuiabainsulfilm`) → branch `main` → build `npm run build` → output `dist` → Save and Deploy.
7. **C/IA** — No projeto Pages do cliente: Custom domains → adicionar `dominio.com.br` e `www.dominio.com.br`.
8. **IA** — Trocar `https://cuiaba-insulfilm.pages.dev` pelo domínio final nos 3 arquivos (`src/data/site.ts`, `astro.config.mjs`, `public/robots.txt`), commit e push em `main`; depois `git branch -f site-v8 main && git push origin site-v8`. Sem Claude: editar os 3 pelo lápis do GitHub, direto na `main`.
9. **IA** — Conferir no domínio: home 200, `/robots.txt`, `/sitemap-index.xml`, `og:image` apontando para o domínio, vídeo da abertura, links de WhatsApp.
10. **C** — Search Console (conta Google do cliente): propriedade tipo Domínio → registro TXT na zona DNS da Cloudflare do cliente → Verificar → Sitemaps: `https://dominio.com.br/sitemap-index.xml` → Inspeção de URL da home → Solicitar indexação. Não apagar o TXT.
11. **C** — Perfil da Empresa no Google: Editar perfil → Site = `https://dominio.com.br`; conferir telefone (65) 99340-1663, horário, categoria.
12. **C** — Limpeza depois de tudo funcionando: apagar o projeto Pages da conta demo (`okamuraextra`) e o projeto antigo da Vercel, para não duplicar no Google. O app "Cloudflare Workers and Pages" no GitHub fica ligado à conta do cliente.

## Como continuar no notebook
Opção sem instalar nada: tudo acima é navegador; o passo 8 pode ser feito pelo lápis do GitHub.

Opção com Claude Code no notebook:
```bash
git clone https://github.com/okamura-code/cuiabainsufilm.git
cd cuiabainsufilm
```
Abrir o Claude Code nessa pasta (ele lê o `CLAUDE.md` sozinho) e mandar:
> Leia docs/handoff-lancamento.md. O domínio registrado é `______.com.br`. Faça o passo 8 e o 9.

Para rodar o site local (opcional): Node 22+, `npm install`, `npm run dev`.
Login do git no notebook: o push pede login do GitHub pelo navegador (Git Credential Manager) na primeira vez.

## O que o Claude não faz
Não digita senhas, não cria contas, não paga, não aceita termos nem autoriza apps OAuth. O dono faz login/aprovação e avisa "logado"/"autorizado"; daí o Claude segue pelo navegador ou pelo terminal.

## Pendências antigas do dono (não bloqueiam o lançamento)
Uso comercial das capturas de vídeo da garagem; áudio dos vídeos; confirmar o pino do mapa; linha Window Blue aplicada; tonalidades Premium; teste em iPhone real (Safari).
