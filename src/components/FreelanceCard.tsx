import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface FreelanceCardProps {
  id: string;
  full_name: string | null;
  category: string | null;
  custom_category: string | null;
  hourly_rate: number | null;
  bio: string | null;
}

export default function FreelanceCard({
  id,
  full_name,
  category,
  custom_category,
  hourly_rate,
  bio,
}: FreelanceCardProps) {
  // Logic category vs custom_category
  const displayCategory = category === 'Autre' && custom_category ? custom_category : category;

  // Bio truncation (max 100 chars) with null safety
  const truncatedBio = bio ? (bio.length > 100 ? `${bio.substring(0, 100)}...` : bio) : "Aucune biographie renseignée.";

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-primary/10 overflow-hidden group">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
              {full_name || 'Anonyme'}
            </CardTitle>
            <Badge variant="secondary" className="font-medium">
              {displayCategory || 'Secteur non défini'}
            </Badge>
          </div>
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <User className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-4">
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          &ldquo;{truncatedBio}&rdquo;
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t pt-4 bg-muted/5">
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-xs text-muted-foreground uppercase font-semibold">Tarif</span>
            <p className="text-lg font-bold text-primary">
              {hourly_rate ? `${hourly_rate.toLocaleString()} FCFA` : 'Sur devis'}
              <span className="text-xs font-normal text-muted-foreground ml-1">/h</span>
            </p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/freelances/${id}`}>Voir Profil</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
