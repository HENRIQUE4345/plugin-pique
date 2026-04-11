/**
 * Defaults embutidos da Pique Digital.
 *
 * Fonte de verdade: pique/infra/clickup-setup.md (no cerebro do Henrique)
 * Atualizar via PR sempre que algum ID mudar no ClickUp.
 */

export const WORKSPACE_ID = "36702200";

export interface Member {
  id: number;
  name: string;
  email?: string;
  spaces: string[]; // nomes dos spaces que tem acesso (informacional)
}

export const MEMBERS: Record<string, Member> = {
  henrique: {
    id: 48769703,
    name: "Henrique Carvalho",
    spaces: ["Pique Digital", "Pique Studio", "Yabadoo", "Beto Carvalho", "Pessoal"],
  },
  marco: {
    id: 112131560,
    name: "Marco Lagoeiro",
    spaces: ["Pique Digital", "Pique Studio", "Beto Carvalho"],
  },
  arthur: {
    id: 82127620,
    name: "Arthur Gustavo",
    email: "arthurgustavon@gmail.com",
    spaces: ["Pique Digital"],
  },
  gabriel: {
    id: 96799130,
    name: "Gabriel (GS Filmes)",
    email: "contatogsfilmes@gmail.com",
    spaces: ["Pique Studio"],
  },
  marcella: {
    id: 43145213,
    name: "Marcella Ferreira",
    email: "marcellaf.tella@gmail.com",
    spaces: ["Pique Studio"],
  },
  daniel: {
    id: 284658609,
    name: "Daniel Araujo",
    email: "danielaaraujocv27@gmail.com",
    spaces: ["Beto Carvalho"],
  },
};

/** Mapa reverso id → handle (henrique, marco, etc) pra resolver assignees em retornos */
export const MEMBER_BY_ID: Record<number, string> = Object.fromEntries(
  Object.entries(MEMBERS).map(([handle, m]) => [m.id, handle]),
);

export function memberName(id: number): string {
  const handle = MEMBER_BY_ID[id];
  return handle ? MEMBERS[handle]!.name : `user_${id}`;
}

export function resolveMember(input: string | number): number {
  if (typeof input === "number") return input;
  // Tenta numero como string
  const asNum = Number(input);
  if (!Number.isNaN(asNum) && asNum > 0) return asNum;
  // Tenta handle (case-insensitive)
  const handle = input.toLowerCase().trim();
  if (MEMBERS[handle]) return MEMBERS[handle]!.id;
  // Tenta achar por nome (primeiro nome)
  for (const m of Object.values(MEMBERS)) {
    if (m.name.toLowerCase().split(" ")[0] === handle) return m.id;
  }
  throw new Error(`Membro nao encontrado: "${input}". Conhecidos: ${Object.keys(MEMBERS).join(", ")}`);
}

export const SPACES = {
  pique_digital: "901313561086",
  pique_studio: "901313561098",
  yabadoo: "901313567191",
  beto_carvalho: "901313567164",
  pessoal: "901313561154",
} as const;

export const SPACE_NAMES: Record<string, string> = {
  "901313561086": "Pique Digital",
  "901313561098": "Pique Studio",
  "901313567191": "Yabadoo",
  "901313567164": "Beto Carvalho",
  "901313561154": "Pessoal",
};

/**
 * Folders conhecidos. Nao precisa estar completo — o cache de hierarquia
 * supre o que faltar. Estao aqui apenas os folders mais usados pelas
 * policies (especialmente Pique Studio @ folders).
 */
export const FOLDERS = {
  // Pique Digital
  beco_diagnostico: "901317742784",
  burocratico: "901317742789",
  financeiro: "901317742790",
  processos_internos: "901317742793",
  comercial: "901317859957",
  produto_cerebro: "901317859958",

  // Pique Studio (folders @ clientes)
  iairique: "901317829214",
  iaimarco: "901317829215",
  marcella: "901317826234",
  gabriel: "901317826236",
  beto: "901317826235",
  pique: "901317969068",
  gestao_studio: "901317829216",

  // Beto Carvalho
  beto_conteudo: "901317743220",
  beto_cursos: "901317862426",
  beto_prospeccao: "901317862429",
  beto_companhia_leite: "901317862430",
  beto_operacional: "901317862431",

  // Yabadoo
  yabadoo_produto: "901317743192",
  yabadoo_marketing: "901317743193",

  // Pessoal
  casa: "901317743252",
  financeiro_pessoal: "901317743255",
  saude: "901317743256",
  casamento: "901317743257",
} as const;

/**
 * Folders @ do Pique Studio que recebem CONTEUDO (clientes).
 * Gabriel nao pode criar tasks de conteudo nesses folders.
 * Folder Gestao Studio NAO esta nessa lista — Gabriel pode criar la.
 */
export const STUDIO_CONTENT_FOLDERS = new Set<string>([
  FOLDERS.iairique,
  FOLDERS.iaimarco,
  FOLDERS.marcella,
  FOLDERS.gabriel,
  FOLDERS.beto,
  FOLDERS.pique,
]);

/**
 * Policies por pessoa — enforced no create_task_full.
 */
export const POLICIES = {
  /** Gabriel: nao cria task de conteudo em folder cliente do Studio */
  gabriel_no_content: {
    user_id: MEMBERS.gabriel!.id,
    blocked_folders: STUDIO_CONTENT_FOLDERS,
    message:
      "Gabriel nao cria tasks de conteudo. Essa task deve ser criada por automacao, humano (H/M/Marcella/Beto), ou pelo Claude — nao pelo Gabriel. Se for task operacional, mover pra Folder 'Gestao Studio'.",
  },
  /** Daniel: so cria/recebe tasks no Space Beto Carvalho + descricao com Escopo de aprovacao */
  daniel_only_beto: {
    user_id: MEMBERS.daniel!.id,
    allowed_space: SPACES.beto_carvalho,
    required_section: "## Escopo de aprovacao",
    space_message:
      "Daniel so opera no Space Beto Carvalho. Tasks atribuidas ao Daniel em outros Spaces sao rejeitadas.",
    section_message:
      "Tasks atribuidas ao Daniel exigem secao '## Escopo de aprovacao' na descricao (o que precisa de aprovacao do Henrique antes de fechar).",
  },
};
