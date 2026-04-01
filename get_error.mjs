import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ohzkzlixgocqgynbycqa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oemt6bGl4Z29jcWd5bmJ5Y3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE4NjUsImV4cCI6MjA5MDAzNzg2NX0.1hxGeuqE8_5Ev9fIRAmplcG3-HiEsoMiUwsi904TwZI'
);

(async () => {
  let query = supabase
    .from('profiles')
    .select('id, full_name, category, custom_category, hourly_rate, bio')
    .eq('role', 'freelance')
    .eq('status', 'valide');

  const { data, error } = await query.order('updated_at', { ascending: false });

  if (error) {
    console.error('Supabase Error:', JSON.stringify(error, null, 2));
  }
})();
