import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerAddTag(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "add_tag",
    {
      title: "Add Tag to Task",
      description:
        "Adiciona uma tag existente a uma task. A tag precisa existir no Space — criar nova tag nao e suportado aqui.",
      inputSchema: {
        task_id: z.string().describe("ID da task"),
        tag_name: z.string().min(1).describe("Nome exato da tag (case-sensitive)"),
      },
    },
    async ({ task_id, tag_name }) =>
      safeRun(async () => {
        await ctx.client.postV2(
          `/task/${encodeURIComponent(task_id)}/tag/${encodeURIComponent(tag_name)}`,
        );
        return ok(`Tag "${tag_name}" adicionada a task ${task_id}.`);
      }),
  );
}
