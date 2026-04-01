import https from 'https';

const url = 'https://ohzkzlixgocqgynbycqa.supabase.co/rest/v1/profiles?select=id,full_name,category,custom_category,hourly_rate,bio&role=eq.freelance&status=eq.valide&order=updated_at.desc';

const options = {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oemt6bGl4Z29jcWd5bmJ5Y3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE4NjUsImV4cCI6MjA5MDAzNzg2NX0.1hxGeuqE8_5Ev9fIRAmplcG3-HiEsoMiUwsi904TwZI',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oemt6bGl4Z29jcWd5bmJ5Y3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NjE4NjUsImV4cCI6MjA5MDAzNzg2NX0.1hxGeuqE8_5Ev9fIRAmplcG3-HiEsoMiUwsi904TwZI'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data));
});
