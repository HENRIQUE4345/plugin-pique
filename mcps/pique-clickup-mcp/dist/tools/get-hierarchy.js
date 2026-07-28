import { z } from "zod";
import { getHierarchy } from "../cache.js";
import { ok, safeRun } from "../tool.js";
export function registerGetHierarchy(server, ctx) {
    server.registerTool("get_hierarchy", {
        title: "Get Workspace Hierarchy",
        description: "Retorna a hierarquia completa do workspace ClickUp (spaces → folders → lists com statuses). Cache de 1h. Use pra descobrir IDs de listas/folders/spaces ou validar onde criar uma task. Retorna formato compacto YAML-like.",
        inputSchema: {
            space_id: z
                .string()
                .optional()
                .describe("Filtra por space_id especifico (opcional)"),
            format: z
                .enum(["text", "json"])
                .optional()
                .default("text")
                .describe("Formato de saida: 'text' (compacto, padrao) ou 'json'"),
        },
    }, async ({ space_id, format }) => safeRun(async () => {
        const h = await getHierarchy(ctx.client);
        const spaces = space_id ? h.spaces.filter((s) => s.id === space_id) : h.spaces;
        if (format === "json") {
            return ok(JSON.stringify({ workspace_id: h.workspace_id, spaces }, null, 2), {
                workspace_id: h.workspace_id,
                spaces,
            });
        }
        const lines = [`Workspace: ${h.workspace_id}`, `Cache: ${new Date(h.fetched_at).toISOString()}`, ""];
        for (const s of spaces) {
            lines.push(`SPACE ${s.id} — ${s.name}`);
            for (const f of s.folders) {
                lines.push(`  FOLDER ${f.id} — ${f.name}`);
                for (const l of f.lists) {
                    lines.push(`    LIST ${l.id} — ${l.name} [${l.statuses.join(" → ")}]`);
                }
            }
            for (const l of s.lists) {
                lines.push(`  LIST (loose) ${l.id} — ${l.name} [${l.statuses.join(" → ")}]`);
            }
            lines.push("");
        }
        return ok(lines.join("\n"), { workspace_id: h.workspace_id, spaces });
    }));
}
//# sourceMappingURL=get-hierarchy.js.map