import { db as localDb } from './dbClient';

export async function loadCollection<T>(
  table: string,
  orderBy?: { column: string; ascending?: boolean }
): Promise<T[]> {
  try {
    const options: Record<string, any> = {};
    if (orderBy) {
      let col = orderBy.column;
      if (col === 'created_at') col = 'created';
      if (col === 'updated_at') col = 'updated';
      options.sort = (orderBy.ascending ?? false) ? col : `-${col}`;
    }
    const data = await localDb.collection(table).getFullList(options);
    return data.map(record => ({
      ...record,
      created_at: record.created,
      updated_at: record.updated,
    })) as unknown as T[];
  } catch (err) {
    console.error(`Load collection failed for ${table}:`, err);
    return [];
  }
}

export async function createRecord<T>(table: string, payload: any): Promise<T> {
  const saved = await localDb.collection(table).create(payload);
  return {
    ...saved,
    created_at: saved.created,
    updated_at: saved.updated,
  } as unknown as T;
}

export async function upsertRecord<T>(table: string, payload: any): Promise<T> {
  const id = payload.id;
  try {
    let saved;
    try {
      saved = await localDb.collection(table).update(id, payload);
    } catch {
      saved = await localDb.collection(table).create({ ...payload, id });
    }
    return {
      ...saved,
      created_at: saved.created,
      updated_at: saved.updated,
    } as unknown as T;
  } catch (err) {
    console.error(`Upsert failed for ${table}:`, err);
    throw err;
  }
}

export async function deleteRecord(table: string, id: string) {
  try {
    await localDb.collection(table).delete(id);
  } catch (err) {
    console.error(`Delete failed for ${table}/${id}:`, err);
    throw err;
  }
}

