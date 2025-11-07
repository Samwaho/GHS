import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import GiftVouchersClient from './gift-vouchers-client';
import { auth } from '@/auth';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Gift, Sparkles, Users } from 'lucide-react';

const heroImage = {
  src: '/image1.jfif',
  alt: 'Gift voucher with ribbons and spa botanicals'
};

const voucherHighlights = [
  {
    title: 'Corporate gifting',
    description: 'Appreciate teams or VIP clients with curated wellness experiences.'
  },
  {
    title: 'Milestones & celebrations',
    description: 'Birthdays, weddings, bridal parties, or postpartum reset journeys.'
  },
  {
    title: 'Self-care IOUs',
    description: 'Schedule recovery days for yourself and redeem when ready.'
  }
];

export default async function GiftVouchersPage() {
  const session = await auth();

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      <Navigation />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-amber-900/30" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">Golden Hands Spa | Gifting Studio</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Send instant serenity with beautifully designed gift vouchers
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            From curated experiences to bespoke amounts, our vouchers mirror the candlelit atmosphere and attention to detail your recipients deserve.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="#templates">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Gift className="h-5 w-5 mr-2" />
                Browse templates
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20"
              >
                <Users className="h-5 w-5 mr-2" />
                Corporate support team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {voucherHighlights.map((highlight) => (
            <div key={highlight.title} className="rounded-2xl bg-white shadow-lg border border-amber-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900">{highlight.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Digital & print vouchers</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose a template, personalize, send instantly</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every voucher can include a heartfelt message, wellness suggestions, and optional team follow-up for the recipient.
          </p>
        </div>

        <GiftVouchersClient session={session} />
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 text-white p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200 mb-2">Need a custom bundle?</p>
            <h3 className="text-3xl font-semibold mb-3">Concierge can design multi-session journeys and deliver physical gift boxes within Nairobi.</h3>
            <p className="text-amber-100">
              Share your budget, occasion, and delivery preference—we handle the rest.
            </p>
          </div>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
              <Sparkles className="h-5 w-5 mr-2" />
              Talk to our gifting team
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
