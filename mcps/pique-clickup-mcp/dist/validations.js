/**
 * Validacoes determinsticas migradas do agent gestor-clickup pro MCP.
 *
 * Toda criacao de task passa por aqui ANTES de ir pra API ClickUp.
 * Erros viram ValidationError com lista de razoes em PT-BR.
 */
import { findList } from "./cache.js";
import { ValidationError } from "./types.js";
/**
 * Valida tudo que pode ser checado sem chamar a API.
 * Se houver erros, lanca ValidationError com lista completa.
 * Avisos (nao bloqueantes) sao retornados separados.
 */
export function validateCreateTask(input, hierarchy) {
    const errors = [];
    const warnings = [];
    // 1. Nome com verbo no infinitivo (terminacao -ar/-er/-ir na primeira palavra)
    if (!startsWithInfinitiveVerb(input.name)) {
        errors.push(`Nome deve comecar com verbo no infinitivo (terminado em -ar, -er ou -ir). Recebido: "${input.name.split(" ")[0]}"`);
    }
    // 2. Descricao com 3 secoes obrigatorias (exceto ideias de conteudo)
    if (!input.is_idea) {
        const sectionErrors = validateDescriptionSections(input.markdown_description);
        errors.push(...sectionErrors);
        // 3. Gatilhos proibidos no Contexto (historico operacional do ClickUp)
        const forbiddenInContext = detectForbiddenContextTriggers(input.markdown_description);
        if (forbiddenInContext.length > 0) {
            errors.push(`Contexto contem historico operacional do ClickUp (gatilhos: ${forbiddenInContext.join(", ")}). O Contexto deve explicar o proposito da task NO TRABALHO, nao como ela foi criada/reorganizada.`);
        }
    }
    // 4. Time estimate ≤ 4h (240 min) — exceto ideias
    if (!input.is_idea && input.time_estimate_minutes !== undefined) {
        if (input.time_estimate_minutes > 240) {
            errors.push(`Task excede o teste das 4h (${(input.time_estimate_minutes / 60).toFixed(1)}h > 4h). Isso e projeto escondido, nao task. Sugestao: virar task-mae com subtasks de 1-4h cada.`);
        }
        else if (input.time_estimate_minutes < 15) {
            warnings.push(`Task muito pequena (<15min). Considerar virar checklist de uma task maior, agrupar com similares, ou executar agora sem criar task.`);
        }
    }
    // 5. Coerencia work_type ↔ list_id (consulta hierarquia)
    const listInfo = findList(hierarchy, input.list_id);
    if (!listInfo) {
        errors.push(`list_id "${input.list_id}" nao encontrado na hierarquia do workspace. Rode refresh_hierarchy se foi criada recentemente, ou verifique o ID.`);
    }
    else if (input.work_type) {
        const coherenceWarning = checkWorkTypeCoherence(input.work_type, listInfo);
        if (coherenceWarning)
            warnings.push(coherenceWarning);
    }
    if (errors.length > 0) {
        throw new ValidationError(errors);
    }
    return { warnings };
}
// ─────────────────────────────────────────────────────────────────────────────
const VERB_REGEX = /^[A-ZÁÂÃÀÉÊÍÓÔÕÚÇa-záâãàéêíóôõúç]+(ar|er|ir)\b/;
function startsWithInfinitiveVerb(name) {
    const trimmed = name.trim();
    if (!trimmed)
        return false;
    // Pega primeira palavra
    const firstWord = trimmed.split(/\s+/)[0];
    return VERB_REGEX.test(firstWord);
}
const REQUIRED_SECTIONS = ["## Contexto", "## O que fazer", "## Criterio de pronto"];
function validateDescriptionSections(md) {
    const errors = [];
    const normalized = md.toLowerCase();
    for (const section of REQUIRED_SECTIONS) {
        const sectionLower = section.toLowerCase();
        // Aceita variacoes: "## Critério de pronto", "## Criterio de pronto"
        const variants = [
            sectionLower,
            sectionLower.replace("criterio", "critério"),
            sectionLower.replace("contexto", "contexto"),
        ];
        const found = variants.some((v) => normalized.includes(v));
        if (!found) {
            errors.push(`Descricao falta secao "${section}".`);
            continue;
        }
        // Verifica se a secao tem conteudo (linha apos o header nao vazia)
        const idx = normalized.indexOf(sectionLower);
        if (idx >= 0) {
            const after = md.slice(idx + section.length).trim();
            // Pega ate o proximo header ou fim
            const nextHeader = after.search(/\n##\s/);
            const sectionBody = nextHeader >= 0 ? after.slice(0, nextHeader) : after;
            if (sectionBody.trim().length === 0) {
                errors.push(`Secao "${section}" esta vazia.`);
            }
        }
    }
    return errors;
}
const FORBIDDEN_TRIGGERS = [
    { regex: /\bmesclag(em|ar)|\bmescla|\bfusao|\bduplicad[ao]s?\b/i, label: "mesclagem/duplicada" },
    { regex: /\bsubstitui(cao|da|do|r)?|\bem substituicao a/i, label: "substituicao" },
    { regex: /\bpromovida|\bsubtask promovida|\bvirou task\b/i, label: "promovida" },
    { regex: /\brenomead[ao]s?|\brenomeacao/i, label: "renomeacao" },
    { regex: /\bmovida da list|\bmovida de|\bmigrad[ao]/i, label: "movimentacao" },
    { regex: /\bapos reorganizacao|\bdurante a reorganizacao/i, label: "reorganizacao" },
    { regex: /\(8[a-z0-9]{7,}\)/, label: "ID de task entre parenteses" },
];
function detectForbiddenContextTriggers(md) {
    // So checa o conteudo da secao Contexto
    const contextMatch = md.match(/##\s*Contexto[\s\S]*?(?=\n##|$)/i);
    if (!contextMatch)
        return [];
    const body = contextMatch[0];
    const found = [];
    for (const t of FORBIDDEN_TRIGGERS) {
        if (t.regex.test(body))
            found.push(t.label);
    }
    return found;
}
function checkWorkTypeCoherence(workType, listInfo) {
    const folderName = listInfo.folder?.name?.toLowerCase() ?? "";
    const listName = listInfo.list.name.toLowerCase();
    // Heuristica simples — flag mas nao bloqueia
    if (workType === "chamado" && /producao|cortes|prospects/.test(listName)) {
        return `Task classificada como "chamado" mas list "${listInfo.list.name}" parece pipeline. Confirmar tipo.`;
    }
    if (workType === "pipeline" && /operacional|chamados|backlog/.test(listName)) {
        return `Task classificada como "pipeline" mas list "${listInfo.list.name}" parece operacional/chamados.`;
    }
    if (workType === "projeto" && /pipeline/.test(folderName)) {
        return `Task classificada como "projeto" mas folder "${listInfo.folder?.name}" parece pipeline.`;
    }
    return null;
}
// ─────────────────────────────────────────────────────────────────────────────
// Helpers exportados pra uso em outras tools (update, etc)
export { startsWithInfinitiveVerb, detectForbiddenContextTriggers, validateDescriptionSections };
//# sourceMappingURL=validations.js.map