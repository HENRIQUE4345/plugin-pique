import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { resolveMember } from "../defaults.js";
import { dateStringToMs, minutesToMs, normalizeMarkdown } from "../format.js";
import { PRIORITY_NUMBER, type Priority } from "../types.js";
import { fail, formatTask, ok, safeRun, taskToText, type ToolContext } from "../tool.js";

export function registerUpdateTask(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "update_task",
    {
      title: "Update Task",
      description:
        "Atualiza campos de uma task existente. Aceita os mesmos campos do create_task_full (todos opcionais, so envia o que for fornecido). Normaliza markdown e datas automaticamente. NAO faz validacoes da Pique no update — assume que voce sabe o que ta fazendo (use create_task_full pra criar com regras).",
      inputSchema: {
        task_id: z.string().describe("ID da task a atualizar"),
        name: z.string().optional(),
        markdown_description: z.string().optional().describe("Descricao em markdown — substitui a anterior"),
        status: z.string().optional().describe("Novo status (deve existir na list)"),
        assignees_add: z
          .array(z.union([z.string(), z.number()]))
          .optional()
          .describe("Assignees pra adicionar (handles ou IDs)"),
        assignees_rem: z
          .array(z.union([z.string(), z.number()]))
          .optional()
          .describe("Assignees pra remover"),
        priority: z.enum(["urgent", "high", "normal", "low"]).optional(),
        due_date: z.string().optional().describe("YYYY-MM-DD"),
        start_date: z.string().optional().describe("YYYY-MM-DD"),
        time_estimate_minutes: z.number().int().min(1).optional(),
        parent: z.string().optional().describe("Mover pra ser subtask de outra task"),
        archived: z.boolean().optional(),
      },
    },
    async (args) =>
      safeRun(async () => {
        const body: Record<string, unknown> = {};

        if (args.name !== undefined) body.name = args.name;
        if (args.markdown_description !== undefined) {
          body.markdown_description = normalizeMarkdown(args.markdown_description);
        }
        if (args.status !== undefined) body.status = args.status;
        if (args.priority !== undefined) body.priority = PRIORITY_NUMBER[args.priority as Priority];
        if (args.due_date !== undefined) {
          body.due_date = Number(dateStringToMs(args.due_date));
          body.due_date_time = false;
        }
        if (args.start_date !== undefined) {
          body.start_date = Number(dateStringToMs(args.start_date));
          body.start_date_time = false;
        }
        if (args.time_estimate_minutes !== undefined) {
          body.time_estimate = Number(minutesToMs(args.time_estimate_minutes));
        }
        if (args.parent !== undefined) body.parent = args.parent;
        if (args.archived !== undefined) body.archived = args.archived;
        if (args.assignees_add || args.assignees_rem) {
          body.assignees = {
            add: (args.assignees_add ?? []).map((a) => resolveMember(a)),
            rem: (args.assignees_rem ?? []).map((a) => resolveMember(a)),
          };
        }

        if (Object.keys(body).length === 0) {
          return fail("Nenhum campo fornecido pra atualizar.");
        }

        const updated = await ctx.client.putV2<Record<string, unknown>>(
          `/task/${encodeURIComponent(args.task_id)}`,
          body,
        );
        const formatted = formatTask(updated as unknown as Parameters<typeof formatTask>[0]);
        return ok(`Task atualizada.\n\n${taskToText(formatted)}`, { task: formatted });
      }),
  );
}
