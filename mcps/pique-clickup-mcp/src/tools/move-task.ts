import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { invalidateHierarchy } from "../cache.js";
import { WORKSPACE_ID } from "../defaults.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerMoveTask(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "move_task",
    {
      title: "Move Task Between Lists (v3)",
      description:
        "Move uma task entre lists usando a API v3 do ClickUp (a v2 nao tem endpoint de move — diferencial chave deste MCP). Subtasks da mae seguem automaticamente. NAO funciona em subtasks (so root tasks). Apos mover, invalida o cache de hierarquia.",
      inputSchema: {
        task_id: z.string().describe("ID da task a mover"),
        target_list_id: z.string().describe("ID da list destino"),
      },
    },
    async ({ task_id, target_list_id }) =>
      safeRun(async () => {
        const path = `/workspaces/${WORKSPACE_ID}/tasks/${encodeURIComponent(task_id)}/home_list/${encodeURIComponent(target_list_id)}`;
        await ctx.client.putV3(path);
        await invalidateHierarchy();
        return ok(`Task ${task_id} movida pra list ${target_list_id}. Cache de hierarquia invalidado.`, {
          task_id,
          target_list_id,
        });
      }),
  );
}
