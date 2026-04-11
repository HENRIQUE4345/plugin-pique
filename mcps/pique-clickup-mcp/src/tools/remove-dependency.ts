import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerRemoveDependency(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "remove_dependency",
    {
      title: "Remove Task Dependency",
      description: "Remove dependencia entre duas tasks. Especifique se era waiting_on ou blocking.",
      inputSchema: {
        task_id: z.string().describe("ID da task com a dependencia"),
        related_task_id: z.string().describe("ID da outra task na relacao"),
        type: z.enum(["waiting_on", "blocking"]).describe("Tipo da dependencia que esta sendo removida"),
      },
    },
    async ({ task_id, related_task_id, type }) =>
      safeRun(async () => {
        const query: Record<string, string> = {};
        if (type === "waiting_on") query.depends_on = related_task_id;
        else query.dependency_of = related_task_id;
        await ctx.client.deleteV2(`/task/${encodeURIComponent(task_id)}/dependency`, query);
        return ok(`Dependencia removida entre ${task_id} e ${related_task_id}.`, {
          task_id,
          related_task_id,
          type,
        });
      }),
  );
}
