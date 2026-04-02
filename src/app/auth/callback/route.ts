import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const rawRedirect = searchParams.get('redirectTo') || '/dashboard';

  // Sécurité : empêcher les open redirects vers des sites externes
  const redirectTo = rawRedirect.startsWith('/') ? rawRedirect : '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid_link`);
}
