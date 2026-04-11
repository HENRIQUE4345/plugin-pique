/**
 * Tipos compartilhados do MCP pique-clickup-mcp.
 * Apenas as estruturas que cruzam fronteiras entre modulos.
 */

export type Priority = "urgent" | "high" | "normal" | "low";
export type WorkType = "pipeline" | "projeto" | "chamado";
export type Role = "owner" | "editor" | "viewer";
export type DependencyType = "waiting_on" | "blocking";

/** Mapeamento priority string → numero da API ClickUp */
export const PRIORITY_NUMBER: Record<Priority, number> = {
  urgent: 1,
  high: 2,
  normal: 3,
  low: 4,
};

export const PRIORITY_STRING: Record<number, Priority> = {
  1: "urgent",
  2: "high",
  3: "normal",
  4: "low",
};

/** Estrutura simplificada de uma task como retornada pelas tools */
export interface FormattedTask {
  id: string;
  name: string;
  url: string;
  status: string;
  list_id: string;
  list_name?: string;
  assignees: { id: number; name: string }[];
  due_date: string | null;
  due_relative: string | null;
  start_date: string | null;
  priority: Priority | null;
  time_estimate_hours: number | null;
  tags: string[];
  parent: string | null;
  warnings: string[];
}

/** Hierarquia cacheada do workspace */
export interface CachedHierarchy {
  workspace_id: string;
  fetched_at: number;
  spaces: CachedSpace[];
}

export interface CachedSpace {
  id: string;
  name: string;
  folders: CachedFolder[];
  /** Lists soltas direto no Space (sem folder) */
  lists: CachedList[];
}

export interface CachedFolder {
  id: string;
  name: string;
  lists: CachedList[];
}

export interface CachedList {
  id: string;
  name: string;
  statuses: string[];
}

/** Resultado padrao das tools */
export interface ToolResult {
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

/** Erro estruturado para retorno consistente */
export class ClickUpError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public path: string,
  ) {
    super(`ClickUp ${status} em ${path}: ${detail}`);
  }
}

export class ValidationError extends Error {
  constructor(public reasons: string[]) {
    super(`Validacao falhou:\n - ${reasons.join("\n - ")}`);
  }
}
