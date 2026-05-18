# agendamento-pdp

Página de agendamento de sessão de mentoria individual de 30 minutos com Rodrigo Rosar — bônus exclusivo da Implementação PDP 2026.

## URLs

- **URL provisória (até DNS):** https://metrik-group.github.io/agendamento-pdp/
- **URL final:** https://agendamento.rodrigorosar.com.br (após DNS Cloudflare)

## Stack

- HTML estático puro (clonado byte-a-byte de https://nandamota.github.io/agendamentobonus/)
- Sem build, sem framework
- DM Sans + DM Serif Display via Google Fonts
- JS vanilla que carrega "Dias disponíveis" via Apps Script (reutiliza o da Nanda — já lê o Calendar do Rodrigo)
- GitHub Pages (workflow `.github/workflows/deploy.yml`)

## Origem da página

A página original em `nandamota.github.io/agendamentobonus/` já está totalmente nomeada para Rodrigo Rosar — Nanda só hospedava o GitHub Pages dela. Este repo é um espelho com:

- Foto base64 inline → arquivo local `assets/rodrigo.jpg`
- `<meta name="robots" content="noindex,nofollow">` adicionado (página privada para alunos pagantes)
- Resto idêntico ao original

## Como atualizar a lista de horários disponíveis

A lista de "Horários disponíveis" no site é **estática** (hardcoded no HTML). Google bloqueia iframe do Appointment Schedule, então a opção foi listar manualmente.

Quando os horários/datas mudarem no Calendar do Rodrigo:

1. Abrir `index.html`
2. Localizar bloco `<div class="days-box">` (depois de "Horários disponíveis")
3. Atualizar cada `.day-row` com:
   - `day-name`: dia da semana + data ("Quarta-feira, 20 de maio")
   - `day-date`: lista de horários separados por `·`
   - `day-chip chip-green`: número de vagas
4. Commit + push em `main` — deploy automático em ~1min

Exemplo de atualização:
```html
<div class="day-row">
  <div class="day-info">
    <span class="day-name">Quarta-feira, 20 de maio</span>
    <span class="day-date">07:00 · 07:40 · 08:20 · 09:00 · 09:40 · 10:20 · 11:00</span>
  </div>
  <span class="day-chip chip-green">7 vagas</span>
</div>
```

## Como atualizar o link do Google Calendar

1. Abrir `index.html`
2. Localizar `href="https://calendar.app.google/Qzzgzm5QWbx8rTKh9"`
3. Trocar pela nova URL do Appointment Schedule
4. Commit + push em `main` — deploy automático em ~1min

## Como atualizar a foto

Substituir `assets/rodrigo.jpg` (manter nome e extensão). Commit + push.

## Como ativar o domínio custom

1. **Cloudflare** → DNS de `rodrigorosar.com.br` → adicionar registro:
   - Type: `CNAME`
   - Name: `agendamento`
   - Target: `metrik-group.github.io`
   - Proxy status: **DNS only** (nuvem cinza, NÃO laranja)
   - TTL: Auto

2. Aguardar propagação (~5-30min). Validar com:
   ```powershell
   Resolve-DnsName agendamento.rodrigorosar.com.br -Server 8.8.8.8
   ```

3. Restaurar o `CNAME` no repo:
   ```powershell
   [System.IO.File]::WriteAllText("C:\dev\agendamento-pdp\CNAME", "agendamento.rodrigorosar.com.br", [System.Text.Encoding]::ASCII)
   cd C:\dev\agendamento-pdp
   git add CNAME
   git commit -m "ci: restaura CNAME após DNS Cloudflare ativo"
   git push
   ```

4. Após Pages provisionar Let's Encrypt (~15min), habilitar HTTPS enforce:
   ```powershell
   gh api --method PUT repos/METRIK-GROUP/agendamento-pdp/pages -F https_enforced=true
   ```

## Apps Script (dias disponíveis)

A URL do Apps Script está hardcoded no JS:
```
https://script.google.com/macros/s/AKfycbzzYwGFuOZreKPbylw7iw4y0fgtJ9YVuX40euN1tkDeBHhPwgpe1AS2NG8w2JywkGhv/exec
```

Esse script é o da Nanda Mota mas lê o calendar do Rodrigo. Se algum dia ela desativar, criar Apps Script novo na conta do Rodrigo e trocar a URL.

## Estrutura

```
agendamento-pdp/
├── index.html              # página única
├── assets/
│   └── rodrigo.jpg         # foto perfil 64×64 (real 840×1000)
├── reference/
│   ├── nanda-original.html # snapshot pra referência
│   └── NOTES.md            # notas detalhadas da página original
├── .github/workflows/
│   └── deploy.yml          # deploy Pages
└── README.md
```
