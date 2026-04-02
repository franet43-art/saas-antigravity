import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Users } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 py-20 lg:py-32 bg-muted/30 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-primary animate-card-in">
            Le carrefour des talents numériques au Gabon
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-card-in" style={{ animationDelay: '150ms' }}>
            Trouvez les meilleurs freelances locaux pour vos projets web, design, marketing et bien plus.
            Ou proposez vos services et trouvez vos prochains clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-card-in" style={{ animationDelay: '300ms' }}>
            <Button asChild size="lg" className="w-full sm:w-auto text-base hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200">
              <Link href="/freelances">Voir le catalogue</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200">
              <Link href="/signup">Proposer mes services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reassurance Blocks */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir GabWork ?</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm h-full">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Talents Locaux</h3>
                <p className="text-muted-foreground">
                  Collaborez avec des experts basés au Gabon, comprenant parfaitement votre contexte et votre marché.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm h-full">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mise en relation directe</h3>
                <p className="text-muted-foreground">
                  Contactez les freelances directement via WhatsApp d'un simple clic. Pas d'intermédiaire, pas de perte de temps.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border shadow-sm h-full">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Profils Vérifiés</h3>
                <p className="text-muted-foreground">
                  Chaque profil est soumis à validation avant d'apparaître dans le catalogue.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Vous êtes freelance au Gabon ?</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Rejoignez notre plateforme gratuitement, gagnez en visibilité et développez votre clientèle locale et internationale.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base font-semibold hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200">
            <Link href="/signup">Rejoindre GabWork</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
