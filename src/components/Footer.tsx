import Link from 'next/link';

export default function Footer() {
  const currentYear = 2026;
  return (
    <footer className="w-full border-t bg-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {currentYear} GabWork. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/cgu" className="hover:text-foreground transition-colors">Conditions Générales</Link>
          <Link href="/confidentialite" className="hover:text-foreground transition-colors">Confidentialité</Link>
          <a href="mailto:silvermakeia.99@gmail.com" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
