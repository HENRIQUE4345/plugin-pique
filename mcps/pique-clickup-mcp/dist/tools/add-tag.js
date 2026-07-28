import { z } from "zod";
import { ok, safeRun } from "../tool.js";
export function registerAddTag(server, ctx) {
    server.registerTool("add_tag", {
        title: "Add Tag to Task",
        description: "Adiciona uma tag existente a uma task. A tag precisa existir no Space — criar nova tag nao e suportado aqui.",
        inputSchema: {
            task_id: z.string().describe("ID da task"),
            tag_name: z.string().min(1).describe("Nome exato da tag (case-sensitive)"),
        },
    }, async ({ task_id, tag_name }) => safeRun(async () => {
        await ctx.client.postV2(`/task/${encodeURIComponent(task_id)}/tag/${encodeURIComponent(tag_name)}`);
        return ok(`Tag "${tag_name}" adicionada a task ${task_id}.`);
    }));
}
//# sourceMappingURL=add-tag.js.map