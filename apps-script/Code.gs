/**
 * Apps Script — Horários disponíveis Mentoria Rodrigo Rosar
 *
 * Retorna próximas N quartas-feiras com slots template (7 vagas manhã).
 * PULA quartas em que Rodrigo criou evento all-day com título contendo
 * uma das BLOCK_KEYWORDS ("mentoria fechada", "bloqueado", etc).
 *
 * Como bloquear um dia: Rodrigo cria evento all-day no Google Calendar
 * dele no dia da quarta, com título "Mentoria Fechada" (ou similar).
 * Apps Script detecta e pula. Próximo fetch do site não mostra a quarta.
 *
 * Como atualizar este código: cola por cima no editor → Ctrl+S →
 * Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova
 * versão → Implantar. URL fica IGUAL.
 */

const SLOTS_TEMPLATE = ['07:00', '07:40', '08:20', '09:00', '09:40', '10:20', '11:00'];
const TARGET_WEEKDAY = 3; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
const LOOKAHEAD_WEEKS = 8;
const MAX_DAYS_RETURN = 4;
const BLOCK_KEYWORDS = ['mentoria fechada', 'mentoria bloqueada', 'sem mentoria', 'bloqueado mentoria'];
const MESES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function doGet(e) {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const cal = CalendarApp.getDefaultCalendar();
    const result = [];

    for (let i = 0; i < LOOKAHEAD_WEEKS * 7 && result.length < MAX_DAYS_RETURN; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      if (day.getDay() !== TARGET_WEEKDAY) continue;

      // Pula se houver evento de bloqueio no Calendar (all-day ou normal)
      const events = cal.getEventsForDay(day);
      const isBlocked = events.some(ev => {
        const title = (ev.getTitle() || '').toLowerCase();
        return BLOCK_KEYWORDS.some(kw => title.indexOf(kw) >= 0);
      });
      if (isBlocked) continue;

      // Filtra slots já passados se for hoje
      const isToday = day.toDateString() === now.toDateString();
      let slotsAvailable = SLOTS_TEMPLATE.slice();
      if (isToday) {
        slotsAvailable = SLOTS_TEMPLATE.filter(slot => {
          const [h, m] = slot.split(':').map(Number);
          const slotTime = new Date(day);
          slotTime.setHours(h, m, 0, 0);
          return slotTime > now;
        });
      }

      if (slotsAvailable.length === 0) continue;

      const dia = day.getDate();
      const mes = MESES_PT[day.getMonth()];
      result.push({
        diaSemana: 'Quarta-feira',
        data: `${dia} de ${mes}`,
        slots: slotsAvailable,
        vagas: slotsAvailable.length
      });
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ erro: String(err) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function teste() {
  const out = doGet();
  Logger.log(out.getContent());
}
