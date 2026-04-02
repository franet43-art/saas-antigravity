'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTransition, useState, useEffect, useCallback } from 'react';

const PLACEHOLDERS = [
  'Cherchez un développeur web...',
  'Cherchez un graphiste...',
  'Cherchez un vidéaste...',
  'Cherchez un comptable...',
  'Cherchez un marketeur...',
  'Cherchez un rédacteur...',
];

const STATIC_PLACEHOLDER = 'Rechercher par métier ou compétence...';
const TYPING_SPEED = 55;
const ERASING_SPEED = 30;
const PAUSE_DURATION = 2000;

function useAnimatedPlaceholder() {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const animate = useCallback(() => {
    if (isReducedMotion) return;

    const currentPhrase = PLACEHOLDERS[phraseIndex];
    let charIndex = 0;
    let isErasing = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (!isErasing) {
        // Typing
        charIndex++;
        setDisplayText(currentPhrase.slice(0, charIndex));
        if (charIndex < currentPhrase.length) {
          timeoutId = setTimeout(tick, TYPING_SPEED);
        } else {
          // Pause then erase
          timeoutId = setTimeout(() => {
            isErasing = true;
            tick();
          }, PAUSE_DURATION);
        }
      } else {
        // Erasing
        charIndex--;
        setDisplayText(currentPhrase.slice(0, charIndex));
        if (charIndex > 0) {
          timeoutId = setTimeout(tick, ERASING_SPEED);
        } else {
          // Move to next phrase
          setPhraseIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        }
      }
    }

    tick();
    return () => clearTimeout(timeoutId);
  }, [phraseIndex, isReducedMotion]);

  useEffect(() => {
    const cleanup = animate();
    return cleanup;
  }, [animate]);

  return isReducedMotion ? STATIC_PLACEHOLDER : displayText || '\u00A0';
}

export default function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState(searchParams.get('q')?.toString() || '');
  const animatedPlaceholder = useAnimatedPlaceholder();

  const handleSearch = (term: string) => {
    setInputValue(term);
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative max-w-xl mx-auto pt-6">
      <Search className={`absolute left-3 top-[calc(50%+12px)] -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none ${isPending ? 'opacity-50' : ''}`} />
      <Input 
        placeholder={inputValue ? '' : animatedPlaceholder}
        className="pl-10 h-12 shadow-sm rounded-full border-primary/20 bg-primary/5 focus-visible:ring-primary"
        value={inputValue}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}

