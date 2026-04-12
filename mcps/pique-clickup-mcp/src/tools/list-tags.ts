import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

interface TagResponse {
  tags: Array<{ name: string; tag_fg?: string; tag_bg?: string; creator?: number }>;
}

export function registerListTags(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "list_tags",
    {
      title: "List Space Tags",
      description:
        "Lista todas as tags disponiveis em um Space do ClickUp. Use antes de add_tag/remove_tag pra saber quais tags existem (tags sao case-sensitive e devem existir no Space).",
      inputSchema: {
        space_id: z.string().describe("ID do Space (ex: '90131873762' pra Pique Digital)"),
      },
    },
    async ({ space_id }) =>
      safeRun(async () => {
        const res = await ctx.client.getV2<TagResponse>(
          `/space/${encodeURIComponent(space_id)}/tag`,
        );
        const names = (res.tags ?? []).map((t) => t.name);
        if (names.length === 0) {
          return ok(`Nenhuma tag cadastrada no Space ${space_id}.`, { tags: [] });
        }
        return ok(
          `${names.length} tag(s) no Space ${space_id}:\n${names.map((n) => `  - ${n}`).join("\n")}`,
          { tags: names, raw: res.tags },
        );
      }),
  );
}
