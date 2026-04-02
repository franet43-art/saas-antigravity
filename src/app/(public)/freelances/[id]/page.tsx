import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ChevronLeft, MessageCircle, Clock, User, ShieldCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, category, custom_category, bio, avatar_url')
    .eq('id', id)
    .eq('role', 'freelance')
    .eq('status', 'valide')
    .single();

  if (!profile) {
    return {
      title: 'Profil introuvable | GabWork',
      description: "Ce freelance n'existe pas ou n'est plus disponible.",
    };
  }

  const displayCategory = profile.category === 'Autre' && profile.custom_category 
    ? profile.custom_category 
    : profile.category;
  
  const title = `${profile.full_name || 'Freelance'} - ${displayCategory} | GabWork`;
  
  // Troncature intelligente de la bio
  const description = profile.bio 
    ? (profile.bio.length > 150 ? profile.bio.slice(0, 150) + '...' : profile.bio) 
    : `Découvrez le profil de ${profile.full_name}, expert en ${displayCategory} sur GabWork.`;
    
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      url: `${siteUrl}/freelances/${id}`,
      siteName: 'GabWork',
      images: [
        {
          url: profile.avatar_url || `${siteUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: `${profile.full_name} sur GabWork`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function FreelanceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Profile (Strict selection)
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, bio, category, custom_category, hourly_rate, avatar_url, banner_url')
    .eq('id', id)
    .eq('role', 'freelance')
    .eq('status', 'valide')
    .single();

  if (!profile) {
    notFound();
  }

  // 2. Auth Check & Contact Information (Login Wall)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const isConnected = !!user && !authError;

  let whatsappNumber = null;
  let portfolioUrl = null;
  if (isConnected) {
    // Only fetch contact info if user is authenticated
    const { data: contact } = await supabase
      .from('freelance_contacts')
      .select('whatsapp_number, portfolio_url')
      .eq('id', id)
      .single();
    
    whatsappNumber = contact?.whatsapp_number;
    portfolioUrl = contact?.portfolio_url;
  }

  const displayCategory = profile.category === 'Autre' && profile.custom_category 
    ? profile.custom_category 
    : profile.category;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Bannière */}
      <div className="w-full h-48 md:h-64 overflow-hidden bg-muted relative">
        <img
          src={profile.banner_url || '/og-default.png'}
          alt="Bannière"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Avatar flottant sur la bannière */}
        <div className="-mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden bg-muted">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'Avatar'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-primary">
        <Link href="/freelances">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Card */}
        <div className="flex-grow space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">Profil Vérifié</Badge>
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.full_name || 'Anonyme'}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {displayCategory || 'Secteur non défini'}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-bold border-b pb-2 mb-4">À propos</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.bio || "Ce freelance n'a pas encore ajouté de biographie."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <Card className="w-full md:w-80 border-primary/10 shadow-xl shadow-primary/5 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Offre</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tarif horaire</p>
                <p className="text-xl font-bold">
                  {profile.hourly_rate ? `${profile.hourly_rate.toLocaleString()} FCFA` : 'Sur devis'}
                  <span className="text-xs text-muted-foreground font-normal ml-1">/h</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Localisation</p>
                <p className="font-semibold text-sm">Libreville, Gabon</p>
              </div>
            </div>

            {isConnected && portfolioUrl && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ExternalLink className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">Portfolio</p>
                  <a
                    href={portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-sm text-primary hover:underline truncate block"
                  >
                    Voir les réalisations
                  </a>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="pt-2">
            {isConnected && whatsappNumber ? (
              <Button className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 animate-pulse-whatsapp" asChild>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contacter sur WhatsApp
                </a>
              </Button>
            ) : (
              <Button className="w-full h-12 gap-2 text-base font-bold shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200" asChild>
                <Link href={`/login?redirectTo=/freelances/${id}`}>
                  <MessageCircle className="h-5 w-5" />
                  Voir le contact WhatsApp
                </Link>
              </Button>
            )}
          </CardFooter>
          {!isConnected && (
            <div className="px-6 pb-6 pt-0">
              <p className="text-[10px] text-center text-muted-foreground italic">
                Connexion requise pour accéder aux contacts directs.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Sticky CTA mobile uniquement */}
      {isConnected && whatsappNumber && (
        <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-background border-t z-50">
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\+/g, '').replace(/\s/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 rounded-full text-base font-bold bg-green-600 hover:bg-green-700 text-white active:scale-95 transition-all duration-200 shadow-lg animate-pulse-whatsapp"
          >
            <MessageCircle className="h-5 w-5" />
            Contacter sur WhatsApp
          </a>
        </div>
      )}
      </div>
    </div>
  );
}
