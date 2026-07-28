import { z } from "zod";
import { ok, safeRun } from "../tool.js";
export function registerRemoveTag(server, ctx) {
    server.registerTool("remove_tag", {
        title: "Remove Tag from Task",
        description: "Remove uma tag de uma task. Nao deleta a tag do Space, so desvincula da task.",
        inputSchema: {
            task_id: z.string().describe("ID da task"),
            tag_name: z.string().min(1).describe("Nome exato da tag a remover (case-sensitive)"),
        },
    }, async ({ task_id, tag_name }) => safeRun(async () => {
        await ctx.client.deleteV2(`/task/${encodeURIComponent(task_id)}/tag/${encodeURIComponent(tag_name)}`);
        return ok(`Tag "${tag_name}" removida da task ${task_id}.`);
    }));
}
//# sourceMappingURL=remove-tag.js.map