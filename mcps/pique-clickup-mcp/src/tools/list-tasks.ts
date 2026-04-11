import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WORKSPACE_ID, resolveMember } from "../defaults.js";
import { dateStringToMs } from "../format.js";
import { fail, formatTask, ok, safeRun, taskToText, type ToolContext } from "../tool.js";

export function registerListTasks(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "list_tasks",
    {
      title: "List Tasks",
      description:
        "Filtra tasks por list_id, folder_id, space_id, assignees, statuses, e/ou intervalo de due_date. Pelo menos um escopo (list_id, folder_id, space_id) e obrigatorio se nao usar filtro de team. Retorna ate 100 tasks por chamada (paginadas pelo ClickUp). Datas formatadas em PT-BR.",
      inputSchema: {
        list_id: z.string().optional().describe("Filtrar tasks de uma list especifica"),
        folder_id: z
          .string()
          .optional()
          .describe("Filtrar todas as tasks de um folder (todas as lists do folder)"),
        space_id: z
          .string()
          .optional()
          .describe("Filtrar todas as tasks de um space (alternativa: usar com assignees pra busca workspace-wide)"),
        assignees: z
          .array(z.union([z.string(), z.number()]))
          .optional()
          .describe("Filtrar por assignees. Aceita IDs ou handles ('henrique', 'marco', etc)."),
        statuses: z.array(z.string()).optional().describe("Filtrar por nomes de status (ex: ['Hoje', 'Fazendo'])"),
        due_date_lt: z
          .string()
          .optional()
          .describe("Tasks com due_date ANTERIOR a esta data (YYYY-MM-DD). Use 'today' pra hoje."),
        due_date_gt: z
          .string()
          .optional()
          .describe("Tasks com due_date POSTERIOR a esta data (YYYY-MM-DD)."),
        include_closed: z.boolean().optional().default(false).describe("Incluir tasks finalizadas"),
        archived: z.boolean().optional().default(false),
        page: z.number().int().min(0).optional().default(0).describe("Pagina (0-indexed)"),
      },
    },
    async (args) =>
      safeRun(async () => {
        const { list_id, folder_id, space_id, assignees, statuses, due_date_lt, due_date_gt, include_closed, archived, page } = args;

        if (!list_id && !folder_id && !space_id && !assignees) {
          return fail("Pelo menos um filtro de escopo e obrigatorio: list_id, folder_id, space_id ou assignees.");
        }

        // Resolver assignees pra IDs
        const assigneeIds = assignees?.map((a) => resolveMember(a));

        // Normalizar datas pra ms
        const dueLt = due_date_lt
          ? due_date_lt === "today"
            ? String(Date.now())
            : dateStringToMs(due_date_lt)
          : undefined;
        const dueGt = due_date_gt ? dateStringToMs(due_date_gt) : undefined;

        // Query params comuns (ClickUp aceita arrays via repeticao do param)
        const buildQuery = (): URLSearchParams => {
          const q = new URLSearchParams();
          q.set("page", String(page ?? 0));
          q.set("archived", String(archived ?? false));
          q.set("subtasks", "true");
          if (include_closed) q.set("include_closed", "true");
          if (statuses) statuses.forEach((s) => q.append("statuses[]", s));
          if (assigneeIds) assigneeIds.forEach((id) => q.append("assignees[]", String(id)));
          if (dueLt) q.set("due_date_lt", dueLt);
          if (dueGt) q.set("due_date_gt", dueGt);
          return q;
        };

        let path: string;
        if (list_id) {
          path = `/list/${list_id}/task?${buildQuery().toString()}`;
        } else if (folder_id) {
          // Buscar tasks via team filter com folder ID
          const q = buildQuery();
          q.append("folder_ids[]", folder_id);
          path = `/team/${WORKSPACE_ID}/task?${q.toString()}`;
        } else if (space_id) {
          const q = buildQuery();
          q.append("space_ids[]", space_id);
          path = `/team/${WORKSPACE_ID}/task?${q.toString()}`;
        } else {
          // so assignees → workspace-wide
          path = `/team/${WORKSPACE_ID}/task?${buildQuery().toString()}`;
        }

        const res = await ctx.client.getV2<{ tasks: Array<Parameters<typeof formatTask>[0]> }>(path);
        const tasks = (res.tasks ?? []).map(formatTask);

        if (tasks.length === 0) {
          return ok("Nenhuma task encontrada com esses filtros.", { tasks: [], total: 0 });
        }

        const text = [
          `${tasks.length} task(s) encontrada(s):`,
          "",
          ...tasks.map((t) => `─────\n${taskToText(t)}`),
        ].join("\n");

        return ok(text, { tasks, total: tasks.length });
      }),
  );
}
