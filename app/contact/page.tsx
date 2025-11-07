import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

const heroImage = {
  src: '/image4.jpg',
  alt: 'Golden Hands spa team welcoming guests at the reception'
};

const contactChannels = [
  {
    label: 'Call & WhatsApp',
    value: '0719 369 088',
    href: 'tel:0719369088',
    icon: Phone,
    description: 'Concierge available 09:00 - 21:00 EAT for bookings or questions.'
  },
  {
    label: 'Email',
    value: 'info@ghwellnessafrica.com',
    href: 'mailto:info@ghwellnessafrica.com',
    icon: Mail,
    description: 'We respond within two working hours.'
  },
  {
    label: 'Visit',
    value: 'Swiss Lenana Mount Hotel · 4th floor · Kilimani',
    icon: MapPin,
    description: 'Complimentary valet available with pre-booked appointments.'
  },
  {
    label: 'Hours',
    value: '09:00 - 21:00 daily',
    icon: Clock,
    description: 'Last appointment starts at 20:00 EAT.'
  }
];

export default function ContactPage() {
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
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">Golden Hands Spa | Concierge</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Reach our wellness spa team anytime
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            Book treatments, coordinate gifting, or plan private suites. Our team responds with the same grace you experience in person.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.label} className="rounded-2xl bg-white shadow-lg border border-amber-100 p-6 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{channel.label}</p>
                      {channel.href ? (
                        <Link href={channel.href} className="text-lg font-semibold text-gray-900 hover:text-amber-700 transition">
                          {channel.value}
                        </Link>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900">{channel.value}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{channel.description}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-6 sm:p-10 shadow-xl">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-3">Send us a note</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">We respond within two working hours</h2>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Full name" required />
                <Input type="email" placeholder="Email address" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Phone number" />
                <Input placeholder="Preferred date (optional)" />
              </div>
              <Textarea placeholder="How can we help you?" rows={5} required />
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Send message
              </Button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-amber-100 shadow-xl p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-2">Visit us</p>
            <h3 className="text-2xl font-semibold text-gray-900">Private suites in Kilimani</h3>
            <p className="text-gray-600 mt-3">
              Golden Hands Spa is located inside Swiss Lenana Mount Hotel (4th floor). Valet is available, and chauffeur drop-off is directly outside the private lift.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden h-64 relative">
            <Image
              src="/image5.png"
              alt="Golden Hands Spa exterior"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 30vw, 100vw"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-2">Parking & access</p>
            <p className="text-gray-600 text-sm">
              Complimentary parking with validation. Use the private lift marked “Golden Hands Spa” once inside the hotel foyer.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 text-white p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200 mb-2">Prefer instant replies?</p>
            <h3 className="text-3xl font-semibold mb-3">Our WhatsApp team will respond in under 10 minutes.</h3>
            <p className="text-amber-100">
              Send us your intention (deep rest, glow, recovery) and we will build a custom experience plan with enhancements tailored to you.
            </p>
          </div>
          <Link href="https://wa.me/254719369088">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
              Message on WhatsApp
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
