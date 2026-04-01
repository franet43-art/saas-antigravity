'use client';

import Link from 'next/link';

const WHATSAPP_NUMBER = '24174667596'; // Remplace par le vrai numéro support GabWork
const WHATSAPP_MESSAGE = encodeURIComponent('Bonjour, je souhaite en savoir plus sur GabWork.');

export default function WhatsAppFAB() {
  return (
    <Link
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter GabWork sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-7 h-7 md:w-8 md:h-8 fill-white">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.823.737 5.461 2.027 7.754L0 32l8.454-2.02A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.784-1.856l-.486-.29-5.02 1.2 1.234-4.893-.317-.503A13.234 13.234 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.778c-.398-.199-2.354-1.162-2.718-1.294-.364-.133-.63-.199-.895.199-.265.398-1.028 1.294-1.26 1.56-.232.265-.464.298-.862.1-.398-.199-1.68-.619-3.2-1.975-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.464.597-.696.199-.232.265-.398.398-.663.133-.265.066-.497-.033-.696-.1-.199-.895-2.158-1.227-2.955-.323-.775-.65-.67-.895-.683l-.762-.013c-.265 0-.696.1-1.06.497-.364.398-1.393 1.362-1.393 3.32s1.426 3.85 1.625 4.116c.199.265 2.805 4.283 6.796 6.006.95.41 1.692.655 2.27.839.954.304 1.822.261 2.509.158.765-.114 2.354-.963 2.686-1.893.332-.93.332-1.727.232-1.893-.099-.166-.364-.265-.762-.464z"/>
      </svg>
    </Link>
  );
}
