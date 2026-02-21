import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import { useApp } from "@/app/context/app-context";

export function Footer() {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-[#5F6B3C] text-white py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Rizwan&apos;s Desi Ghee</h3>
          <p className="text-white/90 text-xs md:text-sm">Pure, Traditional, Delicious - Handcrafted in Pakistan</p>
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Quick Links</h3>
          <ul className="text-white/90 text-xs md:text-sm space-y-2">
            <li>
              <button onClick={() => setCurrentPage("home")} className="hover:text-white transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("shop")} className="hover:text-white transition">
                Shop
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("about")} className="hover:text-white transition">
                About
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Contact</h3>
          <div className="text-white/90 text-xs md:text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Mail size={16} className="flex-shrink-0" />
              <span className="break-all">info@rizwansghee.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="flex-shrink-0" />
              <span>+92-3287318269</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="flex-shrink-0" />
              <span>Lodhran, Pakistan</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4">Follow Us</h3>
          <div className="flex gap-3 md:gap-4 mb-4">
            <a
              href="https://www.facebook.com/share/1Kbks71ywD/"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our Facebook page"
            >
              <Facebook className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-white font-bold" size={20} />
            </a>
            <a
              href="https://www.instagram.com/dasiigee?utm_source=qr&igsh=MWc0Ymt5dHZlajI3eg=="
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our Instagram page"
            >
              <Instagram className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-white font-bold" size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@dasii.gee?_r=1&_t=ZS-941NbOW1pMm"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit our TikTok page"
            >
              <Music2 className="cursor-pointer transform transition-all duration-300 hover:scale-125 hover:text-white font-bold" size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 pt-8 text-center text-white/90 text-sm">
        <p>&copy; 2026 Rizwan&apos;s Desi Ghee. All rights reserved.</p>
      </div>
    </footer>
  );
}