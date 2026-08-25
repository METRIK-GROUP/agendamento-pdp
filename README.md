# agendamento-pdp

Página de agendamento da sessão de mentoria individual (25 min, Google Meet) com Rodrigo Rosar — bônus da Implementação Projeto de Primeira.

## URLs

- **No ar:** https://agendamento.rodrigorosar.com.br (GitHub Pages; o endereço antigo metrik-group.github.io/agendamento-pdp/ redireciona para cá)
- **DNS:** CNAME `agendamento` → `metrik-group.github.io` no Cloudflare (DNS only). Domínio configurado no Pages via API (deploy por Actions não lê o arquivo CNAME).

## Como funciona (arquitetura)

Uma única página HTML estática. Toda a lógica de agendamento é do **Google Agenda (Appointment Schedule)**, embutido na página via `<iframe>`:

```
Aluno abre o site
  → vê o calendário do Google embutido (horários livres em tempo real)
  → escolhe dia/horário, preenche nome e e-mail
  → Google cria o evento na agenda do Rodrigo, gera o link do Meet e envia a confirmação por e-mail
```

- Sem backend, sem build, sem framework, sem Apps Script.
- Fonte da verdade dos horários = a página de agendamento **"Bônus 10 Primeiros — Mentoria 1x1"** no Google Agenda do Rodrigo (criada em 25/08/2026; link curto `https://calendar.app.google/NseJ6DW8mKsRS4vV7`). A página antiga "Bônus 10 Primeiros" ficou em outra conta Google e foi abandonada.
- O site nunca mostra datas hardcoded: o que o Rodrigo abre na agenda aparece na hora.

## Manutenção

### Abrir/fechar horários (Rodrigo, ~3 min)

1. Google Agenda (conta do Rodrigo) → barra lateral **Páginas de agendamento de horário** → "Bônus 10 Primeiros — Mentoria 1x1" → editar.
2. Em **Disponibilidade geral**, definir os dias/horários da nova turma (ex.: quartas 07:00–11:30) e, em **Período de agendamento**, a data de início e fim.
3. Salvar. O site atualiza sozinho — nada a fazer no código.
4. Para bloquear um dia específico: adicionar exceção em "Datas de disponibilidade ajustada" no mesmo painel.

Se aparecer "Sem disponibilidade durante esses dias" / "Nenhum horário disponível no próximo ano" na página, é porque o período da agenda expirou ou não há janela aberta — repetir o passo 2.

### Trocar a agenda (link)

Se o Rodrigo criar um novo Appointment Schedule:

1. No Google Agenda, abrir a agenda → **Compartilhar** → copiar o **link** (formato `https://calendar.app.google/XXXX`). Abrir esse link no navegador e copiar também a URL longa da página de reserva (`https://calendar.google.com/calendar/appointments/schedules/AcZ...`).
2. Em `index.html`, trocar:
   - o `src` do `<iframe>` → URL longa + `?gv=true` no final
   - o `href` de "Abrir a agenda em nova aba" → link curto
3. Commit + push em `main` → deploy automático em ~1 min.

### Trocar a foto

Substituir `assets/rodrigo-160.jpg` e `assets/rodrigo-160.webp` (160×160, quadrado, rosto centralizado no topo). Commit + push.

### Imagem de preview (WhatsApp/redes)

`assets/og.jpg` (1200×630). Referenciada no `<meta property="og:image">`.

## Domínio (feito em 25/08/2026)

- Cloudflare: CNAME `agendamento` → `metrik-group.github.io`, proxy desligado (DNS only).
- GitHub Pages: como o deploy é por Actions, o arquivo `CNAME` do repo **não** é lido. O domínio foi definido via API: `gh api --method PUT repos/METRIK-GROUP/agendamento-pdp/pages -f cname=agendamento.rodrigorosar.com.br` (conta com admin no repo) e depois `-F https_enforced=true` quando o certificado ficou `approved`.
- `canonical`, `og:url` e `og:image` no `index.html` apontam para o domínio final.

## Stack

- HTML + CSS puros; fontes Maven Pro (títulos, labels, botões), Inter (corpo) e DM Serif Display (frase editorial), via Google Fonts. Visual no padrão do site da Implementação (hero escuro, paleta METRIK monocromática, sem sombras).
- `noindex,nofollow` + `robots.txt` bloqueando tudo: página privada para alunos.
- GitHub Pages via `.github/workflows/deploy.yml` (push em `main` publica).

## Histórico

- `apps-script/` — versão antiga com Apps Script (lista de slots + reserva própria). Abandonada em 25/08/2026: o widget oficial do Google resolve tudo sem depender de deploy na conta do Rodrigo. Mantido só como referência.
- `reference/` — snapshot da página original hospedada pela Nanda (`nandamota.github.io/agendamentobonus`) e notas de paleta/copy.
