/**
 * Utilitarios de formatacao: datas, markdown, conversoes.
 *
 * Estes helpers existem pra resolver os 2 maiores gotchas do MCP oficial:
 *  1. timestamps unix ms como string — convertemos pra ISO + relativo
 *  2. \n literal em markdown — normalizamos antes de mandar pra API
 */

const TZ = "America/Sao_Paulo";

/** Converte 'YYYY-MM-DD' (interpretado como meio-dia em SP) pra unix ms string */
export function dateStringToMs(date: string): string {
  // Aceita 'YYYY-MM-DD' ou 'YYYY-MM-DD HH:MM'
  const trimmed = date.trim();
  let isoLike: string;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    // meio-dia em SP (UTC-3) = 15:00 UTC
    isoLike = `${trimmed}T15:00:00.000Z`;
  } else if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(trimmed)) {
    // assume horario local SP, converte pra UTC adicionando +3h
    const [d, t] = trimmed.split(/[T ]/);
    const [h, m] = t!.split(":");
    const utcH = (Number(h) + 3) % 24;
    const dayOffset = Number(h) + 3 >= 24 ? 1 : 0;
    const dt = new Date(`${d}T00:00:00.000Z`);
    dt.setUTCDate(dt.getUTCDate() + dayOffset);
    dt.setUTCHours(utcH, Number(m), 0, 0);
    isoLike = dt.toISOString();
  } else {
    throw new Error(`Data invalida: "${date}". Use formato YYYY-MM-DD ou YYYY-MM-DD HH:MM`);
  }
  return String(new Date(isoLike).getTime());
}

/** Converte unix ms (string ou number) pra 'DD/MM/YYYY (dia-semana)' em portugues BR */
export function msToDisplay(ms: string | number | null | undefined): string | null {
  if (ms === null || ms === undefined || ms === "") return null;
  const num = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(num) || num <= 0) return null;
  const d = new Date(num);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleString("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    weekday: "short",
  });
}

/** Converte unix ms pra ISO date YYYY-MM-DD (em SP) */
export function msToDateString(ms: string | number | null | undefined): string | null {
  if (ms === null || ms === undefined || ms === "") return null;
  const num = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(num) || num <= 0) return null;
  const d = new Date(num);
  if (isNaN(d.getTime())) return null;
  // formata em SP
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(d); // YYYY-MM-DD
}

/** Calcula relativo: 'hoje', 'em 3 dias', 'atrasada ha 5 dias' */
export function relativeDate(ms: string | number | null | undefined): string | null {
  if (ms === null || ms === undefined || ms === "") return null;
  const num = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(num) || num <= 0) return null;
  const days = Math.round((num - Date.now()) / 86400000);
  if (days === 0) return "hoje";
  if (days === 1) return "amanha";
  if (days === -1) return "ontem";
  if (days > 0) return `em ${days} dias`;
  return `atrasada ha ${Math.abs(days)} dias`;
}

/**
 * Normaliza markdown antes de enviar pra API ClickUp.
 * Resolve o bug onde o agent escapa \n virando barra+n literal.
 */
export function normalizeMarkdown(md: string): string {
  return md
    .replace(/\\n/g, "\n") // \n literal vira quebra real
    .replace(/\\t/g, "\t") // mesma coisa pra tab
    .replace(/\r\n/g, "\n") // CRLF vira LF
    .trim();
}

/** Converte minutos pra ms STRING (formato exigido pela API ClickUp) */
export function minutesToMs(minutes: number): string {
  return String(Math.round(minutes * 60000));
}

/** Converte ms (string ou number) pra horas com 1 decimal */
export function msToHours(ms: string | number | null | undefined): number | null {
  if (ms === null || ms === undefined || ms === "") return null;
  const num = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round((num / 3600000) * 10) / 10;
}

/** Verifica se uma data esta dentro de +/- 12 meses do agora (sanidade) */
export function isYearSane(ms: string | number | null | undefined): boolean {
  if (ms === null || ms === undefined || ms === "") return true;
  const num = typeof ms === "string" ? Number(ms) : ms;
  if (!Number.isFinite(num) || num <= 0) return true;
  const diffMonths = Math.abs(num - Date.now()) / (30 * 86400000);
  return diffMonths <= 12;
}
