/**
 * Cache da hierarquia do workspace ClickUp.
 *
 * Storage em camadas:
 *  1. memoria do processo (access mais rapido)
 *  2. arquivo em ~/.cache/pique-clickup-mcp/hierarchy.json (cross-session)
 *
 * TTL: 1h. Invalidacao automatica via invalidate() apos move/delete/admin ops.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { ClickUpClient } from "./client.js";
import { WORKSPACE_ID } from "./defaults.js";
import type { CachedFolder, CachedHierarchy, CachedList, CachedSpace } from "./types.js";

const TTL_MS = 60 * 60 * 1000; // 1h
const CACHE_DIR = join(homedir(), ".cache", "pique-clickup-mcp");
const CACHE_FILE = join(CACHE_DIR, "hierarchy.json");

let memoryCache: CachedHierarchy | null = null;

/**
 * Carrega a hierarquia. Estrategia:
 *  1. Memoria viva → retorna se valido
 *  2. Disco → le, valida TTL, popula memoria
 *  3. ClickUp → busca, salva nos dois layers
 */
export async function getHierarchy(client: ClickUpClient, forceRefresh = false): Promise<CachedHierarchy> {
  if (!forceRefresh && memoryCache && isFresh(memoryCache)) {
    return memoryCache;
  }
  if (!forceRefresh) {
    const fromDisk = await loadFromDisk();
    if (fromDisk && isFresh(fromDisk)) {
      memoryCache = fromDisk;
      return fromDisk;
    }
  }
  const fresh = await fetchFromApi(client);
  memoryCache = fresh;
  await saveToDisk(fresh);
  return fresh;
}

/** Forca refresh — sempre busca do ClickUp */
export async function refreshHierarchy(client: ClickUpClient): Promise<CachedHierarchy> {
  return getHierarchy(client, true);
}

/** Invalida cache (memoria + disco) — usado apos mutacoes que afetam hierarquia */
export async function invalidateHierarchy(): Promise<void> {
  memoryCache = null;
  try {
    await writeFile(CACHE_FILE, JSON.stringify({ workspace_id: WORKSPACE_ID, fetched_at: 0, spaces: [] }));
  } catch {
    // ignora erros de escrita
  }
}

/** Procura uma list pelo id no cache. Retorna null se nao achar. */
export function findList(hierarchy: CachedHierarchy, listId: string): { space: CachedSpace; folder: CachedFolder | null; list: CachedList } | null {
  for (const space of hierarchy.spaces) {
    for (const folder of space.folders) {
      const list = folder.lists.find((l) => l.id === listId);
      if (list) return { space, folder, list };
    }
    const list = space.lists.find((l) => l.id === listId);
    if (list) return { space, folder: null, list };
  }
  return null;
}

/** Procura folder por id */
export function findFolder(hierarchy: CachedHierarchy, folderId: string): { space: CachedSpace; folder: CachedFolder } | null {
  for (const space of hierarchy.spaces) {
    const folder = space.folders.find((f) => f.id === folderId);
    if (folder) return { space, folder };
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function isFresh(h: CachedHierarchy): boolean {
  return Date.now() - h.fetched_at < TTL_MS;
}

async function loadFromDisk(): Promise<CachedHierarchy | null> {
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as CachedHierarchy;
    if (parsed && parsed.workspace_id === WORKSPACE_ID && Array.isArray(parsed.spaces)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToDisk(h: CachedHierarchy): Promise<void> {
  try {
    await mkdir(dirname(CACHE_FILE), { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(h, null, 2));
  } catch {
    // log silencioso — cache em disco e best-effort
  }
}

async function fetchFromApi(client: ClickUpClient): Promise<CachedHierarchy> {
  // 1. Spaces do workspace
  const spacesRes = await client.getV2<{ spaces: Array<{ id: string; name: string }> }>(
    `/team/${WORKSPACE_ID}/space`,
    { archived: false },
  );

  // 2. Para cada space, busca folders + folderless lists EM PARALELO
  const spaces: CachedSpace[] = await Promise.all(
    spacesRes.spaces.map(async (s) => {
      const [foldersRes, looseListsRes] = await Promise.all([
        client.getV2<{ folders: Array<{ id: string; name: string; lists: ClickUpRawList[] }> }>(
          `/space/${s.id}/folder`,
          { archived: false },
        ),
        client.getV2<{ lists: ClickUpRawList[] }>(`/space/${s.id}/list`, { archived: false }),
      ]);

      const folders: CachedFolder[] = foldersRes.folders.map((f) => ({
        id: f.id,
        name: f.name,
        lists: (f.lists ?? []).map(parseList),
      }));

      const looseLists: CachedList[] = (looseListsRes.lists ?? []).map(parseList);

      return {
        id: s.id,
        name: s.name,
        folders,
        lists: looseLists,
      };
    }),
  );

  return {
    workspace_id: WORKSPACE_ID,
    fetched_at: Date.now(),
    spaces,
  };
}

interface ClickUpRawList {
  id: string;
  name: string;
  statuses?: Array<{ status: string }>;
}

function parseList(l: ClickUpRawList): CachedList {
  return {
    id: l.id,
    name: l.name,
    statuses: (l.statuses ?? []).map((s) => s.status),
  };
}
