/**
 * Apps Script — Horários disponíveis Mentoria Rodrigo Rosar
 *
 * Lê o calendário primário do Rodrigo e calcula vagas disponíveis
 * nas próximas 4 quartas-feiras de manhã (07h às 11h40, slots de 40min).
 *
 * Como publicar:
 * 1. script.google.com (logado conta do Rodrigo)
 * 2. Novo projeto → cola este código
 * 3. Implantar → Nova implantação
 * 4. Tipo: App da Web
 * 5. Executar como: "Eu" (Rodrigo)
 * 6. Acesso: "Qualquer pessoa"
 * 7. Implantar → Autorizar → copiar URL "/exec"
 * 8. Cola URL no campo SCRIPT_URL do site
 */

const SLOTS_TEMPLATE = ['07:00','07:40','08:20','09:00','09:40','10:20','11:00'];
const SLOT_DURATION_MIN = 40;
const TARGET_WEEKDAY = 3; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
const LOOKAHEAD_WEEKS = 6; // quantas semanas à frente buscar
const MAX_DAYS_RETURN = 4; // máximo de dias retornados
const TZ = 'America/Sao_Paulo';
const MESES_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

function doGet(e) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cal = CalendarApp.getDefaultCalendar();
    const result = [];

    for (let i = 0; i < LOOKAHEAD_WEEKS * 7 && result.length < MAX_DAYS_RETURN; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      if (day.getDay() !== TARGET_WEEKDAY) continue;

      const events = cal.getEventsForDay(day);
      const availableSlots = [];

      for (const slot of SLOTS_TEMPLATE) {
        const [h, m] = slot.split(':').map(Number);
        const slotStart = new Date(day);
        slotStart.setHours(h, m, 0, 0);
        const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60000);

        const now = new Date();
        if (slotStart < now) continue; // pula slots já passaram

        const conflict = events.some(ev => {
          const s = ev.getStartTime();
          const en = ev.getEndTime();
          return s < slotEnd && en > slotStart;
        });

        if (!conflict) availableSlots.push(slot);
      }

      if (availableSlots.length > 0) {
        const dia = day.getDate();
        const mes = MESES_PT[day.getMonth()];
        result.push({
          diaSemana: 'Quarta-feira',
          data: `${dia} de ${mes}`,
          slots: availableSlots,
          vagas: availableSlots.length
        });
      }
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

// Helper pra testar no editor (não precisa pra produção)
function teste() {
  const out = doGet();
  Logger.log(out.getContent());
}
