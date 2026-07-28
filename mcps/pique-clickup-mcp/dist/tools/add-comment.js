import { z } from "zod";
import { resolveMember } from "../defaults.js";
import { normalizeMarkdown } from "../format.js";
import { ok, safeRun } from "../tool.js";
export function registerAddComment(server, ctx) {
    server.registerTool("add_comment", {
        title: "Add Task Comment",
        description: "Adiciona um comentario a uma task. Normaliza \\n literal pra quebra real.",
        inputSchema: {
            task_id: z.string().describe("ID da task"),
            comment: z.string().min(1).describe("Texto do comentario"),
            notify_all: z.boolean().optional().default(false).describe("Notificar todos os assignees"),
            assignee: z
                .union([z.string(), z.number()])
                .optional()
                .describe("Atribuir o comentario a um membro especifico (handle ou ID)"),
        },
    }, async ({ task_id, comment, notify_all, assignee }) => safeRun(async () => {
        const body = {
            comment_text: normalizeMarkdown(comment),
            notify_all: notify_all ?? false,
        };
        if (assignee !== undefined) {
            body.assignee = resolveMember(assignee);
        }
        const res = await ctx.client.postV2(`/task/${encodeURIComponent(task_id)}/comment`, body);
        return ok(`Comentario adicionado a task ${task_id}.`, { comment_id: res.id, raw: res });
    }));
}
//# sourceMappingURL=add-comment.js.map