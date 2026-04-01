"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  { value: "all", label: "Toutes les catégories" },
  { value: "Developpement", label: "Développement web/mobile" },
  { value: "Design", label: "Design & Graphisme" },
  { value: "Marketing", label: "Marketing & Réseaux sociaux" },
  { value: "Redaction", label: "Rédaction & Traduction" },
  { value: "Multimedia", label: "Vidéo & Photo" },
  { value: "Assistance", label: "Assistance virtuelle" },
  { value: "Comptabilite", label: "Comptabilité & Finance" },
  { value: "Autre", label: "Autre" }
];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <Select value={currentCategory} onValueChange={handleCategoryChange}>
      <SelectTrigger className="w-full sm:w-[280px] h-12 bg-background md:rounded-full">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        {CATEGORIES.map((cat) => (
          <SelectItem key={cat.value} value={cat.value}>
            {cat.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
