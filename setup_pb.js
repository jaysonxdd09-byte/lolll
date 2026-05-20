import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { products } from './src/data/products.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pbUrl = process.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.PB_ADMIN_EMAIL || 'admin@testone.com';
const adminPassword = process.env.PB_ADMIN_PASSWORD || 'admin_password_here';

const pb = new PocketBase(pbUrl);

function formatPbId(id) {
  if (id.length === 15) return id;
  const clean = id.replace(/[^a-zA-Z0-9]/g, '');
  if (clean.startsWith('to')) {
    const num = clean.substring(2);
    return 'to' + num.padStart(13, '0');
  }
  return 'prod' + clean.padStart(11, '0');
}

async function run() {
  console.log('--- REFORMATTING src/data/products.ts IDs ---');
  try {
    const productsPath = resolve(__dirname, 'src/data/products.ts');
    let productsContent = fs.readFileSync(productsPath, 'utf-8');
    
    // Find all patterns: id: '...' or id: "..."
    productsContent = productsContent.replace(/id:\s*['"]([^'"]+)['"]/g, (match, idVal) => {
      const formatted = formatPbId(idVal);
      return `id: '${formatted}'`;
    });
    
    fs.writeFileSync(productsPath, productsContent, 'utf-8');
    console.log('Successfully reformatted product IDs in src/data/products.ts');
  } catch (err) {
    console.error('Failed to reformat products.ts file:', err);
  }

  console.log(`Connecting to PocketBase at: ${pbUrl}`);
  try {
    console.log(`Authenticating as admin: ${adminEmail}`);
    await pb.admins.authWithPassword(adminEmail, adminPassword);
    console.log('Admin authenticated successfully!');
  } catch (err) {
    console.error('Failed to authenticate as admin. Make sure the admin account exists and credentials match .env.', err);
    process.exit(1);
  }

  // 1. Update users collection to include "role" field
  try {
    console.log('Checking "users" collection...');
    const usersCol = await pb.collections.getOne('users');
    const fields = usersCol.fields || [];
    const hasRole = fields.some(f => f.name === 'role');
    if (!hasRole) {
      console.log('Adding "role" field to users collection...');
      fields.push({
        name: 'role',
        type: 'text',
        options: {}
      });
      usersCol.fields = fields;
      await pb.collections.update('users', usersCol);
      console.log('Users collection updated successfully.');
    } else {
      console.log('Users collection already has "role" field.');
    }
  } catch (err) {
    console.error('Failed to update users collection:', err);
  }

  // 2. Helper to create collections if they don't exist
  const ensureCollection = async (name, schema, type = 'base') => {
    try {
      await pb.collections.getOne(name);
      console.log(`Collection "${name}" already exists.`);
    } catch {
      console.log(`Creating collection "${name}"...`);
      await pb.collections.create({
        name,
        type,
        fields: [
          // Base system fields (id, created, updated) are auto-created, we don't need to specify them here in newer versions of PB
          ...schema
        ],
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: ''
      });
      console.log(`Collection "${name}" created successfully.`);
    }
  };

  // Products collection schema
  const productsSchema = [
    { name: 'name', type: 'text', required: true },
    { name: 'category', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'stock_quantity', type: 'number' },
    { name: 'image', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'rating', type: 'number' },
    { name: 'brand', type: 'text' },
    { name: 'code', type: 'text' },
    { name: 'gst', type: 'text' },
    { name: 'mrp', type: 'number' }
  ];

  // Hero slides schema
  const heroSlidesSchema = [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'image_url', type: 'text' },
    { name: 'order_index', type: 'number' }
  ];

  // Orders schema
  const ordersSchema = [
    { name: 'user_id', type: 'text' },
    { name: 'customer_name', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'total_amount', type: 'number' },
    { name: 'status', type: 'text' },
    { name: 'shipping_address', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'payment_id', type: 'text' }
  ];

  // Order items schema
  const orderItemsSchema = [
    { name: 'order_id', type: 'text' },
    { name: 'product_id', type: 'text' },
    { name: 'quantity', type: 'number' },
    { name: 'unit_price', type: 'number' }
  ];

  await ensureCollection('products', productsSchema);
  await ensureCollection('hero_slides', heroSlidesSchema);
  await ensureCollection('orders', ordersSchema);
  await ensureCollection('order_items', orderItemsSchema);

  // 3. Seed products catalog
  console.log(`Found ${products.length} products to seed.`);
  for (const product of products) {
    try {
      const dbId = formatPbId(product.id);
      let existing;
      try {
        existing = await pb.collection('products').getOne(dbId);
      } catch {
        // Not found
      }

      const payload = {
        id: dbId,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        description: product.description,
        rating: product.rating,
        brand: product.brand,
        stock_quantity: product.stock_quantity,
        mrp: product.mrp || 0,
        code: product.code || '',
        gst: product.gst || '',
      };

      if (existing) {
        console.log(`Updating product: ${product.name} (${dbId})`);
        await pb.collection('products').update(dbId, payload);
      } else {
        console.log(`Creating product: ${product.name} (${dbId})`);
        await pb.collection('products').create(payload);
      }
    } catch (err) {
      console.error(`Failed to seed product ${product.name}:`, err.message || err);
    }
  }

  console.log('PocketBase setup and seeding completed successfully!');
}

run().catch(console.error);
