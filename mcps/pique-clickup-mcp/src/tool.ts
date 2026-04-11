/**
 * Helpers compartilhados pelas tools.
 */

import type { ClickUpClient } from "./client.js";
import { ClickUpError, ValidationError, type FormattedTask } from "./types.js";
import { memberName } from "./defaults.js";
import { msToDisplay, msToHours, relativeDate, isYearSane } from "./format.js";
import { PRIORITY_STRING } from "./types.js";

/** Contexto injetado em cada tool no register */
export interface ToolContext {
  client: ClickUpClient;
  role: import("./types.js").Role;
}

/** Tipo de retorno padrao das tools (compativel com CallToolResult do MCP SDK) */
export interface McpToolResult {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
  [key: string]: unknown;
}

/** Resposta de sucesso simples (so texto) */
export function ok(text: string, structured?: Record<string, unknown>): McpToolResult {
  const result: McpToolResult = {
    content: [{ type: "text" as const, text }],
  };
  if (structured) result.structuredContent = structured;
  return result;
}

/** Resposta de erro com mensagem clara */
export function fail(text: string): McpToolResult {
  return {
    content: [{ type: "text" as const, text }],
    isError: true,
  };
}

/** Wrapper que captura ClickUpError/ValidationError e formata pro Claude */
export async function safeRun(fn: () => Promise<McpToolResult>): Promise<McpToolResult> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ValidationError) {
      return fail(`Validacao falhou:\n${e.reasons.map((r) => `  - ${r}`).join("\n")}`);
    }
    if (e instanceof ClickUpError) {
      return fail(`Erro do ClickUp (HTTP ${e.status}): ${e.detail}`);
    }
    if (e instanceof Error) {
      return fail(`Erro: ${e.message}`);
    }
    return fail(`Erro desconhecido: ${String(e)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatadores de Task crua → FormattedTask

interface RawClickUpTask {
  id: string;
  name: string;
  url?: string;
  status?: { status: string };
  list?: { id: string; name?: string };
  assignees?: Array<{ id: number; username?: string }>;
  due_date?: string | null;
  start_date?: string | null;
  priority?: { priority: string; orderindex?: string } | null;
  time_estimate?: string | number | null;
  tags?: Array<{ name: string }>;
  parent?: string | null;
}

export function formatTask(raw: RawClickUpTask): FormattedTask {
  const warnings: string[] = [];

  // Sanidade de datas
  if (!isYearSane(raw.due_date ?? null)) {
    warnings.push("due_date parece fora do ano corrente, verificar");
  }
  if (!isYearSane(raw.start_date ?? null)) {
    warnings.push("start_date parece fora do ano corrente, verificar");
  }
  // start ≤ due
  const dueNum = raw.due_date ? Number(raw.due_date) : NaN;
  const startNum = raw.start_date ? Number(raw.start_date) : NaN;
  if (Number.isFinite(dueNum) && Number.isFinite(startNum) && startNum > dueNum) {
    warnings.push("start_date posterior a due_date — verificar");
  }

  // Priority: ClickUp retorna como objeto { priority: 'urgent', orderindex: '1' }
  let priority: import("./types.js").Priority | null = null;
  if (raw.priority) {
    const p = raw.priority.priority?.toLowerCase();
    if (p === "urgent" || p === "high" || p === "normal" || p === "low") {
      priority = p;
    } else if (raw.priority.orderindex) {
      priority = PRIORITY_STRING[Number(raw.priority.orderindex)] ?? null;
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    url: raw.url ?? "",
    status: raw.status?.status ?? "",
    list_id: raw.list?.id ?? "",
    list_name: raw.list?.name,
    assignees: (raw.assignees ?? []).map((a) => ({
      id: a.id,
      name: a.username || memberName(a.id),
    })),
    due_date: msToDisplay(raw.due_date ?? null),
    due_relative: relativeDate(raw.due_date ?? null),
    start_date: msToDisplay(raw.start_date ?? null),
    priority,
    time_estimate_hours: msToHours(raw.time_estimate ?? null),
    tags: (raw.tags ?? []).map((t) => t.name),
    parent: raw.parent ?? null,
    warnings,
  };
}

/** Formata task em texto legivel pro retorno do MCP */
export function taskToText(t: FormattedTask): string {
  const lines = [
    `TASK: ${t.name}`,
    `ID: ${t.id}`,
    t.url ? `URL: ${t.url}` : null,
    `STATUS: ${t.status}`,
    `ASSIGNEES: ${t.assignees.map((a) => a.name).join(", ") || "(nenhum)"}`,
    `DUE: ${t.due_date ?? "(sem prazo)"}${t.due_relative ? ` — ${t.due_relative}` : ""}`,
    `START: ${t.start_date ?? "(nao definido)"}`,
    `PRIORIDADE: ${t.priority ?? "(nao definida)"}`,
    `TIME ESTIMATE: ${t.time_estimate_hours !== null ? `${t.time_estimate_hours}h` : "(nao definido)"}`,
    t.tags.length > 0 ? `TAGS: ${t.tags.join(", ")}` : null,
    t.parent ? `PARENT: ${t.parent}` : null,
    t.warnings.length > 0 ? `AVISOS: ${t.warnings.join("; ")}` : null,
  ];
  return lines.filter(Boolean).join("\n");
}
