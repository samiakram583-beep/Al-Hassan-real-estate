import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StickyWhatsAppButton: React.FC = () => {
  const { businessSettings } = useApp();

  return (
    <a
      href={`https://wa.me/${businessSettings.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consult via WhatsApp"
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#23845B] text-white text-xs sm:text-sm font-semibold shadow-lg hover:bg-[#1B6B49] transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#102A43]"
    >
      <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span>WhatsApp Advisor</span>
    </a>
  );
};
