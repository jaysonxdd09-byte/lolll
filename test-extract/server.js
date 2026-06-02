import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// CORS configuration - allow all origins for API access
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Helper: read a collection JSON file
function readCollection(name) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

// Helper: write a collection JSON file
function writeCollection(name, data) {
  const filePath = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/:collection - get all records
app.get('/api/:collection', (req, res) => {
  const data = readCollection(req.params.collection);
  res.json(data);
});

// GET /api/:collection/:id - get single record
app.get('/api/:collection/:id', (req, res) => {
  const data = readCollection(req.params.collection);
  const record = data.find(r => r.id === req.params.id);
  if (!record) return res.status(404).json({ error: 'Not found' });
  res.json(record);
});

// POST /api/:collection - create a record
app.post('/api/:collection', (req, res) => {
  const data = readCollection(req.params.collection);
  const newRecord = {
    id: req.body.id || ('rec' + Math.random().toString(36).substring(2, 14).padEnd(12, '0')),
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    ...req.body,
  };
  data.push(newRecord);
  writeCollection(req.params.collection, data);
  res.status(201).json(newRecord);
});

// PUT /api/:collection/:id - update a record
app.put('/api/:collection/:id', (req, res) => {
  const data = readCollection(req.params.collection);
  const index = data.findIndex(r => r.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  data[index] = { ...data[index], ...req.body, updated: new Date().toISOString() };
  writeCollection(req.params.collection, data);
  res.json(data[index]);
});

// DELETE /api/:collection/:id - delete a record
app.delete('/api/:collection/:id', (req, res) => {
  let data = readCollection(req.params.collection);
  data = data.filter(r => r.id !== req.params.id);
  writeCollection(req.params.collection, data);
  res.json({ success: true });
});

// POST /api/auth/login - email login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readCollection('users');
  
  // Admin check
  if (email === 'admin@testone.com') {
    if (password !== 'admin_password_here') {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    let admin = users.find(u => u.email === 'admin@testone.com');
    if (!admin) {
      admin = { id: 'admin0000000001', email, role: 'admin', username: 'admin', created: new Date().toISOString(), updated: new Date().toISOString() };
      users.push(admin);
      writeCollection('users', users);
    }
    const token = 'token_' + Math.random().toString(36).substring(2);
    return res.json({ record: admin, token });
  }

  // Regular user - find or create
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: 'usr' + Math.random().toString(36).substring(2, 14).padEnd(12, '0'),
      email,
      username: email.split('@')[0],
      role: 'customer',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    users.push(user);
    writeCollection('users', users);
  }
  const token = 'token_' + Math.random().toString(36).substring(2);
  res.json({ record: user, token });
});

// POST /api/auth/google - save google user
app.post('/api/auth/google', (req, res) => {
  const { email, name, picture } = req.body;
  const users = readCollection('users');
  let user = users.find(u => u.email === email);
  if (!user) {
    user = {
      id: 'usr' + Math.random().toString(36).substring(2, 14).padEnd(12, '0'),
      email,
      name: name || 'Google User',
      username: email.split('@')[0],
      avatar: picture || '',
      role: 'customer',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    };
    users.push(user);
    writeCollection('users', users);
  }
  const token = 'google_token_' + Math.random().toString(36).substring(2);
  res.json({ record: user, token });
});

app.listen(PORT, HOST, () => {
  console.log(`\n  Data API server running at http://${HOST}:${PORT}`);
  console.log(`  Data stored in: ${DATA_DIR}\n`);
});
