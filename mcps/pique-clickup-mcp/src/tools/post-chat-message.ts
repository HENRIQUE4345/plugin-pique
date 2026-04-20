import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WORKSPACE_ID } from "../defaults.js";
import { normalizeMarkdown } from "../format.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

interface ChatMessageResponse {
  id: string;
  type?: string;
  content?: string;
  date?: number;
  parent_channel?: string;
  user_id?: string;
}

export function registerPostChatMessage(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "post_chat_message",
    {
      title: "Post Chat Message",
      description:
        "Posta mensagem em um chat channel do ClickUp (API v3). Markdown suportado. Normaliza \\n literal pra quebra real.",
      inputSchema: {
        channel_id: z
          .string()
          .min(1)
          .describe(
            "ID do channel (ex: '1301zr-3373'). Pegar da URL: app.clickup.com/{ws}/chat/r/{channel_id}",
          ),
        content: z.string().min(1).max(40000).describe("Texto da mensagem (markdown suportado)"),
        content_format: z
          .enum(["text/md", "text/plain"])
          .optional()
          .default("text/md")
          .describe("Formato do conteudo"),
        workspace_id: z
          .string()
          .optional()
          .describe(`Workspace ID (default: ${WORKSPACE_ID} — Pique)`),
      },
    },
    async ({ channel_id, content, content_format, workspace_id }) =>
      safeRun(async () => {
        const ws = workspace_id ?? WORKSPACE_ID;
        const body = {
          type: "message",
          content: normalizeMarkdown(content),
          content_format: content_format ?? "text/md",
        };
        const res = await ctx.client.postV3<ChatMessageResponse>(
          `/workspaces/${encodeURIComponent(ws)}/chat/channels/${encodeURIComponent(channel_id)}/messages`,
          body,
        );
        return ok(`Mensagem postada no channel ${channel_id}.`, {
          message_id: res.id,
          channel_id: res.parent_channel ?? channel_id,
          workspace_id: ws,
          raw: res as unknown as Record<string, unknown>,
        });
      }),
  );
}
