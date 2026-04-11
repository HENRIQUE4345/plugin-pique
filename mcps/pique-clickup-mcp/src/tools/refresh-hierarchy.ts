import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { refreshHierarchy } from "../cache.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerRefreshHierarchy(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "refresh_hierarchy",
    {
      title: "Refresh Workspace Hierarchy",
      description:
        "Forca refresh do cache de hierarquia do workspace. Use quando souber que algo mudou no ClickUp pela UI (folder/list criado ou deletado fora do MCP).",
      inputSchema: {},
    },
    async () =>
      safeRun(async () => {
        const h = await refreshHierarchy(ctx.client);
        const totalSpaces = h.spaces.length;
        const totalFolders = h.spaces.reduce((sum, s) => sum + s.folders.length, 0);
        const totalLists = h.spaces.reduce(
          (sum, s) => sum + s.lists.length + s.folders.reduce((fs, f) => fs + f.lists.length, 0),
          0,
        );
        return ok(
          `Hierarquia atualizada. Workspace ${h.workspace_id}: ${totalSpaces} spaces, ${totalFolders} folders, ${totalLists} lists.`,
          { workspace_id: h.workspace_id, totals: { spaces: totalSpaces, folders: totalFolders, lists: totalLists } },
        );
      }),
  );
}
