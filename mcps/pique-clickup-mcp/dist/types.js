/**
 * Tipos compartilhados do MCP pique-clickup-mcp.
 * Apenas as estruturas que cruzam fronteiras entre modulos.
 */
/** Mapeamento priority string → numero da API ClickUp */
export const PRIORITY_NUMBER = {
    urgent: 1,
    high: 2,
    normal: 3,
    low: 4,
};
export const PRIORITY_STRING = {
    1: "urgent",
    2: "high",
    3: "normal",
    4: "low",
};
/** Erro estruturado para retorno consistente */
export class ClickUpError extends Error {
    status;
    detail;
    path;
    constructor(status, detail, path) {
        super(`ClickUp ${status} em ${path}: ${detail}`);
        this.status = status;
        this.detail = detail;
        this.path = path;
    }
}
export class ValidationError extends Error {
    reasons;
    constructor(reasons) {
        super(`Validacao falhou:\n - ${reasons.join("\n - ")}`);
        this.reasons = reasons;
    }
}
//# sourceMappingURL=types.js.map