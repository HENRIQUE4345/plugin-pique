/**
 * Role-based filtering de tools.
 *
 * Cada usuario do plugin-pique roda o MCP local com seu proprio token ClickUp
 * (CLICKUP_TOKEN) e seu role (PIQUE_CLICKUP_ROLE). O server.ts so registra
 * as tools permitidas pelo role — Claude nunca enxerga as proibidas.
 *
 * Permissoes reais sao SEMPRE herdadas do ClickUp (token do usuario).
 * O role aqui e a 2a camada de defesa sobre a escrita.
 *
 * Com `delete_task` morto (2026-07-27), owner e editor ficaram identicos:
 * nao ha mais nenhuma tool destrutiva pra separar os dois. `owner` continua
 * aceito no env por compatibilidade, mas e alias de `editor`.
 */

import type { Role } from "./types.js";

/** Tools disponiveis no MCP, em ordem alfabetica pra facilitar leitura */
export const ALL_TOOLS = [
  "add_comment",
  "add_tag",
  "create_task_full",
  "get_hierarchy",
  "get_task",
  "list_tags",
  "list_tasks",
  "refresh_hierarchy",
  "remove_tag",
  "resolve_member",
  "update_task",
] as const;

export type ToolName = (typeof ALL_TOOLS)[number];

/** Mapa role → set de tools permitidas */
const ROLE_TOOLS: Record<Role, Set<ToolName>> = {
  owner: new Set<ToolName>(ALL_TOOLS),
  editor: new Set<ToolName>(ALL_TOOLS),
  viewer: new Set<ToolName>([
    "get_task",
    "list_tasks",
    "list_tags",
    "get_hierarchy",
    "refresh_hierarchy",
    "resolve_member",
  ]),
};

export function parseRole(value: string | undefined): Role {
  // String vazia e o caso normal, nao o excepcional: `${user_config.clickup_role}`
  // expande pra "" quando o usuario nao preenche o campo opcional no enable do plugin.
  const v = (value ?? "").toLowerCase().trim() || "editor";
  if (v === "owner" || v === "editor" || v === "viewer") return v;
  throw new Error(
    `PIQUE_CLICKUP_ROLE invalido: "${value}". Use owner, editor ou viewer.`,
  );
}

export function toolsFor(role: Role): ToolName[] {
  return Array.from(ROLE_TOOLS[role]);
}

export function isAllowed(role: Role, tool: ToolName): boolean {
  return ROLE_TOOLS[role].has(tool);
}
