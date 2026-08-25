# agendamento-pdp

Página de agendamento da sessão de mentoria individual (30 min, Google Meet) com Rodrigo Rosar — bônus da Implementação Projeto de Primeira.

## URLs

- **No ar (GitHub Pages):** https://metrik-group.github.io/agendamento-pdp/
- **Domínio final (depende de DNS):** https://agendamento.rodrigorosar.com.br — ver seção "Ativar o domínio".

## Como funciona (arquitetura)

Uma única página HTML estática. Toda a lógica de agendamento é do **Google Agenda (Appointment Schedule)**, embutido na página via `<iframe>`:

```
Aluno abre o site
  → vê o calendário do Google embutido (horários livres em tempo real)
  → escolhe dia/horário, preenche nome e e-mail
  → Google cria o evento na agenda do Rodrigo, gera o link do Meet e envia a confirmação por e-mail
```

- Sem backend, sem build, sem framework, sem Apps Script.
- Fonte da verdade dos horários = a agenda "Bônus 10 Primeiros" no Google Agenda da conta **rodrigo@rodrigorosar.com.br** (calendário "MENTOR | Rodrigo Rosar").
- O site nunca mostra datas hardcoded: o que o Rodrigo abre na agenda aparece na hora.

## Manutenção

### Abrir/fechar horários (Rodrigo, ~3 min)

1. Google Agenda (conta `rodrigo@rodrigorosar.com.br`) → clicar na agenda "Bônus 10 Primeiros" (ou Configurações → **Agendamento de horários**) → editar.
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

## Ativar o domínio `agendamento.rodrigorosar.com.br`

O DNS de `rodrigorosar.com.br` está no Cloudflare (mesmo padrão de `implementacao.` e `links.`).

1. Cloudflare → DNS → **Add record**: tipo `CNAME`, nome `agendamento`, destino `metrik-group.github.io`, proxy **desligado** (nuvem cinza / "DNS only"), TTL Auto.
2. No repo, criar o arquivo `CNAME` na raiz com o conteúdo `agendamento.rodrigorosar.com.br` (sem quebra de linha extra) e fazer push.
3. GitHub → Settings → Pages → confirmar o domínio e marcar **Enforce HTTPS** (o certificado leva ~15 min).
4. Em `index.html`, trocar `https://metrik-group.github.io/agendamento-pdp/` por `https://agendamento.rodrigorosar.com.br/` nas tags `canonical`, `og:url` e `og:image`.

## Stack

- HTML + CSS puros; fontes DM Sans + DM Serif Display (Google Fonts).
- `noindex,nofollow` + `robots.txt` bloqueando tudo: página privada para alunos.
- GitHub Pages via `.github/workflows/deploy.yml` (push em `main` publica).

## Histórico

- `apps-script/` — versão antiga com Apps Script (lista de slots + reserva própria). Abandonada em 25/08/2026: o widget oficial do Google resolve tudo sem depender de deploy na conta do Rodrigo. Mantido só como referência.
- `reference/` — snapshot da página original hospedada pela Nanda (`nandamota.github.io/agendamentobonus`) e notas de paleta/copy.
