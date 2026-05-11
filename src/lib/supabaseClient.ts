import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xutdjhwkzpgwuaxkbnxj.supabase.co';
const supabaseAnonKey = 'sb_publishable_KcbVxiD7jCyBR2XAtI992Q_qPm5M3gA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
