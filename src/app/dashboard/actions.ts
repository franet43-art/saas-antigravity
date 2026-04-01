'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function upgradeToFreelance() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('profiles')
    .update({ role: 'freelance', status: 'en_attente' })
    .eq('id', user.id)

  redirect('/dashboard/profile')
}

export async function deleteAccount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Supprimer les données dans l'ordre
  await supabase.from('freelance_contacts').delete().eq('id', user.id)
  await supabase.from('profiles').delete().eq('id', user.id)

  // La suppression de l'utilisateur auth nécessite le service role
  // À compléter avec une Edge Function Supabase
}
