// Server-backed data client — reads directly from localStorage (same as dbClient)
// so the app works offline without a running backend server.
import { db as localDb } from './dbClient';

class ServerCollection {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  async getFullList(options: any = {}): Promise<any[]> {
    return localDb.collection(this.name).getFullList(options);
  }

  async getOne(id: string): Promise<any> {
    return localDb.collection(this.name).getOne(id);
  }

  async create(payload: any): Promise<any> {
    return localDb.collection(this.name).create(payload);
  }

  async update(id: string, payload: any): Promise<any> {
    return localDb.collection(this.name).update(id, payload);
  }

  async delete(id: string): Promise<boolean> {
    return localDb.collection(this.name).delete(id);
  }

  async subscribe(topic: string, callback: Function) {
    return localDb.collection(this.name).subscribe(topic, callback);
  }

  async unsubscribe(topic: string) {
    return localDb.collection(this.name).unsubscribe(topic);
  }
}

// Auth store wrapper
const authStoreInstance = {
  isValid: false,
  model: null,
  onChange(callback: (token: string, model: any) => void) {
    // Simple stub - actual auth handled by Firebase in dbClient
    return () => {};
  },
  clear() {
    return Promise.resolve();
  }
};

export const serverDb = {
  authStore: authStoreInstance,
  collection(name: string) {
    return new ServerCollection(name);
  },
};
