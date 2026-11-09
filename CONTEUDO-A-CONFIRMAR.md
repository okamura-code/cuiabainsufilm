# Conteúdo do site — status (atualizado 2026-10-09 com respostas do proprietário)

## Confirmado pelo proprietário
- Nome: Cuiabá Insulfilm Som e Acessórios (logo oficial: preto + verde-limão, "insulfilm" em script)
- Marca de película: Window Blue, revenda autorizada; todas as tonalidades; garantia vitalícia com certificado
- Carro-chefe: película térmica, PPF e som. Só automotivo (sem residencial/comercial)
- Diferenciais: técnica, garantia, revenda autorizada, atendimento personalizado e exclusivo; vários aplicadores (sem fotos por enquanto)
- Agendamento obrigatório; aplicação leva meio período; atende a domicílio; Cuiabá e região; B2C, todo tipo de carro
- Preço só por orçamento; aceita PIX, dinheiro, cartão, parcelamento
- Contato só por WhatsApp (65) 99340-1663, qualquer funcionário responde 8h–18h
- Horário: seg–sex 8h–18h, sáb 8h–12h, domingo fechado
- Avaliações do Google autorizadas; imagens por IA autorizadas, sem rótulo
- Tom: descontraído, inovador, com credibilidade. Cores: logo + produtos
- Sem blog, sem Google Analytics; dono administra o perfil Google

## Pendente
- ~~Domínio~~: `cuiabainsulfilm.com.br` registrado pelo cliente em 09/11/2026 (Registro.br), DNS na Cloudflare dele.
- Logo em vetor (SVG/PDF): hoje o site usa um wordmark em HTML/CSS que imita a logo. Trocar pelo arquivo oficial.
- Fotos e vídeos reais em alta resolução (existem, placas cobertas): enviar para substituir as imagens geradas em `public/media/`.
- História da loja (fundação): dono não sabe. Página Sobre ficou sem data.
- Certificações/treinamentos: dono disse "sim" sem detalhar. Se houver certificado Window Blue de aplicador, vale foto.
- Endereço e CEP: confirmados pelo Google; conferir se o CEP 78015-100 bate com o cadastro.
- Grafia: o proprietário escreveu "insufilme"; o site segue a logo ("insulfilm"). Confirmar.

## Simulador de tonalidade (Porsche 911)
- Fotos de divulgação da Porsche enviadas pelo usuário (`raw/porsche/`), com logo e nome do carro visíveis. Para o site em produção, confirmar direito de uso ou trocar por foto de carro do cliente (o script `scripts/masks.mjs` gera as máscaras de vidro para qualquer foto: basta ajustar o polígono).

## Técnico (antes de publicar em produção)
- Trocar `build.format: 'file'` por `'directory'` e links `x.html` por `/x/` no deploy final (hoje relativo para funcionar como preview/Artifact).
- Formulário envia para WhatsApp (sem e-mail), conforme pedido do cliente.
- Vídeo do hero: adiado (2026-10-09). Opções com custo verificado no conector Higgsfield: Cinema Studio 4.0 8 s/720p = 56 créditos; 5 s sem áudio = 35; Kling 3.0 5 s = 10; crossfade CSS dos frames G70→G5 = 0. Saldo na data: 202,56 créditos. Base preferida: foto real da loja.
- Deploy: Vercel (`npx vercel`), após registrar domínio.

## Prévia do redesign (branch `redesign-v2`, rota `preview.html`)
- Pendente: fotos e vídeos reais da loja (galeria e processo usam imagens ilustrativas de IA, sinalizadas; sem vídeos não há botões de reprodução).
- Pendente: cenários de iluminação do simulador (sol/fim de tarde/noite) só com fotos geradas por cenário; não implementado.
- Pendente: comparador usa Porsche de divulgação (original × G5 sobre a mesma foto); trocar pela foto de um carro do cliente.
- Pendente: nomes reais dos avaliadores (hoje "Cliente no Google"), se o dono autorizar.
