/**
 * HTTP client minimo pra API ClickUp.
 * - fetch nativo (Node 20+)
 * - retry com exponential backoff em 429
 * - normaliza erros pra ClickUpError
 * - sem deps externas
 */
import { ClickUpError } from "./types.js";
const BASE_V2 = "https://api.clickup.com/api/v2";
const BASE_V3 = "https://api.clickup.com/api/v3";
export class ClickUpClient {
    token;
    maxRetries;
    constructor(opts) {
        if (!opts.token || !opts.token.trim()) {
            throw new Error("CLICKUP_TOKEN nao definido. Configure a variavel de ambiente.");
        }
        this.token = opts.token;
        this.maxRetries = opts.maxRetries ?? 3;
    }
    /** GET v2 */
    async getV2(path, query) {
        return this.request("GET", BASE_V2 + path, { query });
    }
    /** POST v2 */
    async postV2(path, body) {
        return this.request("POST", BASE_V2 + path, { body });
    }
    /** PUT v2 */
    async putV2(path, body) {
        return this.request("PUT", BASE_V2 + path, { body });
    }
    /** DELETE v2 */
    async deleteV2(path, query) {
        return this.request("DELETE", BASE_V2 + path, { query });
    }
    /** PUT v3 — usado pra move_task */
    async putV3(path, body) {
        return this.request("PUT", BASE_V3 + path, { body });
    }
    /** POST v3 — usado pra post_chat_message */
    async postV3(path, body) {
        return this.request("POST", BASE_V3 + path, { body });
    }
    /** Upload multipart pra anexos */
    async uploadAttachment(taskId, fileName, contentBase64) {
        const url = `${BASE_V2}/task/${encodeURIComponent(taskId)}/attachment`;
        const buffer = Buffer.from(contentBase64, "base64");
        // Detecta mime simples por extensao
        const mime = guessMime(fileName);
        const blob = new Blob([buffer], { type: mime });
        const form = new FormData();
        form.append("attachment", blob, fileName);
        const res = await fetch(url, {
            method: "POST",
            headers: { Authorization: this.token },
            body: form,
        });
        if (!res.ok) {
            const detail = await safeText(res);
            throw new ClickUpError(res.status, detail, url);
        }
        return res.json();
    }
    async request(method, url, opts = {}) {
        const fullUrl = opts.query ? appendQuery(url, opts.query) : url;
        const init = {
            method,
            headers: {
                Authorization: this.token,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };
        if (opts.body !== undefined) {
            init.body = JSON.stringify(opts.body);
        }
        let lastErr;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            try {
                const res = await fetch(fullUrl, init);
                // Rate limit — retry com backoff
                if (res.status === 429 && attempt < this.maxRetries) {
                    const retryAfter = Number(res.headers.get("retry-after")) || 0;
                    const wait = retryAfter > 0 ? retryAfter * 1000 : Math.min(1000 * Math.pow(2, attempt), 8000);
                    await sleep(wait + Math.random() * 200);
                    continue;
                }
                if (!res.ok) {
                    const detail = await safeText(res);
                    throw new ClickUpError(res.status, detail, fullUrl);
                }
                // Algumas respostas (delete) vem vazias
                const text = await res.text();
                if (!text)
                    return {};
                try {
                    return JSON.parse(text);
                }
                catch {
                    return text;
                }
            }
            catch (e) {
                lastErr = e;
                if (e instanceof ClickUpError && e.status !== 429)
                    throw e;
                if (attempt === this.maxRetries)
                    throw e;
                await sleep(500 * (attempt + 1));
            }
        }
        throw lastErr ?? new Error("Request falhou apos retries");
    }
}
function appendQuery(url, query) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null)
            continue;
        params.append(k, String(v));
    }
    const qs = params.toString();
    return qs ? `${url}?${qs}` : url;
}
async function safeText(res) {
    try {
        return (await res.text()).slice(0, 500);
    }
    catch {
        return res.statusText;
    }
}
function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
function guessMime(fileName) {
    const ext = fileName.toLowerCase().split(".").pop() ?? "";
    const map = {
        md: "text/markdown",
        txt: "text/plain",
        json: "application/json",
        pdf: "application/pdf",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        csv: "text/csv",
        html: "text/html",
    };
    return map[ext] ?? "application/octet-stream";
}
//# sourceMappingURL=client.js.map