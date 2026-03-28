import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-primary mb-6">
        GabWork
      </h1>
      <p className="max-w-[600px] text-muted-foreground text-xl mb-8">
        La plateforme de mise en relation entre freelances et clients au Gabon.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link href="/login">Se Connecter</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/signup">S'inscrire</Link>
        </Button>
      </div>
    </div>
  )
}
