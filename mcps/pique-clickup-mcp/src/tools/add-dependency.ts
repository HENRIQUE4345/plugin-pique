import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerAddDependency(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "add_dependency",
    {
      title: "Add Task Dependency",
      description:
        "Cria dependencia entre duas tasks. type='waiting_on' = a task espera pela outra terminar (ex: 'A waiting_on B' = A so comeca depois de B). type='blocking' = a task bloqueia a outra (inverso).",
      inputSchema: {
        task_id: z.string().describe("ID da task que ganha a dependencia"),
        related_task_id: z.string().describe("ID da outra task na relacao"),
        type: z
          .enum(["waiting_on", "blocking"])
          .describe("waiting_on = task_id espera por related_task_id. blocking = task_id bloqueia related_task_id."),
      },
    },
    async ({ task_id, related_task_id, type }) =>
      safeRun(async () => {
        const body: Record<string, unknown> = {};
        if (type === "waiting_on") body.depends_on = related_task_id;
        else body.dependency_of = related_task_id;
        await ctx.client.postV2(`/task/${encodeURIComponent(task_id)}/dependency`, body);
        return ok(
          `Dependencia criada: task ${task_id} ${type === "waiting_on" ? "espera por" : "bloqueia"} ${related_task_id}.`,
          { task_id, related_task_id, type },
        );
      }),
  );
}
