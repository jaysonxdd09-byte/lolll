import { supabase } from './supabaseClient';

type RecordMap = Record<string, any>;

function storageKey(table: string) {
  return `testone:${table}`;
}

function readLocal(table: string): RecordMap[] {
  try {
    const raw = localStorage.getItem(storageKey(table));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(table: string, items: RecordMap[]) {
  localStorage.setItem(storageKey(table), JSON.stringify(items));
}

export async function loadCollection<T extends RecordMap>(
  table: string,
  orderBy?: { column: string; ascending?: boolean },
  fallback: T[] = []
): Promise<T[]> {
  try {
    let query = supabase.from(table).select('*');
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending ?? false });
    }
    const { data, error } = await query;
    if (error) throw error;
    if (Array.isArray(data) && data.length > 0) return data as T[];

    const local = readLocal(table);
    if (local.length > 0) return local as T[];

    if (fallback.length > 0) {
      writeLocal(table, fallback);
    }
    return fallback;
  } catch {
    const local = readLocal(table);
    if (local.length > 0) return local as T[];

    if (fallback.length > 0) {
      writeLocal(table, fallback);
    }
    return fallback;
  }
}

export async function createRecord<T extends RecordMap>(table: string, payload: T): Promise<T> {
  const localPayload = {
    id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: payload.created_at || new Date().toISOString(),
    ...payload,
  } as T;

  try {
    const { data, error } = await supabase.from(table).insert([payload as any]).select('*').single();
    if (error) throw error;
    return (data as T) || localPayload;
  } catch {
    const local = readLocal(table);
    writeLocal(table, [localPayload, ...local]);
    return localPayload;
  }
}

export async function upsertRecord<T extends RecordMap>(table: string, payload: T): Promise<T> {
  const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const localPayload = {
    ...payload,
    id,
    updated_at: new Date().toISOString(),
  } as T;

  try {
    const { data, error } = await supabase.from(table).upsert([localPayload as any]).select('*').single();
    if (error) throw error;
    return (data as T) || localPayload;
  } catch {
    const local = readLocal(table);
    const next = local.some((item) => item.id === id)
      ? local.map((item) => (item.id === id ? { ...item, ...localPayload } : item))
      : [localPayload, ...local];
    writeLocal(table, next);
    return localPayload;
  }
}

export async function deleteRecord(table: string, id: string) {
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  } catch {
    const local = readLocal(table).filter((item) => item.id !== id);
    writeLocal(table, local);
  }
}
