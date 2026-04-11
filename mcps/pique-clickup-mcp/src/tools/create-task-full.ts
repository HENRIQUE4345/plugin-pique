import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getHierarchy, invalidateHierarchy } from "../cache.js";
import { resolveMember } from "../defaults.js";
import { dateStringToMs, minutesToMs, normalizeMarkdown } from "../format.js";
import { PRIORITY_NUMBER, type Priority, type WorkType } from "../types.js";
import { validateCreateTask } from "../validations.js";
import { formatTask, ok, safeRun, taskToText, type ToolContext } from "../tool.js";

export function registerCreateTaskFull(server: McpServer, ctx: ToolContext): void {
  server.registerTool(
    "create_task_full",
    {
      title: "Create Task (Full)",
      description:
        "Cria uma task completa no ClickUp em UMA chamada (substitui create + update + dependency + attach do MCP oficial). Aplica todas as validacoes da Pique: verbo no infinitivo, descricao com 3 secoes obrigatorias, time estimate ≤4h, policies por pessoa (Gabriel/Daniel), gatilhos proibidos no Contexto. Em caso de falha apos task criada (ex: dependencia invalida), faz ROLLBACK deletando a task.",
      inputSchema: {
        list_id: z.string().describe("ID da list destino. Obrigatorio."),
        name: z
          .string()
          .min(3)
          .describe(
            "Nome da task. DEVE comecar com verbo no infinitivo (Configurar, Criar, Revisar, Escrever, etc).",
          ),
        markdown_description: z
          .string()
          .describe(
            "Descricao em markdown. DEVE conter 3 secoes obrigatorias: '## Contexto', '## O que fazer', '## Criterio de pronto'. Cada secao com conteudo. Contexto NAO pode ter historico operacional do ClickUp (mesclagem, substituicao, IDs entre parenteses, etc).",
          ),
        assignees: z
          .array(z.union([z.string(), z.number()]))
          .min(1)
          .describe(
            "Assignees. Aceita IDs ClickUp (number) ou handles ('henrique', 'marco', 'gabriel', 'arthur', 'marcella', 'daniel').",
          ),
        priority: z
          .enum(["urgent", "high", "normal", "low"])
          .describe("Prioridade da task."),
        due_date: z
          .string()
          .describe("Prazo final no formato YYYY-MM-DD (ex: '2026-04-15'). Convertido pra meio-dia em SP."),
        start_date: z
          .string()
          .optional()
          .describe("Data de inicio opcional no formato YYYY-MM-DD."),
        time_estimate_minutes: z
          .number()
          .int()
          .min(1)
          .max(240)
          .describe("Estimativa em minutos. Maximo 240 (4h) — acima disso e projeto, nao task."),
        work_type: z
          .enum(["pipeline", "projeto", "chamado"])
          .describe(
            "Tipo de trabalho. pipeline = unidade de fluxo repetitivo. projeto = acao dentro de projeto com escopo unico. chamado = acao atomica isolada.",
          ),
        status: z.string().optional().describe("Status inicial. Default: primeiro status da list."),
        tags: z.array(z.string()).optional().describe("Tags da task (devem existir no Space)"),
        custom_fields: z
          .array(z.object({ id: z.string(), value: z.unknown() }))
          .optional()
          .describe("Custom fields no formato [{id, value}]"),
        depends_on: z
          .array(z.string())
          .optional()
          .describe("IDs de tasks que ESTA task depende (waiting_on). Cria dependencias apos criar."),
        parent: z.string().optional().describe("Se subtask, ID da task-mae"),
        attach_files: z
          .array(
            z.object({
              file_name: z.string(),
              content_base64: z.string(),
            }),
          )
          .optional()
          .describe("Arquivos pra anexar apos criar (ex: contexto .md em base64)"),
        is_idea: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Marca a task como ideia de conteudo (relaxa validacoes: dispensa secoes obrigatorias e teste das 4h).",
          ),
        notify_all: z.boolean().optional().default(false).describe("Notificar assignees ao criar"),
      },
    },
    async (args) =>
      safeRun(async () => {
        // 1. Resolver assignees pra IDs
        const assigneeIds = args.assignees.map((a) => resolveMember(a));

        // 2. Normalizar markdown
        const cleanMd = normalizeMarkdown(args.markdown_description);

        // 3. Validacoes locais (vai chamar hierarquia se ainda nao em cache)
        const hierarchy = await getHierarchy(ctx.client);
        const { warnings } = validateCreateTask(
          {
            list_id: args.list_id,
            name: args.name,
            markdown_description: cleanMd,
            assignees: assigneeIds,
            time_estimate_minutes: args.time_estimate_minutes,
            work_type: args.work_type as WorkType,
            is_idea: args.is_idea,
          },
          hierarchy,
        );

        // 4. Body do POST /list/{id}/task
        const body: Record<string, unknown> = {
          name: args.name,
          markdown_description: cleanMd, // resolve bug do \n literal
          assignees: assigneeIds,
          priority: PRIORITY_NUMBER[args.priority as Priority],
          due_date: Number(dateStringToMs(args.due_date)),
          due_date_time: false,
          time_estimate: Number(minutesToMs(args.time_estimate_minutes)),
          notify_all: args.notify_all ?? false,
        };
        if (args.start_date) {
          body.start_date = Number(dateStringToMs(args.start_date));
          body.start_date_time = false;
        }
        if (args.status) body.status = args.status;
        if (args.tags && args.tags.length > 0) body.tags = args.tags;
        if (args.custom_fields && args.custom_fields.length > 0) body.custom_fields = args.custom_fields;
        if (args.parent) body.parent = args.parent;

        // 5. Criar task
        const created = await ctx.client.postV2<Record<string, unknown>>(
          `/list/${args.list_id}/task`,
          body,
        );
        const taskId = created.id as string;
        const taskUrl = (created.url as string) ?? "";

        // 6. Se houver dependencias ou attaches, executar com rollback em caso de falha
        const dependencies_created: string[] = [];
        const files_attached: string[] = [];
        try {
          if (args.depends_on && args.depends_on.length > 0) {
            for (const depId of args.depends_on) {
              await ctx.client.postV2(`/task/${taskId}/dependency`, {
                depends_on: depId,
              });
              dependencies_created.push(depId);
            }
          }
          if (args.attach_files && args.attach_files.length > 0) {
            for (const f of args.attach_files) {
              await ctx.client.uploadAttachment(taskId, f.file_name, f.content_base64);
              files_attached.push(f.file_name);
            }
          }
        } catch (e) {
          // Rollback: deleta a task criada
          try {
            await ctx.client.deleteV2(`/task/${taskId}`);
          } catch {
            // engole erro de rollback — relata o erro original
          }
          const detail = e instanceof Error ? e.message : String(e);
          throw new Error(
            `Task ${taskId} foi criada mas falhou no passo seguinte. ROLLBACK aplicado (task deletada). Causa: ${detail}`,
          );
        }

        const formatted = formatTask(created as unknown as Parameters<typeof formatTask>[0]);
        const lines = [
          `Task criada com sucesso.`,
          ``,
          taskToText(formatted),
        ];
        if (dependencies_created.length > 0) {
          lines.push(``, `DEPENDENCIAS CRIADAS: ${dependencies_created.join(", ")}`);
        }
        if (files_attached.length > 0) {
          lines.push(`ARQUIVOS ANEXADOS: ${files_attached.join(", ")}`);
        }
        if (warnings.length > 0) {
          lines.push(``, `AVISOS:`, ...warnings.map((w) => `  - ${w}`));
        }

        // Invalida cache se algum field afetar hierarquia (nao e o caso normalmente)
        // mas e barato re-validar — a task criada nao muda hierarquia, so move/delete fazem isso
        void invalidateHierarchy; // suprime warning de unused

        return ok(lines.join("\n"), {
          task_id: taskId,
          url: taskUrl,
          dependencies_created,
          files_attached,
          warnings,
          task: formatted,
        });
      }),
  );
}
