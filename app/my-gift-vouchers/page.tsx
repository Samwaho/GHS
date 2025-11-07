import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import MyGiftVouchersClient from './my-gift-vouchers-client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Gift, Clock } from 'lucide-react';

const heroImage = {
  src: '/image6.jpg',
  alt: 'Guest opening a Golden Hands gift card'
};

export default async function MyGiftVouchersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

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
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">Golden Hands Spa | Voucher Wallet</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Track balances, expiry dates, and redemption history</h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            Keep every promise of rest in one place. Activate, redeem, or surprise someone else with unused vouchers.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/gift-vouchers">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Gift className="h-5 w-5 mr-2" />
                Buy another voucher
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20"
              >
                <Clock className="h-5 w-5 mr-2" />
                Extend validity
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Voucher wallet</p>
          <h2 className="text-3xl font-bold text-gray-900">Manage your gift vouchers</h2>
          <p className="text-gray-600 mt-2">Review balances, usage logs, and expiry reminders in one calm view.</p>
        </div>

        <MyGiftVouchersClient />
      </section>

      <Footer />
    </div>
  );
}
