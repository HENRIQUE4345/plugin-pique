import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ok, safeRun, type ToolContext } from "../tool.js";

export function registerAttachFile(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "attach_file",
    {
      title: "Attach File to Task",
      description:
        "Anexa um arquivo a uma task. Recebe conteudo em base64 (uso tipico: anexar contexto .md em vez de citar caminho local).",
      inputSchema: {
        task_id: z.string().describe("ID da task"),
        file_name: z.string().describe("Nome do arquivo (ex: 'contexto.md')"),
        content_base64: z.string().describe("Conteudo do arquivo codificado em base64"),
      },
    },
    async ({ task_id, file_name, content_base64 }) =>
      safeRun(async () => {
        const res = await ctx.client.uploadAttachment(task_id, file_name, content_base64);
        return ok(`Arquivo "${file_name}" anexado a task ${task_id}.`, { task_id, file_name, raw: res });
      }),
  );
}
