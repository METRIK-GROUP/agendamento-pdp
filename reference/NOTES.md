# Snapshot — Página de Agendamento (referência Nanda)

Fonte original: https://nandamota.github.io/agendamentobonus/
Snapshot em: `reference/nanda-original.html`
Tamanho do HTML original: 23.518 bytes

> Observação importante: o título do `<head>` é `Agendar Mentoria · Rodrigo Rosar` e a foto incorporada (base64) parece ser do Rodrigo. A "Nanda" é só o dono do repositório GitHub Pages, não aparece em lugar nenhum no conteúdo visível. A página inteira já está nomeada para Rodrigo Rosar — vamos só clonar e trocar URL do calendário/WhatsApp se necessário.

---

## Fontes

Duas famílias do Google Fonts via um único `<link>`:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Serif+Display&display=swap" rel="stylesheet">
```

- **DM Sans** (300, 400, 500, italic 300) — usada no body (texto corrido, labels, botões)
- **DM Serif Display** (peso único) — usada nos títulos: nome do mentor, H1, e nenhum outro lugar

Aplicação:
- `body { font-family: 'DM Sans', sans-serif; }`
- `.mentor-name`, `h1` → `font-family: 'DM Serif Display', serif;`

---

## Paleta de cores

Definida via CSS custom properties no `:root`:

```css
:root {
  --bg:      #faf9f6;   /* fundo da página (off-white quente) */
  --surface: #ffffff;   /* fundo dos cards/superfícies */
  --border:  #e6e4dc;   /* bordas/divisores (cinza-bege claro) */
  --text:    #171613;   /* texto principal (quase preto, levemente quente) */
  --muted:   #7a786e;   /* texto secundário (cinza-bege médio) */
}
```

### Cores especiais (não usam CSS vars, hardcoded)

**Botão CTA primário:**
- Background: `var(--text)` → `#171613`
- Hover: `#333`
- Texto: `#ffffff`

**Caixa de regras de cancelamento (vermelho suave):**
- Border: `#f5c5c5`
- Background: `#fff5f5`
- Título: `#c00`
- Texto: `#b00`

**Caixa "Google Meet" / info azul (`.meet-box`, definida mas NÃO usada no HTML final):**
- Border: `#daeaf5`
- Background: `#f3f8fd`
- Título: `#1a5276`
- Texto: `#1a4a6b`

**Chips de disponibilidade de dias:**
- `chip-green` (3+ vagas): bg `#eaf5ee`, texto `#1a6335`, border `#b8e0c5`
- `chip-amber` (1-2 vagas): bg `#fdf3e0`, texto `#7a4f00`, border `#f5dfa0`
- `chip-gray` (sem vagas): bg `var(--bg)`, texto `var(--muted)`, border `var(--border)`

**WhatsApp (footer):**
- Cor link/ícone: `#25D366` (verde oficial WhatsApp)

---

## Tamanhos e espaçamentos

### Layout geral
- Container `.hero` e `.content`: `max-width: 640px; margin: 0 auto;`
- Top bar: altura `48px`, padding lateral `2rem`
- Hero: padding `3.5rem 2rem 0`
- Content: padding `2rem 2rem 4rem`
- Footer: padding `1.75rem 2rem`

### Foto do mentor
- `width: 64px; height: 64px;`
- `border-radius: 50%;` (circular)
- `border: 2px solid var(--border);`
- `object-fit: cover;`
- `object-position: center top;` (importante — recorta privilegiando topo, ideal para retratos)

### Tipografia
- H1: `font-size: 34px; line-height: 1.15; letter-spacing: -0.5px;` (DM Serif Display)
- Mentor name: `font-size: 22px; letter-spacing: -0.3px;`
- Subtitle: `font-size: 14px; line-height: 1.7; font-style: italic; max-width: 500px;`
- Section label: `font-size: 10px; text-transform: uppercase; letter-spacing: 0.7px;`
- Body padrão das caixas: `13px; line-height: 1.6-1.7;`
- Labels de células: `font-size: 10px; uppercase; letter-spacing: 0.5px;`

### Espaçamentos (margens entre blocos)
- `.mentor-block` → `margin-bottom: 2rem`
- `.info-row`, `.focus-box`, `.steps-box`, `.cancel-box` → `margin-bottom: 2rem`
- `.divider` → `height: 1px; background: var(--border); margin: 2rem 0;`
- Gap mentor-block: `1.25rem` entre foto e nome

### Cards e caixas
- Border radius: `10px` em todos os cards (info-row, focus-box, steps-box, days-box, rules-list, cancel-box)
- Border radius do CTA: `8px`
- Border radius dos chips: `20px`
- Padding interno padrão de células: `1rem 1.25rem` (info-cell, step-row) ou `1.25rem` (focus-box, cancel-box, meet-box)

### Botão CTA
- `padding: 13px 24px;`
- `font-size: 14px; font-weight: 500;`
- `display: inline-flex; gap: 8px;`
- Ícone SVG: `16px × 16px`

### Step numbers (círculos numerados)
- `width: 24px; height: 24px;`
- `border-radius: 50%;`
- Background: `var(--text)`; texto branco
- `font-size: 11px; font-weight: 500;`

---

## Ícones

Apenas dois SVGs inline (nenhuma biblioteca, nada de Lucide/Heroicons):

### 1. Ícone de calendário (dentro do CTA "Ver horários e agendar")
- `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`
- Retângulo `(3,4)` `18×18` com cantos arredondados `rx="2"`
- Duas linhas verticais nas alças (em `x=8` e `x=16`)
- Uma linha horizontal abaixo do topo (em `y=10`)
- Style minimalista feather/lucide-like, mas escrito à mão

### 2. Ícone WhatsApp (footer)
- `viewBox="0 0 24 24"`, `fill="#25D366"`
- Path completo do logo oficial WhatsApp (single path)
- Tamanho aplicado: `15px × 15px`

Animação de loading (`.dot-pulse`): 3 bolinhas de 5px que pulsam com `@keyframes pulse` (1.2s, opacity 0.2 → 1).

---

## Links externos

- **CTA principal (Google Calendar)**: `https://calendar.app.google/bWWv7phJtFz8zpjB6`
  - `target="_blank"`
- **WhatsApp footer**: `https://wa.me/554789163007?text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%20sobre%20a%20mentoria%20com%20Rodrigo%20Rosar`
  - Número: **(47) 8916-3007** (E.164: `+5547891 63007` → `554789163007`)
  - Texto pré-preenchido: "Olá, tenho uma dúvida sobre a mentoria com Rodrigo Rosar"
- **Apps Script (carrega dias disponíveis dinamicamente)**:
  `https://script.google.com/macros/s/AKfycbzzYwGFuOZreKPbylw7iw4y0fgtJ9YVuX40euN1tkDeBHhPwgpe1AS2NG8w2JywkGhv/exec`

---

## Copy literal (PT-BR)

### Top bar
> Sessão de mentoria individual · Rodrigo Rosar

### Hero — bloco mentor
- Nome: **Rodrigo Rosar**
- Subtítulo: **Mentor · Sessões individuais**

### Hero — título e subtítulo
- H1: **Agende sua sessão**
- Subtítulo (itálico): *Uma conversa objetiva, focada no seu momento atual, para direcionamento e tomada de decisão.*

### Linha de informações (3 células)
| Label | Valor |
|---|---|
| Duração | 30 minutos |
| Formato | Google Meet |
| Tipo | Individual |

### Caixa "Foco da sessão"
- Título (uppercase): **Foco da sessão**
- Texto: Direcionamento estratégico personalizado — uma conversa objetiva voltada ao seu momento atual, para apoiar a tomada de decisão com clareza.

### Section label
> Como funciona

### 3 passos numerados
1. **Escolha seu horário**
   Veja os dias disponíveis abaixo, depois clique no botão para abrir o Google Agenda e escolher o horário exato.

2. **Confirme o agendamento**
   O evento será adicionado ao seu Google Agenda. O link do Google Meet ficará disponível dentro do evento — você também receberá uma confirmação por e-mail com todas as informações da sessão.

3. **No dia da sessão**
   Acesse o evento no seu Google Agenda e clique no link do Google Meet para entrar na chamada. Prepare-se para aproveitar cada minuto.

### Section label
> Dias disponíveis

### Estado de carregamento dos dias
- Texto: **Verificando disponibilidade** (seguido das 3 bolinhas animadas)
- Estado vazio: **Nenhum horário disponível no momento.**
- Estado erro: **Não foi possível carregar os horários. Acesse o link abaixo para ver a disponibilidade.**

### Labels dinâmicos de vagas (gerados no JS)
- 1 vaga: `1 vaga disponível` (chip âmbar)
- 2 vagas: `2 vagas disponíveis` (chip âmbar)
- 3+ vagas: `N vagas disponíveis` (chip verde)
- 0 vagas: `Sem vagas` (chip cinza)

### CTA
> Ver horários e agendar

### Section label
> Importantes

### Lista de regras (5 itens)
1. Não deixe para agendar de última hora — há vagas para todos, portanto novos horários não serão abertos. Caso esqueça de agendar e não haja mais vagas disponíveis, o bônus será perdido.
2. Só será possível remarcação caso ainda haja outros horários disponíveis.
3. O não comparecimento será considerado bônus utilizado, não havendo possibilidade de reagendamento.
4. Organize-se para aproveitar integralmente os 30 minutos.
5. Programe um alarme para não perder o horário.

*(Cada item é prefixado por um travessão `—` cinza via `::before`)*

### Caixa "Cancelamento e remarcação" (vermelho)
- Título: **Cancelamento e remarcação**
- Texto:
  > **Para cancelar:** acesse seu Google Agenda, encontre o evento da mentoria e clique em "Excluir". Faça isso com pelo menos 24h de antecedência.
  >
  > **Para remarcar:** agende um novo horário pelo botão acima e depois cancele o horário anterior no seu Google Agenda. Só é possível remarcar se ainda houver horários disponíveis.

### Footer
- Linha 1: **Dúvidas? Fale diretamente com o suporte:**
- Linha 2 (link WhatsApp): **(47) 8916-3007** (precedido pelo ícone WhatsApp verde)

---

## JavaScript (resumo)

Vanilla JS sem dependências. Faz `fetch()` no Apps Script ao carregar a página, recebe array de dias com `{ diaSemana, data, vagas }` e renderiza no `#days-box`. Trata 3 estados: erro, vazio, sucesso. Funções auxiliares: `chipClass(vagas)` e `vagasLabel(vagas)`.

Para o clone, **o SCRIPT_URL precisa apontar para um Apps Script do Rodrigo** (não o da Nanda). Ou — alternativa simples — remover a seção de "Dias disponíveis" e deixar só o CTA do Google Calendar.

---

## Favicon

Favicon inline em base64 (32×32 PNG). Mostra ícone de um calendário com chevron/símbolo dentro. Pode ser reaproveitado literal ou trocado.

---

## Outros detalhes visuais

- Página inteira é centrada com `max-width: 640px` — design column-only, mobile-first/desktop-friendly por natureza.
- Não há media queries no CSS — layout fluido, paddings em `rem`, escala suave em qualquer tela.
- `box-sizing: border-box; margin: 0; padding: 0` aplicado globalmente.
- Top bar tem texto pequeno (`12px`) em cinza, faz papel de "breadcrumb minimalista".
- Divisores horizontais (`.divider`) são linhas finas `1px` em `var(--border)` com margem vertical `2rem`.
- Cards usam `gap: 1px` + background `var(--border)` no parent + `var(--surface)` nas cells — truque clássico para divisores internos sem borda dupla (visto em `.info-row`).
- Sem sombras, sem gradientes, sem animações além do `dot-pulse`. Estética muito calma, editorial.

---

## Diferenças prováveis no clone para Rodrigo

1. Já está nomeado para Rodrigo Rosar — sem mudança de copy necessária.
2. Foto: trocar a base64 inline por um asset `assets/rodrigo.jpg` referenciado por path relativo.
3. URL do Google Calendar: confirmar com Rodrigo se quer manter `calendar.app.google/bWWv7phJtFz8zpjB6` ou criar nova.
4. WhatsApp: confirmar se `(47) 8916-3007` é o número certo do suporte do Rodrigo.
5. Apps Script da disponibilidade: precisa de URL própria do Rodrigo (ou remover essa seção).
