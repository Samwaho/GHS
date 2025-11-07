import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Gift Vouchers', href: '/gift-vouchers' }
];

const contactInfo = [
  { icon: Phone, text: '0719 369 088', href: 'tel:0719369088' },
  { icon: Mail, text: 'info@ghwellnessafrica.com', href: 'mailto:info@ghwellnessafrica.com' },
  { icon: MapPin, text: 'Swiss Lenana Mount Hotel, 4th Floor – Kilimani' }
];

export function Footer() {
  return (
    <footer className="bg-[#0f0a07] text-white pt-16 pb-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-amber-400">Golden Hands Spa</h3>
            <p className="text-gray-400">
              Nairobi&apos;s private sanctuary for curated wellness experiences. Candlelit suites, accredited therapists,
              and Kenyan botanicals for discerning guests.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-amber-400 transition">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook" className="hover:text-amber-400 transition">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-amber-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Visit & Contact</h4>
            <ul className="space-y-3 text-gray-400">
              {contactInfo.map((item, idx) => {
                const Icon = item.icon;
                const content = (
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 mt-0.5 text-amber-500" />
                    <span className="text-sm leading-relaxed">{item.text}</span>
                  </div>
                );

                if (item.href) {
                  return (
                    <li key={idx}>
                      <Link href={item.href} className="hover:text-amber-400 transition">
                        {content}
                      </Link>
                    </li>
                  );
                }

                return <li key={idx}>{content}</li>;
              })}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hours</h4>
            <div className="flex items-start gap-3 text-gray-400 text-sm">
              <Clock className="h-4 w-4 mt-0.5 text-amber-500" />
              <div>
                <p>Daily: 09:00 - 21:00</p>
                <p className="text-gray-500 mt-1">Last appointment 20:00 (EAT)</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/bookings">
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-full py-3 transition">
                  Reserve Your Suite
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Golden Hands Spa. All rights reserved.</p>
          <p className="mt-1">Crafted with calm in Kilimani, Nairobi.</p>
        </div>
      </div>
    </footer>
  );
}
