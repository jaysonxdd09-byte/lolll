
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = 'https://xutdjhwkzpgwuaxkbnxj.supabase.co';
const supabaseKey = 'sb_publishable_KcbVxiD7jCyBR2XAtI992Q_qPm5M3gA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  const { data, error } = await supabase.from('profiles').select('*').in('role', ['admin', 'staff']);
  if (error) {
    console.error('Error fetching profiles:', error);
  } else {
    console.log('Admin/Staff profiles:', data);
  }
}

checkAdmins();
