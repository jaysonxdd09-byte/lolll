
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xutdjhwkzpgwuaxkbnxj.supabase.co';
const supabaseKey = 'sb_publishable_KcbVxiD7jCyBR2XAtI992Q_qPm5M3gA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
  // We can't directly check policies via JS client easily, but we can check if we can read the profile.
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session);
  
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error fetching profiles (likely RLS):', error);
  } else {
    console.log('Profiles data (if any):', data);
  }
}

checkPolicies();
