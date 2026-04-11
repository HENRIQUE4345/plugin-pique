import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MEMBERS, resolveMember } from "../defaults.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerResolveMember(server: McpServer, _ctx: ToolContext): void {
  server.registerTool(
    "resolve_member",
    {
      title: "Resolve Member",
      description:
        "Converte nome ou handle de membro da Pique (ex: 'henrique', 'Marco', 'gabriel') no ClickUp user_id correspondente. Use antes de criar/atualizar tasks pra obter o ID exato. Lista os membros conhecidos se input vazio ou 'list'.",
      inputSchema: {
        name: z
          .string()
          .describe(
            "Nome ou handle do membro. Aceita: 'henrique', 'marco', 'gabriel', 'marcella', 'arthur', 'daniel'. Use 'list' para listar todos.",
          ),
      },
    },
    async ({ name }) =>
      safeRun(async () => {
        const trimmed = name.trim().toLowerCase();
        if (!trimmed || trimmed === "list" || trimmed === "all") {
          const lines = Object.entries(MEMBERS).map(
            ([handle, m]) => `${handle.padEnd(10)} ${String(m.id).padEnd(12)} ${m.name}`,
          );
          return ok(
            `Membros conhecidos da Pique:\n${"handle".padEnd(10)} ${"id".padEnd(12)} nome\n${"-".repeat(50)}\n${lines.join("\n")}`,
            { members: MEMBERS },
          );
        }
        const id = resolveMember(trimmed);
        const handle = Object.entries(MEMBERS).find(([, m]) => m.id === id)?.[0];
        const member = handle ? MEMBERS[handle] : null;
        return ok(
          `${name} → user_id ${id}${member ? ` (${member.name})` : ""}`,
          { id, handle, name: member?.name },
        );
      }),
  );
}
