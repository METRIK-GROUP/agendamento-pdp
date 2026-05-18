/**
 * Apps Script — Horários disponíveis Mentoria Rodrigo Rosar
 *
 * Retorna próximas N quartas-feiras com slots template (7 vagas manhã).
 *
 * Por que template fixo: Appointment Schedule do Google grava reservas num
 * calendar oculto interno (não exposto via Calendar API). Lendo o primary
 * resultaria em falsos conflitos com eventos pessoais do Rodrigo.
 *
 * Benefício deste approach: datas progridem automaticamente. Toda segunda,
 * a quarta da semana some quando passa e a próxima aparece. Sem hardcode.
 *
 * Como atualizar:
 * 1. Cola este código por cima do antigo no editor Apps Script
 * 2. Ctrl+S
 * 3. Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar
 * 4. URL fica IGUAL — site continua funcionando sem trocar nada
 */

const SLOTS_TEMPLATE = ['07:00', '07:40', '08:20', '09:00', '09:40', '10:20', '11:00'];
const TARGET_WEEKDAY = 3; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
const LOOKAHEAD_WEEKS = 8; // quantas semanas à frente buscar
const MAX_DAYS_RETURN = 4; // máximo de dias retornados
const MESES_PT = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function doGet(e) {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const result = [];

    for (let i = 0; i < LOOKAHEAD_WEEKS * 7 && result.length < MAX_DAYS_RETURN; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      if (day.getDay() !== TARGET_WEEKDAY) continue;

      // Pula quarta se já passou (mas inclui se ainda tem slots futuros hoje)
      const isToday = day.toDateString() === now.toDateString();
      if (isToday) {
        const lastSlot = SLOTS_TEMPLATE[SLOTS_TEMPLATE.length - 1];
        const [lh, lm] = lastSlot.split(':').map(Number);
        const lastSlotTime = new Date(day);
        lastSlotTime.setHours(lh, lm, 0, 0);
        if (lastSlotTime < now) continue;
      }

      // Filtra slots já passados se for hoje
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
