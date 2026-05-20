import { products as defaultProducts } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class MockAuthStore {
  private listeners: Function[] = [];
  
  get isValid(): boolean {
    return !!localStorage.getItem('pb_auth_token');
  }

  get model(): any {
    const userJson = localStorage.getItem('pb_auth_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  clear() {
    localStorage.removeItem('pb_auth_token');
    localStorage.removeItem('pb_auth_user');
    this.trigger();
  }

  onChange(callback: (token: string, model: any) => void) {
    this.listeners.push(callback);
    const token = localStorage.getItem('pb_auth_token') || '';
    const model = this.model;
    setTimeout(() => callback(token, model), 0);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  trigger() {
    const token = localStorage.getItem('pb_auth_token') || '';
    const model = this.model;
    this.listeners.forEach(l => l(token, model));
  }
}

const authStoreInstance = new MockAuthStore();

// Pre-seed API if collections are empty (for seamless migration)
async function ensureApiSeeded() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    if (data.length === 0) {
      // Seed products
      for (const prod of defaultProducts) {
        await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prod)
        });
      }
      // Seed hero_slides
      const defaultSlides = [
        {
          id: 'slide0000000001',
          title: 'Premium Medical Drapes & Gowns',
          subtitle: 'ISO 13485:2016 Certified Sterile Medical Products',
          image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
          order_index: 0
        },
        {
          id: 'slide0000000002',
          title: 'Advanced Surgical Kits',
          subtitle: 'Tailored for specialized orthopedic and general surgeries',
          image_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
          order_index: 1
        }
      ];
      for (const slide of defaultSlides) {
        await fetch(`${API_URL}/hero_slides`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slide)
        });
      }
    }
  } catch (e) {
    console.warn("Could not reach API server. Ensure it's running on port 3001.");
  }
}
ensureApiSeeded();

class MockCollection {
  private name: string;
  public static subscribers: Record<string, Function[]> = {};

  constructor(name: string) {
    this.name = name;
  }

  private triggerRealtime() {
    // Write dummy key to trigger cross-tab storage event
    localStorage.setItem(`pb_sync_${this.name}`, Date.now().toString());
    const list = MockCollection.subscribers[this.name] || [];
    list.forEach(cb => cb({ action: 'change', record: {} }));
  }

  async getFullList(options: any = {}): Promise<any[]> {
    try {
      const res = await fetch(`${API_URL}/${this.name}`);
      let list = await res.json();
      if (options.filter && options.filter.includes('stock_quantity = 0')) {
        list = list.filter((item: any) => item.stock_quantity === 0);
      }
      return list;
    } catch (e) {
      console.error(e);
      return [];
    }
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
    const res = await fetch(`${API_URL}/${this.name}/${id}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  }

  async create(payload: any): Promise<any> {
    const res = await fetch(`${API_URL}/${this.name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const record = await res.json();
    this.triggerRealtime();
    return record;
  }

  async update(id: string, payload: any): Promise<any> {
    const res = await fetch(`${API_URL}/${this.name}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Record not found');
    const updatedRecord = await res.json();
    this.triggerRealtime();
    return updatedRecord;
  }

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`${API_URL}/${this.name}/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      this.triggerRealtime();
      return true;
    }
    return false;
  }

  async subscribe(topic: string, callback: Function) {
    if (!MockCollection.subscribers[this.name]) {
      MockCollection.subscribers[this.name] = [];
    }
    MockCollection.subscribers[this.name].push(callback);
  }

  async unsubscribe(topic: string) {
    MockCollection.subscribers[this.name] = [];
  }

  async authWithPassword(email: string, password: any): Promise<any> {
    if (this.name !== 'users') throw new Error('Only supported on users');
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('pb_auth_token', data.token);
    localStorage.setItem('pb_auth_user', JSON.stringify(data.record));
    authStoreInstance.trigger();
    return data;
  }

  async requestVerification(email: string): Promise<boolean> {
    return true;
  }

  async authWithOAuth2(config: any): Promise<any> {
    if (this.name !== 'users') throw new Error('Only supported on users');
    
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      const confirmSetup = window.confirm(
        "To login with a REAL Google account, you need to set up a Google Client ID in your .env file:\n\n" +
        "VITE_GOOGLE_CLIENT_ID=\"your-client-id.apps.googleusercontent.com\"\n\n" +
        "Click 'OK' to login with the default testing account now, or 'Cancel' to close."
      );
      if (!confirmSetup) return new Promise(() => {});
      
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'google_user@testone.com', name: 'Google User' })
      });
      const data = await res.json();
      localStorage.setItem('pb_auth_token', data.token);
      localStorage.setItem('pb_auth_user', JSON.stringify(data.record));
      authStoreInstance.trigger();
      return data;
    }

    const redirectUri = window.location.origin;
    const scope = encodeURIComponent('openid email profile');
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${scope}`;
    window.location.href = oauthUrl;
    return new Promise(() => {});
  }
}

function handleGoogleCallback() {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash;
  if (!hash) return;

  const params: Record<string, string> = {};
  hash.substring(1).split('&').forEach(hk => {
    const temp = hk.split('=');
    if (temp.length === 2) {
      params[temp[0]] = decodeURIComponent(temp[1]);
    }
  });

  if (params.access_token) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    
    fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${params.access_token}`)
      .then(res => res.json())
      .then(async profile => {
        if (profile.email) {
          const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile.email,
              name: profile.name || profile.given_name,
              picture: profile.picture
            })
          });
          const data = await res.json();
          localStorage.setItem('pb_auth_token', data.token);
          localStorage.setItem('pb_auth_user', JSON.stringify(data.record));
          authStoreInstance.trigger();
        }
      })
      .catch(err => {
        console.error('Failed to authenticate with Google:', err);
      });
  }
}

handleGoogleCallback();

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith('pb_sync_')) {
      const collectionName = e.key.replace('pb_sync_', '');
      const list = MockCollection.subscribers[collectionName] || [];
      list.forEach(cb => cb({ action: 'change', record: {} }));
    }
  });
}

export const pb = {
  authStore: authStoreInstance,
  collection(name: string) {
    return new MockCollection(name);
  },
  admins: {
    async authWithPassword(email: string, password: any) {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Invalid admin credentials.');
      const data = await res.json();
      localStorage.setItem('pb_auth_token', data.token);
      localStorage.setItem('pb_auth_user', JSON.stringify(data.record));
      authStoreInstance.trigger();
      return data;
    }
  }
};
