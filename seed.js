import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';
import { products } from './src/data/products.ts';

dotenv.config();

const pbUrl = process.env.VITE_PB_URL || 'http://127.0.0.1:8090';
const adminEmail = process.env.PB_ADMIN_EMAIL;
const adminPassword = process.env.PB_ADMIN_PASSWORD;

const pb = new PocketBase(pbUrl);

async function seed() {
  console.log(`Connecting to PocketBase at: ${pbUrl}`);
  
  if (adminEmail && adminPassword) {
    try {
      console.log(`Attempting to authenticate admin: ${adminEmail}`);
      await pb.admins.authWithPassword(adminEmail, adminPassword);
      console.log('Authenticated successfully!');
    } catch (err) {
      console.warn('Failed to authenticate as admin. Proceeding with unauthenticated requests...', err);
    }
  } else {
    console.log('No PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD env vars found. Seeding without admin auth (requires collection API rules to allow inserts)...');
  }

  console.log(`Found ${products.length} products to seed.`);
  
  for (const product of products) {
    try {
      // Check if product already exists
      let existing;
      try {
        existing = await pb.collection('products').getOne(product.id);
      } catch {
        // Not found
      }

      const payload = {
        id: product.id,
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
        console.log(`Updating product: ${product.name} (${product.id})`);
        await pb.collection('products').update(product.id, payload);
      } else {
        console.log(`Creating product: ${product.name} (${product.id})`);
        await pb.collection('products').create(payload);
      }
    } catch (err: any) {
      console.error(`Failed to seed product ${product.name}:`, err.message || err);
    }
  }

  console.log('Seeding completed!');
}

seed().catch(console.error);
