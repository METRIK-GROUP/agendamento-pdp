# Apps Script — Setup pro Rodrigo

Esse Apps Script lê o Calendar do Rodrigo e retorna slots disponíveis nas próximas quartas-feiras. Site faz fetch e exibe automático.

## Passo a passo (5 minutos)

### 1. Criar projeto
- Abrir https://script.google.com (logado na conta do Rodrigo)
- **Novo projeto**
- Renomear pra "Mentoria Rodrigo - Horários disponíveis"

### 2. Colar código
- Apagar todo conteúdo do arquivo `Code.gs` que vem por padrão
- Copiar o arquivo `Code.gs` deste repo INTEIRO e colar
- **Salvar** (ícone disquete ou Ctrl+S)

### 3. Implantar como Web App
- Botão **Implantar** (canto sup. direito) → **Nova implantação**
- Ícone engrenagem → **App da Web**
- Configurar:
  - **Descrição**: `Horários mentoria`
  - **Executar como**: `Eu (rodrigo@...)`
  - **Quem tem acesso**: `Qualquer pessoa`
- **Implantar**
- Vai pedir autorização → **Autorizar acesso** → Avançado → "Acessar Mentoria Rodrigo - Horários (não verificado)" → **Permitir**

### 4. Copiar URL
- Vai aparecer "URL do App da Web" terminando em `/exec`
- **Copiar URL** e mandar pro Rafael

### 5. Pronto!
- Rafael cola a URL no `index.html` do site
- Site passa a mostrar horários reais, atualizando sozinho

## Testar antes de mandar

Cola a URL no navegador. Deve retornar JSON tipo:
```json
[
  {"diaSemana":"Quarta-feira","data":"27 de maio","slots":["07:00","07:40","08:20","09:00","09:40","10:20","11:00"],"vagas":7}
]
```

Se retornar `[]`, sem horários — talvez todas as quartas tenham eventos conflitantes.

## Como atualizar regras

Editar constantes no topo de `Code.gs`:

| Constante | O que controla |
|---|---|
| `SLOTS_TEMPLATE` | Lista de horários disponíveis ("07:00", "07:40", ...) |
| `SLOT_DURATION_MIN` | Duração de cada slot em minutos |
| `TARGET_WEEKDAY` | Dia da semana (0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab) |
| `LOOKAHEAD_WEEKS` | Quantas semanas à frente buscar |
| `MAX_DAYS_RETURN` | Máximo de dias retornados |

Após editar:
- **Implantar** → **Gerenciar implantações** → ícone editar (lápis) na implantação atual
- **Versão**: Nova versão
- **Implantar**
- URL fica igual (não precisa atualizar site)

## Troubleshooting

**"Erro 401 / não autorizado"**: Reimplantar com "Quem tem acesso = Qualquer pessoa".

**Retorna sempre `[]`**: Calendar `getDefaultCalendar()` pode não ser o calendar correto. Se Rodrigo tem múltiplos calendars, mudar pra:
```javascript
const cal = CalendarApp.getCalendarById('CALENDAR_ID@group.calendar.google.com');
```
Pegar o ID em Calendar → Configurações → Integrar agenda → ID da agenda.

**Slots não batem com Calendar real**: Apps Script lê eventos do calendar primário. Se Appointment Schedule grava em calendar separado, ajustar o ID.
