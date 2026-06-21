import { WHATSAPP_URL } from "@/lib/content";
import { MessageCircleIcon } from "@/components/icons";

export function WhatsAppButton() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-3 sm:px-5 bg-[#25D366] text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
      <MessageCircleIcon />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
