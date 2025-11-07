import { auth } from "@/auth";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Sparkles, Leaf, Heart } from "lucide-react";
import { ServicesClient } from "./services-client";

const heroImage = {
  src: "/image5.png",
  alt: "Private treatment suite layered with ambient lighting and botanicals"
};

const experienceCollections = [
  {
    title: "Relaxation Journeys",
    description: "Slow, rhythmic massages, heated basalt stones, and guided breathwork to reset your nervous system.",
    duration: "60 - 120 min",
    highlight: "Paired with candlelit lounge recovery",
    image: "/image6.jpg"
  },
  {
    title: "Facial Rituals",
    description: "Clinical-grade actives blended with Kenyan botanicals for sculpted, luminous skin.",
    duration: "45 - 90 min",
    highlight: "Includes lymphatic contouring and LED boost",
    image: "/spa-2.jpg"
  },
  {
    title: "Body Sculpt & Detox",
    description: "Exfoliation, wraps, and compression techniques to energize circulation and release heaviness.",
    duration: "75 - 120 min",
    highlight: "Herbal steam plus thermal contrast therapy",
    image: "/spa-treatment.jpg"
  }
];

const journeySteps = [
  {
    title: "Arrival experience",
    description: "Aromatherapy hand wash, warm tea pairing, and sensory reading set the tone.",
    icon: Sparkles
  },
  {
    title: "Tailored treatment",
    description: "Therapists adapt techniques, botanicals, and music to your intention.",
    icon: Leaf
  },
    {
      title: "Post-care team",
      description: "After-care notes, product pairings, and follow-up support within 24 hours.",
      icon: Heart
    }
];

export default async function ServicesPage() {
  const session = await auth();

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-amber-900/30" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-6">Golden Hands Spa | Treatment Menu</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Tailored experiences for every season of your body
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            Choose from curated massages, regenerative facials, and detoxifying body journeys inspired by the same lounge ambience you saw on our home page.
          </p>
        </div>
      </section>

      {/* Ritual Collections */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Curated Collections</p>
            <h2 className="text-4xl font-bold text-gray-900">Three pathways to instant calm</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every service in our menu fits within these experience families. Start here, then refine using the filters below.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {experienceCollections.map((collection) => (
              <div key={collection.title} className="group overflow-hidden rounded-3xl border border-amber-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition">
                <div className="relative h-56">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-xs tracking-[0.4em] text-white uppercase">
                    {collection.duration}
                  </p>
                </div>
                <div className="p-6 space-y-3 bg-white">
                  <h3 className="text-2xl font-semibold text-gray-900">{collection.title}</h3>
                  <p className="text-gray-600">{collection.description}</p>
                  <p className="text-sm text-amber-700 font-semibold">
                    {collection.highlight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Content */}
      <ServicesClient session={session} />

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-4">Concierge support</p>
            <h2 className="text-4xl font-bold mb-4">Need help pairing services?</h2>
            <p className="text-lg text-amber-100 mb-6">
              Share your intention (rest, glow, recovery) and we will curate a multi-treatment journey, complete with enhancements and timing recommendations.
            </p>
            <div className="flex flex-wrap gap-4">
              {session ? (
                <>
                  <Link href="/bookings">
                    <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                      <Calendar className="mr-2 h-5 w-5" />
                      Reserve a slot
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white bg-white/10 hover:bg-white/20"
                    >
                      Talk to our team
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/auth/register">
                  <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                    Create client account
                  </Button>
                </Link>
              )}
            </div>
          </div>
              <div className="bg-white/10 border border-white/30 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <Clock className="h-10 w-10 text-white" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Prime booking windows</p>
                <p className="text-2xl font-semibold">09:00 - 13:00 & 15:00 - 19:00</p>
              </div>
            </div>
            <p className="text-sm text-amber-100">
              Off-peak slots (after 19:00) available with team approval for couples or extended detox programs.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-4">Signature care</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What makes Golden Hands different?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Every service is choreographed end-to-end: from the aromatherapy greet to the music that plays during post-treatment grounding.
              </p>

              <div className="space-y-6">
                {journeySteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="flex gap-4 items-start">
                      <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                        <Icon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-gradient-to-br from-amber-100 to-white p-8 shadow-lg">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-700 mb-3">By the numbers</p>
                <p className="text-5xl font-bold text-amber-700">4.9/5</p>
                <p className="text-gray-600 mt-2">Average relaxation score from over 3,000 sessions.</p>
              </div>
              <div className="rounded-3xl border border-amber-100 p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-3">Therapist tenure</p>
                <p className="text-4xl font-bold text-gray-900">8+ yrs</p>
                <p className="text-gray-600 mt-2">Average experience per senior therapist.</p>
              </div>
              <div className="rounded-3xl border border-gray-100 p-8 sm:col-span-2">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-3">Enhancements</p>
                <p className="text-lg text-gray-700">
                  Add breathwork coaching, LED therapy, or herbal steam finishes to any service directly inside the booking flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
