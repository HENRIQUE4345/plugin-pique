#!/usr/bin/env node
/**
 * pique-clickup-mcp — MCP custom enxuto pra ClickUp da Pique Digital.
 *
 * Entrypoint stdio. Le env vars no boot:
 *   - CLICKUP_TOKEN (obrigatorio): token API pessoal do ClickUp
 *   - PIQUE_CLICKUP_ROLE (opcional, default 'editor'): owner | editor | viewer
 *
 * O role determina quais tools sao registradas (defesa em camadas com a permissao
 * real do ClickUp herdada do token).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ClickUpClient } from "./client.js";
import { isAllowed, parseRole, type ToolName } from "./role.js";
import type { ToolContext } from "./tool.js";

import { registerAddComment } from "./tools/add-comment.js";
import { registerAddDependency } from "./tools/add-dependency.js";
import { registerAddTag } from "./tools/add-tag.js";
import { registerAttachFile } from "./tools/attach-file.js";
import { registerCreateTaskFull } from "./tools/create-task-full.js";
import { registerDeleteTask } from "./tools/delete-task.js";
import { registerGetHierarchy } from "./tools/get-hierarchy.js";
import { registerGetTask } from "./tools/get-task.js";
import { registerListTags } from "./tools/list-tags.js";
import { registerListTasks } from "./tools/list-tasks.js";
import { registerMoveTask } from "./tools/move-task.js";
import { registerRefreshHierarchy } from "./tools/refresh-hierarchy.js";
import { registerRemoveDependency } from "./tools/remove-dependency.js";
import { registerRemoveTag } from "./tools/remove-tag.js";
import { registerResolveMember } from "./tools/resolve-member.js";
import { registerUpdateTask } from "./tools/update-task.js";

type Registrar = (server: McpServer, ctx: ToolContext) => void;

const REGISTRARS: Record<ToolName, Registrar> = {
  add_comment: registerAddComment,
  add_dependency: registerAddDependency,
  add_tag: registerAddTag,
  attach_file: registerAttachFile,
  create_task_full: registerCreateTaskFull,
  delete_task: registerDeleteTask,
  get_hierarchy: registerGetHierarchy,
  get_task: registerGetTask,
  list_tags: registerListTags,
  list_tasks: registerListTasks,
  move_task: registerMoveTask,
  refresh_hierarchy: registerRefreshHierarchy,
  remove_dependency: registerRemoveDependency,
  remove_tag: registerRemoveTag,
  resolve_member: registerResolveMember,
  update_task: registerUpdateTask,
};

async function main(): Promise<void> {
  const token = process.env.CLICKUP_TOKEN;
  if (!token) {
    console.error("[pique-clickup-mcp] ERRO: CLICKUP_TOKEN nao definido. Configure no .mcp.json ou env do shell.");
    process.exit(1);
  }

  const role = parseRole(process.env.PIQUE_CLICKUP_ROLE);
  const client = new ClickUpClient({ token });
  const ctx: ToolContext = { client, role };

  const server = new McpServer(
    {
      name: "pique-clickup-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Registra apenas as tools permitidas pelo role
  let registered = 0;
  for (const [tool, registrar] of Object.entries(REGISTRARS) as Array<[ToolName, Registrar]>) {
    if (isAllowed(role, tool)) {
      registrar(server, ctx);
      registered++;
    }
  }

  console.error(`[pique-clickup-mcp] Boot OK. Role: ${role}. Tools registradas: ${registered}/${Object.keys(REGISTRARS).length}.`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[pique-clickup-mcp] Fatal:", err);
  process.exit(1);
});
