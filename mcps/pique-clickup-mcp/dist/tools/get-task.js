import { z } from "zod";
import { formatTask, ok, safeRun, taskToText } from "../tool.js";
export function registerGetTask(server, ctx) {
    server.registerTool("get_task", {
        title: "Get Task",
        description: "Le uma task do ClickUp pelo ID. Retorna formato legivel: nome, status, assignees resolvidos, datas convertidas pra DD/MM/YYYY com relativo (hoje/em X dias/atrasada ha X dias), prioridade, time estimate em horas, tags, e avisos de sanidade. Inclui subtasks por padrao.",
        inputSchema: {
            task_id: z.string().describe("ID da task no ClickUp (ex: '86ag3pmj2')"),
            include_subtasks: z
                .boolean()
                .optional()
                .default(true)
                .describe("Incluir subtasks na resposta"),
        },
    }, async ({ task_id, include_subtasks }) => safeRun(async () => {
        const raw = await ctx.client.getV2(`/task/${encodeURIComponent(task_id)}`, {
            include_subtasks: include_subtasks ?? true,
            custom_task_ids: false,
        });
        const formatted = formatTask(raw);
        return ok(taskToText(formatted), { task: formatted, raw });
    }));
}
//# sourceMappingURL=get-task.js.map