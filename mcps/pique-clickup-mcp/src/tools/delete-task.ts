import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { fail, ok, safeRun, type ToolContext } from "../tool.js";

export function registerDeleteTask(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "delete_task",
    {
      title: "Delete Task",
      description:
        "Deleta uma task permanentemente. Use com cuidado — operacao irreversivel. Disponivel apenas para role 'owner'.",
      inputSchema: {
        task_id: z.string().describe("ID da task a deletar"),
        confirm: z
          .literal(true)
          .describe("Deve ser literalmente 'true' pra confirmar a operacao destrutiva"),
      },
    },
    async ({ task_id, confirm }) =>
      safeRun(async () => {
        if (confirm !== true) {
          return fail("Deletion nao confirmada. Passe confirm: true.");
        }
        await ctx.client.deleteV2(`/task/${encodeURIComponent(task_id)}`);
        return ok(`Task ${task_id} deletada.`, { task_id, deleted: true });
      }),
  );
}
