/**
 * Defaults embutidos da Pique Digital.
 *
 * So mora aqui o que NAO da pra descobrir na API: o workspace e o mapa
 * handle -> user_id. Space, folder e list IDs vem do cache de hierarquia —
 * o dia em que forem hardcoded de novo, a proxima reorg do ClickUp cria
 * ID morto, e ID morto devolve 200 com zero tasks, sem erro.
 *
 * Membros verificados na fonte em 2026-07-27.
 */
export const WORKSPACE_ID = "36702200";
export const MEMBERS = {
    henrique: {
        id: 48769703,
        name: "Henrique Carvalho",
    },
    marco: {
        id: 112131560,
        name: "Marco Lagoeiro",
    },
    arthur: {
        id: 82127620,
        name: "Arthur Gustavo",
        email: "arthurgustavon@gmail.com",
    },
    carol: {
        id: 118076232,
        name: "Carolina Abreu",
    },
    gabriel: {
        id: 96799130,
        name: "Gabriel (GS Filmes)",
        email: "contatogsfilmes@gmail.com",
    },
    marcella: {
        id: 43145213,
        name: "Marcella Ferreira",
        email: "marcellaf.tella@gmail.com",
    },
    camila: {
        id: 216069419,
        name: "Camila",
    },
};
/** Mapa reverso id → handle (henrique, marco, etc) pra resolver assignees em retornos */
export const MEMBER_BY_ID = Object.fromEntries(Object.entries(MEMBERS).map(([handle, m]) => [m.id, handle]));
export function memberName(id) {
    const handle = MEMBER_BY_ID[id];
    return handle ? MEMBERS[handle].name : `user_${id}`;
}
export function resolveMember(input) {
    if (typeof input === "number")
        return input;
    // Tenta numero como string
    const asNum = Number(input);
    if (!Number.isNaN(asNum) && asNum > 0)
        return asNum;
    // Tenta handle (case-insensitive)
    const handle = input.toLowerCase().trim();
    if (MEMBERS[handle])
        return MEMBERS[handle].id;
    // Tenta achar por nome (primeiro nome)
    for (const m of Object.values(MEMBERS)) {
        if (m.name.toLowerCase().split(" ")[0] === handle)
            return m.id;
    }
    throw new Error(`Membro nao encontrado: "${input}". Conhecidos: ${Object.keys(MEMBERS).join(", ")}`);
}
/*
 * Removidos em 2026-07-27 (Fase 0): SPACES, SPACE_NAMES, FOLDERS,
 * STUDIO_CONTENT_FOLDERS e POLICIES. Os 5 Spaces e os 25 folders listados ali
 * morreram na reorg do ClickUp — e as duas policies que dependiam deles
 * (gabriel_no_content, daniel_only_beto) nunca mais disparariam contra folder
 * vivo. Daniel (284658609) nao existe mais no workspace.
 *
 * Se alguma regra de posse voltar, ela nasce em config/metodologia.json
 * resolvida por nome + space contra o cache, nunca por ID hardcoded aqui.
 */
//# sourceMappingURL=defaults.js.map