import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react";
import { useApp } from "@/app/context/app-context";

export function Footer() {
  const { setCurrentPage } = useApp();

  return (
    <footer className="bg-gradient-to-r from-amber-900 to-amber-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Rizwan&apos;s Desi Ghee</h3>
          <p className="text-amber-100 text-sm">Pure, Traditional, Delicious - Handcrafted in Pakistan</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="text-amber-100 text-sm space-y-2">
            <li>
              <button onClick={() => setCurrentPage("home")} className="hover:text-amber-200 transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("shop")} className="hover:text-amber-200 transition">
                Shop
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage("about")} className="hover:text-amber-200 transition">
                About
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Contact</h3>
          <div className="text-amber-100 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>info@rizwansghee.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span>+92-300-1234567</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Lahore, Pakistan</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Follow Us</h3>
          <div className="flex gap-4 mb-4">
            <Facebook className="cursor-pointer hover:text-amber-200 transition" size={24} />
            <Instagram className="cursor-pointer hover:text-amber-200 transition" size={24} />
            <Twitter className="cursor-pointer hover:text-amber-200 transition" size={24} />
            <Youtube className="cursor-pointer hover:text-amber-200 transition" size={24} />
          </div>
        </div>
      </div>
      <div className="border-t border-amber-700 pt-8 text-center text-amber-100 text-sm">
        <p>&copy; 2026 Premium Desi Ghee. All rights reserved.</p>
      </div>
    </footer>
  );
}