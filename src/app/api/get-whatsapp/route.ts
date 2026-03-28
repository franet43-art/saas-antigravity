import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  
  // 1. Créer le client avec createServerClient
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  // 2. Vérifier l'authentification (getUser est plus sûr que getSession)
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 3. Extraire l'ID du profile depuis la requête (ex: via searchParams)
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get("id")

  if (!profileId) {
    return NextResponse.json({ error: "Profile ID required" }, { status: 400 })
  }

  // 4. Utiliser SERVICE_ROLE_KEY avec createClient direct (@supabase/supabase-js)
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await adminClient
    .from("freelance_contacts")
    .select("whatsapp_link")
    .eq("profile_id", profileId)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 })
  }

  return NextResponse.json({ whatsapp_link: data.whatsapp_link })
}
