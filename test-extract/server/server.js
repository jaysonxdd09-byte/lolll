const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbFile = './database.sqlite';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeTables();
  }
});

function initializeTables() {
  db.serialize(() => {
    // Products Table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT,
      price REAL DEFAULT 0,
      mrp REAL,
      mrp_box REAL,
      mrp_piece REAL,
      rate_box REAL,
      rate_piece REAL,
      category TEXT,
      brand TEXT,
      image TEXT,
      description TEXT,
      stock_quantity INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.5,
      created TEXT,
      updated TEXT
    )`);

    // Orders Table
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      customer_name TEXT,
      email TEXT,
      total_amount REAL,
      status TEXT,
      payment_id TEXT,
      shipping_address TEXT,
      phone TEXT,
      created TEXT,
      updated TEXT
    )`);

    // Hero Slides Table
    db.run(`CREATE TABLE IF NOT EXISTS hero_slides (
      id TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      image_url TEXT,
      order_index INTEGER,
      created TEXT,
      updated TEXT
    )`);

    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      name TEXT,
      role TEXT,
      created TEXT,
      updated TEXT
    )`);

    // Seed default data if empty
    seedData();
  });
}

function seedData() {
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (!err && row && row.count === 0) {
      console.log('Seeding initial products...');
      // We will leave seeding to the frontend for now, or just let the frontend push it if empty
    }
  });
}

// Generic CRUD endpoints

// Get all items in a collection
app.get('/api/:collection', (req, res) => {
  const collection = req.params.collection;
  const validCollections = ['products', 'orders', 'hero_slides', 'users'];
  if (!validCollections.includes(collection)) return res.status(400).json({ error: 'Invalid collection' });

  let query = `SELECT * FROM ${collection}`;
  const params = [];
  
  // Basic filtering implementation (like stock_quantity = 0)
  if (req.query.filter) {
    if (req.query.filter.includes('stock_quantity = 0')) {
      query += ' WHERE stock_quantity = 0';
    }
  }

  // Basic sorting implementation
  if (req.query.sort) {
    let sort = req.query.sort;
    const desc = sort.startsWith('-');
    const field = desc ? sort.slice(1) : sort;
    query += ` ORDER BY ${field} ${desc ? 'DESC' : 'ASC'}`;
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse numeric/JSON fields back to correct types if needed, SQLite returns everything as it was stored
    res.json(rows);
  });
});

// Get a single item
app.get('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const validCollections = ['products', 'orders', 'hero_slides', 'users'];
  if (!validCollections.includes(collection)) return res.status(400).json({ error: 'Invalid collection' });

  db.get(`SELECT * FROM ${collection} WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// Create an item
app.post('/api/:collection', (req, res) => {
  const collection = req.params.collection;
  const validCollections = ['products', 'orders', 'hero_slides', 'users'];
  if (!validCollections.includes(collection)) return res.status(400).json({ error: 'Invalid collection' });

  const data = req.body;
  if (!data.id) data.id = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  data.created = new Date().toISOString();
  data.updated = new Date().toISOString();

  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  const query = `INSERT INTO ${collection} (${keys.join(', ')}) VALUES (${placeholders})`;

  db.run(query, values, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        // Fallback to update if creating a duplicate ID (like an upsert)
        updateItem(collection, data.id, data, res);
      } else {
        return res.status(500).json({ error: err.message });
      }
    } else {
      res.json(data);
    }
  });
});

// Update an item
app.put('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const data = req.body;
  updateItem(collection, id, data, res);
});

function updateItem(collection, id, data, res) {
  const validCollections = ['products', 'orders', 'hero_slides', 'users'];
  if (!validCollections.includes(collection)) return res.status(400).json({ error: 'Invalid collection' });

  data.updated = new Date().toISOString();
  // Don't update id or created if they exist in body
  delete data.id;

  const keys = Object.keys(data);
  const values = Object.values(data);
  
  const setString = keys.map(k => `${k} = ?`).join(', ');
  const query = `UPDATE ${collection} SET ${setString} WHERE id = ?`;

  db.run(query, [...values, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      // If it didn't exist, we should maybe insert it, but PUT usually means it must exist
      // Since dbClient.ts uses upsert, we might need to handle it
      return res.status(404).json({ error: 'Record not found' });
    }
    data.id = id;
    res.json(data);
  });
}

// Delete an item
app.delete('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const validCollections = ['products', 'orders', 'hero_slides', 'users'];
  if (!validCollections.includes(collection)) return res.status(400).json({ error: 'Invalid collection' });

  db.run(`DELETE FROM ${collection} WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: this.changes > 0 });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});
