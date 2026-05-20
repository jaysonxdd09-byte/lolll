import PocketBase from 'pocketbase';
import * as dotenv from 'dotenv';

dotenv.config();

const pb = new PocketBase('http://127.0.0.1:8090');

async function test() {
  await pb.admins.authWithPassword('admin@testone.com', 'admin_password_here');
  const usersCol = await pb.collections.getOne('users');
  console.log('Collection keys:', Object.keys(usersCol));
  console.log('Fields:', usersCol.fields || usersCol.schema);
}

test().catch(console.error);
