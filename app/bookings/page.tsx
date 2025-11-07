import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import BookingsClient from "./bookings-client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Sparkles, Clock } from "lucide-react";

const heroImage = {
  src: "/image4.jpg",
  alt: "Golden Hands therapist preparing a candlelit suite"
};

  const bookingTips = [
    {
      title: "Need to adjust?",
      description: "You can manage time, notes, and enhancements up to 12 hours before your booking starts."
    },
    {
      title: "Arrive early",
      description: "Plan to join us 15 minutes early for aromatherapy welcome tea and sensory calibration."
    },
    {
      title: "Enhancement add-ons",
      description: "Ask our team to layer LED glow boosts, breathwork, or steam circuits onto any experience."
    }
  ];

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-amber-900/20" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">
            Golden Hands Spa | Client Lounge
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Track every experience from booking to after-care
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            This dashboard keeps your upcoming visits, completed journeys, team notes, and enhancements in one serene place.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/services">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Sparkles className="h-5 w-5 mr-2" />
                Book another experience
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Talk to our team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tips row */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {bookingTips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl bg-white shadow-lg border border-amber-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bookings client */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Bookings</p>
            <h2 className="text-3xl font-bold text-gray-900">Your personalized schedule</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Kenya Standard Time (EAT)
          </div>
        </div>
        <BookingsClient />
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 text-white p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200 mb-2">
                Ready for your next escape?
              </p>
              <h3 className="text-3xl font-semibold mb-3">Extend the glow with your next booking.</h3>
              <p className="text-amber-100">
                Pair massages with facials or plan a detox day. Concierge can reserve multi-room suites for couples and groups.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services">
                <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                  Browse services
                </Button>
              </Link>
              <Link href="/gift-vouchers">
                <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:opacity-90">
                  Share a gift voucher
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
