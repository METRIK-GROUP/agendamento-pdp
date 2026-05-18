/**
 * Apps Script — Mentoria Rodrigo Rosar
 *
 * GET  → lista próximas quartas com slots disponíveis
 * POST → cria evento na agenda do Rodrigo + Google Meet + convida aluno
 *
 * Bloqueio de dia inteiro: criar evento all-day no Calendar com título
 * "Mentoria Fechada" (ou similar — ver BLOCK_KEYWORDS).
 *
 * Como atualizar: cola por cima → Ctrl+S → Implantar → Gerenciar implantações
 * → editar (lápis) → Versão: Nova versão → Implantar. URL fica IGUAL.
 */

const SLOTS_TEMPLATE = ['07:00', '07:40', '08:20', '09:00', '09:40', '10:20', '11:00'];
const SLOT_DURATION_MIN = 30;
const TARGET_WEEKDAY = 3; // 0=Dom, 3=Qua, 5=Sex
const LOOKAHEAD_WEEKS = 8;
const MAX_DAYS_RETURN = 4;
const BLOCK_KEYWORDS = ['mentoria fechada', 'mentoria bloqueada', 'sem mentoria', 'bloqueado mentoria'];
const BOOKING_TITLE_PREFIX = 'Mentoria · Rodrigo Rosar';
const MESES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const TZ = 'America/Sao_Paulo';

// ============================================================
// GET — lista slots disponíveis
// ============================================================
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

      // Bloqueio por keyword no Calendar
      const dayEvents = cal.getEventsForDay(day);
      const blocked = dayEvents.some(ev => {
        const t = (ev.getTitle() || '').toLowerCase();
        return BLOCK_KEYWORDS.some(kw => t.indexOf(kw) >= 0);
      });
      if (blocked) continue;

      // Slots: remove os ocupados (eventos com BOOKING_TITLE_PREFIX) e os já passados
      const isToday = day.toDateString() === now.toDateString();
      const slotsAvailable = SLOTS_TEMPLATE.filter(slot => {
        const slotStart = parseSlotDate(day, slot);
        const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60000);
        if (isToday && slotStart < now) return false;
        const conflict = dayEvents.some(ev => {
          if ((ev.getTitle() || '').indexOf(BOOKING_TITLE_PREFIX) !== 0) return false;
          return ev.getStartTime() < slotEnd && ev.getEndTime() > slotStart;
        });
        return !conflict;
      });

      if (slotsAvailable.length === 0) continue;

      result.push({
        dataIso: Utilities.formatDate(day, TZ, 'yyyy-MM-dd'),
        diaSemana: 'Quarta-feira',
        data: `${day.getDate()} de ${MESES_PT[day.getMonth()]}`,
        slots: slotsAvailable,
        vagas: slotsAvailable.length
      });
    }

    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ erro: String(err) });
  }
}

// ============================================================
// POST — cria reserva
// Body esperado (JSON): { dataIso: "2026-05-27", slot: "07:00", nome, email }
// ============================================================
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const dataIso = String(body.dataIso || '');
    const slot = String(body.slot || '');
    const nome = String(body.nome || '').trim();
    const email = String(body.email || '').trim().toLowerCase();

    if (!dataIso || !slot || !nome || !email) {
      return jsonResponse({ erro: 'Dados incompletos. Preencha nome, email, data e horário.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ erro: 'Email inválido.' });
    }

    const [Y, M, D] = dataIso.split('-').map(Number);
    const day = new Date(Y, M - 1, D);
    if (day.getDay() !== TARGET_WEEKDAY) {
      return jsonResponse({ erro: 'Data inválida.' });
    }
    if (SLOTS_TEMPLATE.indexOf(slot) === -1) {
      return jsonResponse({ erro: 'Horário inválido.' });
    }

    const slotStart = parseSlotDate(day, slot);
    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60000);

    if (slotStart < new Date()) {
      return jsonResponse({ erro: 'Esse horário já passou.' });
    }

    const cal = CalendarApp.getDefaultCalendar();

    // Verifica se dia inteiro tá bloqueado
    const dayEvents = cal.getEventsForDay(day);
    const blocked = dayEvents.some(ev => {
      const t = (ev.getTitle() || '').toLowerCase();
      return BLOCK_KEYWORDS.some(kw => t.indexOf(kw) >= 0);
    });
    if (blocked) return jsonResponse({ erro: 'Esse dia não está disponível.' });

    // Verifica se slot já foi reservado (lock leve)
    const conflict = dayEvents.some(ev => {
      if ((ev.getTitle() || '').indexOf(BOOKING_TITLE_PREFIX) !== 0) return false;
      return ev.getStartTime() < slotEnd && ev.getEndTime() > slotStart;
    });
    if (conflict) return jsonResponse({ erro: 'Esse horário acabou de ser reservado. Escolha outro.' });

    // Cria evento
    const title = `${BOOKING_TITLE_PREFIX} — ${nome}`;
    const description = [
      `Sessão de mentoria individual — 30 minutos.`,
      ``,
      `Aluno: ${nome}`,
      `Email: ${email}`,
      ``,
      `Bônus exclusivo Implementação PDP 2026.`
    ].join('\n');

    const event = cal.createEvent(title, slotStart, slotEnd, {
      description: description,
      guests: email,
      sendInvites: true
    });

    // Adiciona Google Meet via Advanced Calendar Service (se habilitado)
    // Caso contrário, evento fica sem link Meet (Rodrigo adiciona manualmente)
    let meetLink = null;
    try {
      const eventId = event.getId().split('@')[0];
      const advanced = Calendar.Events.patch({
        conferenceData: {
          createRequest: {
            requestId: Utilities.getUuid(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }, 'primary', eventId, { conferenceDataVersion: 1, sendUpdates: 'all' });
      if (advanced && advanced.hangoutLink) meetLink = advanced.hangoutLink;
    } catch (advErr) {
      // Sem Advanced Calendar Service ativo — segue sem Meet automático
      Logger.log('Advanced Calendar error: ' + advErr);
    }

    return jsonResponse({
      ok: true,
      diaSemana: 'Quarta-feira',
      data: `${day.getDate()} de ${MESES_PT[day.getMonth()]}`,
      slot: slot,
      meetLink: meetLink
    });
  } catch (err) {
    return jsonResponse({ erro: 'Erro ao reservar: ' + String(err) });
  }
}

// ============================================================
// Helpers
// ============================================================
function parseSlotDate(day, slot) {
  const [h, m] = slot.split(':').map(Number);
  const d = new Date(day);
  d.setHours(h, m, 0, 0);
  return d;
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
