import { products as defaultProducts } from '../data/products';
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// ── Helpers ──────────────────────────────────────────────────────────
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getCollection(name: string): any[] {
  try {
    const raw = localStorage.getItem(`local_col_${name}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setCollection(name: string, data: any[]) {
  localStorage.setItem(`local_col_${name}`, JSON.stringify(data));
}

// ── Seed default data — always runs synchronously before any read ─────
function ensureLocalSeeded() {
  // Always re-seed products from the catalog so they are never missing.
  // Existing admin overrides (price edits etc.) are preserved by merging.
  const existing = getCollection('products');
  const existingById: Record<string, any> = {};
  existing.forEach((p: any) => { existingById[p.id] = p; });

  const now = new Date().toISOString();
  const seeded = defaultProducts.map(p => ({
    ...p,
    // Preserve any admin-edited fields that already exist for this id
    ...(existingById[p.id] || {}),
    // Always keep the canonical id/name from catalog
    id: p.id,
    name: existingById[p.id]?.name ?? p.name,
    created: existingById[p.id]?.created ?? now,
    updated: existingById[p.id]?.updated ?? now,
  }));
  setCollection('products', seeded);

  if (getCollection('hero_slides').length === 0) {
    const defaultSlides = [
      {
        id: 'slide0000000001',
        title: 'Premium Medical Drapes & Gowns',
        subtitle: 'ISO 13485:2016 Certified Sterile Medical Products',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        order_index: 0,
        created: now,
        updated: now,
      },
      {
        id: 'slide0000000002',
        title: 'Advanced Surgical Kits',
        subtitle: 'Tailored for specialized orthopedic and general surgeries',
        image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
        order_index: 1,
        created: now,
        updated: now,
      }
    ];
    setCollection('hero_slides', defaultSlides);
  }
}
ensureLocalSeeded();

// ── Auth Store (Firebase-backed) ─────────────────────────────────────
class DataAuthStore {
  private listeners: Function[] = [];
  public model: any = null;
  public isValid: boolean = false;
  private token: string = '';

  constructor() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isValid = true;
        this.token = user.uid;
        this.model = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          picture: user.photoURL || '',
          role: localStorage.getItem('test_one_user_role') || 'customer',
          created: user.metadata.creationTime || new Date().toISOString(),
          updated: user.metadata.lastSignInTime || new Date().toISOString(),
        };
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.model));
      } else {
        this.isValid = false;
        this.token = '';
        this.model = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      this.trigger();
    });
  }

  async clear() {
    await signOut(auth);
  }

  onChange(callback: (token: string, model: any) => void) {
    this.listeners.push(callback);
    setTimeout(() => callback(this.token, this.model), 0);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  trigger() {
    this.listeners.forEach(l => l(this.token, this.model));
  }
}

const authStoreInstance = new DataAuthStore();

// ── Collection (localStorage-backed) ────────────────────────────────
class DataCollection {
  private name: string;
  public static subscribers: Record<string, Function[]> = {};

  constructor(name: string) {
    this.name = name;
  }

  private triggerRealtime() {
    localStorage.setItem(`db_sync_${this.name}`, Date.now().toString());
    const list = DataCollection.subscribers[this.name] || [];
    list.forEach(cb => cb({ action: 'change', record: {} }));
  }

  async getFullList(options: any = {}): Promise<any[]> {
    let list = getCollection(this.name);
    if (options.filter) {
      if (options.filter.includes('stock_quantity = 0')) {
        list = list.filter((item: any) => Number(item.stock_quantity) === 0);
      }
      const createdMatch = options.filter.match(/created\s*>=\s*"([^"]+)"/);
      if (createdMatch) {
        const since = new Date(createdMatch[1]);
        list = list.filter((item: any) => new Date(item.created) >= since);
      }
    }
    if (options.sort) {
      const desc = options.sort.startsWith('-');
      const field = desc ? options.sort.slice(1) : options.sort;
      list.sort((a: any, b: any) => {
        if (a[field] < b[field]) return desc ? 1 : -1;
        if (a[field] > b[field]) return desc ? -1 : 1;
        return 0;
      });
    }
    return list;
  }

  async getList(page: number, perPage: number, options: any = {}): Promise<any> {
    const list = await this.getFullList(options);
    return {
      items: list.slice((page - 1) * perPage, page * perPage),
      totalItems: list.length,
      totalPages: Math.ceil(list.length / perPage),
      page,
      perPage
    };
  }

  async getOne(id: string): Promise<any> {
    const list = getCollection(this.name);
    const item = list.find((r: any) => r.id === id);
    if (!item) throw new Error('Not found');
    return item;
  }

  async create(payload: any): Promise<any> {
    if (this.name === 'users' && payload.password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        return { ...payload, id: userCredential.user.uid };
      } catch (err: any) {
        throw new Error(err.message || 'Failed to create account');
      }
    }

    const list = getCollection(this.name);
    const now = new Date().toISOString();
    const record = { ...payload, id: payload.id || generateId(), created: now, updated: now };
    list.push(record);
    setCollection(this.name, list);
    this.triggerRealtime();
    return record;
  }

  async update(id: string, payload: any): Promise<any> {
    const list = getCollection(this.name);
    const idx = list.findIndex((r: any) => r.id === id);
    if (idx === -1) throw new Error('Record not found');
    list[idx] = { ...list[idx], ...payload, updated: new Date().toISOString() };
    setCollection(this.name, list);
    this.triggerRealtime();
    return list[idx];
  }

  async delete(id: string): Promise<boolean> {
    let list = getCollection(this.name);
    const before = list.length;
    list = list.filter((r: any) => r.id !== id);
    if (list.length < before) {
      setCollection(this.name, list);
      this.triggerRealtime();
      return true;
    }
    return false;
  }

  async subscribe(topic: string, callback: Function) {
    if (!DataCollection.subscribers[this.name]) {
      DataCollection.subscribers[this.name] = [];
    }
    DataCollection.subscribers[this.name].push(callback);
  }

  async unsubscribe(topic: string) {
    DataCollection.subscribers[this.name] = [];
  }

  // ── Auth helpers (Firebase-backed) ─────────────────────────────────
  async authWithPassword(email: string, password: any): Promise<any> {
    if (this.name !== 'users') throw new Error('Only supported on users');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { token: userCredential.user.uid, record: authStoreInstance.model };
    } catch (err: any) {
      throw new Error(err.message || 'Invalid email or password');
    }
  }

  async requestVerification(_email: string): Promise<boolean> {
    return true;
  }

  async authWithOAuth2(_config: any): Promise<any> {
    if (this.name !== 'users') throw new Error('Only supported on users');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { token: userCredential.user.uid, record: authStoreInstance.model };
    } catch (err: any) {
      throw new Error(err.message || 'Google Sign-In failed');
    }
  }
}

// ── Cross-tab sync ───────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('db_sync_')) {
      const collectionName = e.key.replace('db_sync_', '');
      const list = DataCollection.subscribers[collectionName] || [];
      list.forEach(cb => cb({ action: 'change', record: {} }));
    }
  });
}

// ── Public API ───────────────────────────────────────────────────────
export const db = {
  authStore: authStoreInstance,
  collection(name: string) {
    return new DataCollection(name);
  },
  admins: {
    async authWithPassword(email: string, password: any) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { token: userCredential.user.uid, record: authStoreInstance.model };
      } catch (err: any) {
        throw new Error('Invalid admin credentials.');
      }
    }
  }
};
