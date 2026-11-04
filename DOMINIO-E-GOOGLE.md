# Domínio próprio e Google Search Console

Tempo total: 30 a 60 minutos de trabalho, mais algumas horas de propagação.

## Parte 1. Comprar o domínio (registro.br)

Quem faz: o dono da loja (ou você com o CPF/CNPJ dele). O domínio deve ficar no nome do cliente.

1. Acesse https://registro.br e pesquise o nome desejado. Sugestões, em ordem: `cuiabainsulfilm.com.br`, `cuiabainsulfilmsom.com.br`, `insulfilmcuiaba.com.br`.
2. Clique em "Registrar" no nome livre.
3. Crie uma conta no registro.br com CPF ou CNPJ, e-mail e telefone do dono. O e-mail recebe a confirmação e os avisos de renovação.
4. Escolha 1 ano (cerca de R$ 40) ou mais. Pague por PIX, boleto ou cartão.
5. O domínio fica ativo em alguns minutos após a confirmação do pagamento.

Dica: anote o login do registro.br em lugar seguro. Sem ele não dá para renovar nem mudar o DNS.

## Parte 2. Ligar o domínio ao site (Vercel)

Quem faz: você, na conta do Vercel. Leva 5 minutos, mais a propagação.

1. Entre em https://vercel.com e abra o projeto `cuiaba-insulfilm`.
2. Menu "Settings", depois "Domains".
3. Digite o domínio (ex.: `cuiabainsulfilm.com.br`) e clique em "Add". Quando perguntar, escolha a opção que redireciona `www` para o domínio principal.
4. O Vercel mostra os registros de DNS que precisa. Normalmente:
   - Tipo `A`, nome `@` (ou vazio), valor `76.76.21.21`
   - Tipo `CNAME`, nome `www`, valor `cname.vercel-dns.com`
   Use exatamente os valores que a tela mostrar.
5. Volte ao registro.br, abra o domínio, menu "DNS", opção "Editar zona" (ou "Configurar endereçamento"). Adicione os dois registros acima e salve.
6. Volte ao Vercel. Em alguns minutos a algumas horas o status muda para "Valid Configuration". O certificado HTTPS é gerado sozinho.
7. Teste no celular e no computador: `https://cuiabainsulfilm.com.br` deve abrir o site; `cuiaba-insulfilm.vercel.app` passa a redirecionar para ele.

## Parte 3. Atualizar o código (eu faço)

Depois que o domínio abrir:

1. Trocar `site.url` em `astro.config.mjs`, `src/data/site.ts` e `public/robots.txt` para o domínio novo.
2. Republicar com `npx vercel --prod --yes`.
3. Isso corrige canonical, sitemap, dados estruturados e a prévia do WhatsApp.

## Parte 4. Google Search Console

Quem faz: o dono (conta Google dele, a mesma do Perfil da Empresa) ou você com acesso.

1. Acesse https://search.google.com/search-console e entre com a conta Google.
2. Clique em "Adicionar propriedade". Escolha o tipo "Domínio" e digite `cuiabainsulfilm.com.br` (sem https, sem www). Esse tipo cobre www e sem www de uma vez.
3. O Google mostra um registro `TXT` para verificação, algo como `google-site-verification=abc123...`. Copie.
4. No registro.br, menu "DNS" do domínio, adicione um registro tipo `TXT`, nome `@` (ou vazio), valor colado. Salve.
5. Volte ao Search Console e clique em "Verificar". Se falhar, espere 30 minutos e tente de novo (propagação).
6. Com a propriedade verificada, menu "Sitemaps" na lateral. Digite `sitemap-index.xml` e clique em "Enviar".
7. Menu "Inspeção de URL": cole `https://cuiabainsulfilm.com.br/` e clique em "Solicitar indexação". Repita para `/servicos/`, `/sobre/`, `/galeria/`, `/contato/`.

Alternativa sem mexer no DNS: tipo de propriedade "Prefixo do URL" com `https://cuiabainsulfilm.com.br/` e verificação por "Tag HTML". Nesse caso me mande a tag que eu coloco no código e republico.

## Parte 5. Perfil da Empresa no Google

1. O dono entra em https://business.google.com com a conta que administra "Cuiabá insulfilm som e acessórios".
2. "Editar perfil", campo "Site", colar `https://cuiabainsulfilm.com.br`. Salvar.
3. Opcional: em "Produtos" ou "Serviços", cadastrar película, PPF, som, com link para a página de serviços.

## Prazo esperado

- Domínio no ar: mesmo dia.
- Search Console verificado: mesmo dia.
- Site aparecendo na busca pelo nome da loja: 2 a 14 dias.
- Posição para "insulfilm cuiabá": semanas a meses; depende de avaliações, fotos no perfil do Google e tempo.

## O que me mandar quando terminar

- O domínio registrado.
- Print do Vercel com "Valid Configuration".
- Acesso ao Search Console (ou a tag HTML de verificação), se quiser que eu acompanhe a indexação.
