import { auth } from "@/auth";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, MapPin, Phone, Mail, Sparkles, Heart, Leaf } from "lucide-react";

export default async function Home() {
  const session = await auth();

  const services = [
    {
      title: "Signature Relaxation Massage",
      description: "Tailored full-body massage with aromatherapeutic botanicals to dissolve tension and restore balance.",
      duration: "60 min",
      price: "From KES 18,000",
      image: "/image6.jpg"
    },
    {
      title: "Regenerative Facial Ritual",
      description: "Advanced facial therapy pairing botanical actives with lymphatic sculpting for a luminous glow.",
      duration: "45 min",
      price: "From KES 14,500",
      image: "/spa-2.jpg"
    },
    {
      title: "Basalt Stone Therapy",
      description: "Heated basalt stones and skilled techniques to ease muscular fatigue and encourage deep calm.",
      duration: "75 min",
      price: "From KES 22,500",
      image: "/spa-treatment.jpg"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Absolutely amazing experience! The staff was professional and the atmosphere was so relaxing. I left feeling completely rejuvenated."
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "Best spa in the city! The hot stone massage was incredible. I'll definitely be coming back regularly."
    },
    {
      name: "Emma Davis",
      rating: 5,
      text: "Golden Hands Spa exceeded all my expectations. The attention to detail and quality of service is unmatched."
    }
  ];

  const experienceHighlights = [
    {
      title: "Intuitive bodywork",
      description: "Therapists conduct a sensory reading before every session to sync pressure, rhythm, and breathwork.",
      icon: Heart
    },
    {
      title: "Botanical alchemy",
      description: "Kenyan marula, neroli, and baobab blends are cold-pressed in-house for maximum potency.",
      icon: Leaf
    },
    {
      title: "Ritual sequencing",
      description: "Steam, exfoliation, sculpting, and guided rest are layered just like in the lounge pictured above.",
      icon: Sparkles
    }
  ];

const experiencePerks = [
    "Warm basalt welcome for circulation",
    "Aromatherapy tea pairing on departure",
    "Personalized after-care notes via email"
  ];

  const teamHighlights = [
    {
      label: "Spa Team",
      title: "Same-day scheduling",
      description: "WhatsApp confirmations and discreet reminders.",
      icon: Phone
    },
    {
      label: "Arrival",
      title: "Chauffeur-friendly drop-off",
      description: "Private entry at Swiss Lenana Mount Hotel, level 4.",
      icon: MapPin
    },
    {
      label: "Follow-up",
      title: "Post-treatment care",
      description: "Skin + muscle recommendations sent within 24 hours.",
      icon: Mail
    }
  ];

  const heroImage = {
    src: "/hero.png",
    alt: "Luxurious spa treatment lounge bathed in warm ambient lighting",
    blurDataURL:
      "data:image/webp;base64,UklGRtgBAABXRUJQVlA4IMwBAABQCgCdASowACQAPu1sr0+ppiSiJzgMkTAdiWMAwg7xta215tfltabNpIpPBodPgO5k8yPY2QLbH5BGJD2phXq49dCJvJBkuzXTI/leLlJtefb3bwg0EqRl2nwoAP7o7+wJQPtGf6gLzqA8PZTn0Uzn72IXQitrQEWV+IrWPOiLzKLeXKVHWb5kVKCmclSka6MP/dRXLk3JOcvfoKloXOtseEEO7dZYw7PWsk1zXHUNHuWqhGqt7RglZaM1rU7E9I/NRU0okIUayNtDLNwkaqotzj2qBCP+VzmBw2S1fuXfJeK5sPMBgo+SMxLTEYHIQccuzX1MDXOD1ZIA9ftXIjjcR+0Joyzqy3w20SJMaBuaIeSbyySouy54+4Dlr0X45yf/3uOz1tQREWZl0tn6HpyPiNAljNE7frKyszWXBCCdDStrhP5a3JcPr5ADsW4u+hF5PVhKvpAyBcG1/eeBmN+QgXILB3hlXBhuDp55XZQcNGc9D0gTHas/kyKWFKUuCXidDhIH7ymFHgKwga5waG8QLjXiOaqsESceFKN1Tou6IcczcEqS0owbN0Wk9CKyQA62JKSG5g2+58Gu/wJ4ic5NW5fIpwhv+UggAAAA"
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_45%] sm:object-[50%_40%] md:object-[50%_38%] lg:object-[50%_32%]"
            priority
            placeholder="blur"
            blurDataURL={heroImage.blurDataURL}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-amber-900/30"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-4 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-6">Golden Hands Spa | Kilimani</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">
              Unwind in Nairobi&apos;s golden sanctuary
            </h1>
            <p className="text-lg md:text-2xl mb-10 text-gray-100 max-w-3xl">
              Sink into the candlelit relaxation lounge pictured here, where warm amber lighting, plush textures,
              and curated botanicals signal it&apos;s time to breathe deeper and reset.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-6xl mx-auto px-4">
            <Link href="/services">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                View Treatment Menu
              </Button>
            </Link>
            {session ? (
              <Link href="/bookings">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-amber-800 px-8 py-3 text-lg">
                  Reserve Your Appointment
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-amber-800 px-8 py-3 text-lg">
                  Create Client Account
                </Button>
              </Link>
            )}
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white backdrop-blur">
              <div className="flex items-center gap-3 text-amber-200">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm uppercase tracking-wide">Pictured Mood</span>
              </div>
              <p className="mt-3 text-lg font-semibold">Amber-lit Tranquility Lounge</p>
              <p className="text-sm text-gray-200">Evening experience setup with artisanal tea and calming soundscape.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white backdrop-blur">
              <div className="flex items-center gap-3 text-amber-200">
                <Heart className="h-5 w-5" />
                <span className="text-sm uppercase tracking-wide">Therapists</span>
              </div>
              <p className="mt-3 text-lg font-semibold">Accredited touch artists</p>
              <p className="text-sm text-gray-200">Every session begins with a sensory reading to tailor pressure and pace.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white backdrop-blur">
              <div className="flex items-center gap-3 text-amber-200">
                <Leaf className="h-5 w-5" />
                <span className="text-sm uppercase tracking-wide">Botanicals</span>
              </div>
              <p className="mt-3 text-lg font-semibold">Kenyan-grown calm</p>
              <p className="text-sm text-gray-200">Marula, baobab, and neroli infusions ground you through every experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold tracking-[0.3em] text-amber-600 uppercase">About Us</p>
              <h2 className="text-4xl font-bold text-gray-900">
                Rooted in Kenyan wellness traditions, refined for the modern guest
              </h2>
              <p className="text-lg text-gray-600">
                Golden Hands Spa was founded by veteran therapists who believe that restoration starts with intentional touch,
                locally sourced botanicals, and environments that encourage deep calm.
              </p>
              <p className="text-lg text-gray-600">
                From private suites to bespoke treatment experiences, every detail is calibrated to help you disconnect, breathe,
                and reconnect with your best self.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-amber-600">15+</p>
                  <p className="text-gray-500">Years of holistic therapy experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-600">3,000+</p>
                  <p className="text-gray-500">Personalized experiences delivered</p>
                </div>
              </div>

              <blockquote className="border-l-4 border-amber-200 pl-5 text-gray-600 italic">
                &ldquo;Our Nairobi lounge is intentionally intimate so every guest can ground, sip warm botanicals, and feel seen.&rdquo;
              </blockquote>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-900">Malaika Njoroge</p>
                  <p className="text-sm text-gray-500">Founder & lead somatic therapist</p>
                </div>
                <div className="h-px flex-1 bg-amber-200 sm:ml-6"></div>
              </div>
            </div>

            <div className="relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-200/60">
              <Image
                src="/about.png"
                alt="Golden Hands therapist guiding a calming experience"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <div>
              <p className="text-sm font-semibold tracking-[0.35em] text-amber-600 uppercase mb-4">Signature Tenets</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">The Golden Hands Spa Difference</h2>
              <p className="text-lg text-gray-600">
                We blend Kenyan heritage botanicals with evidence-based bodywork. The same sensorial cues from our lounge: warm light,
                gentle percussion, curated playlists carry through every private suite.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {experienceHighlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div
                      key={highlight.title}
                      className="p-6 rounded-2xl bg-white shadow-sm border border-amber-100/70 hover:border-amber-200 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-amber-600" />
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{highlight.title}</p>
                      <p className="mt-2 text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-b from-amber-100/80 to-white shadow-xl border border-amber-200/80 p-10 space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-3">Spa Scorecard</p>
                <h3 className="text-2xl font-semibold text-gray-900">An experience for every nervous system</h3>
                <p className="text-gray-600 mt-3">
                  From decompressing executives to pre-wedding glow experiences, we pinpoint what your body needs before it needs it.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-4xl font-bold text-amber-700">9.7/10</p>
                  <p className="text-sm text-gray-500">Guest tranquility rating (past 90 days)</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-amber-700">42</p>
                  <p className="text-sm text-gray-500">Bespoke experiences crafted weekly</p>
                </div>
              </div>

              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-600"></span>
                  Aromatherapy is paired to your current mood and intention.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-600"></span>
                  Soundscapes change as therapists move from activation to deep calm.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-600"></span>
                  After-care kits extend the glow long after you leave the lounge.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Treatment Menu</p>
            <h2 className="text-4xl font-bold text-gray-900">Our Signature Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from restorative massages, regenerative facials, and grounding body journeys that mirror the warmth of our lounge.
            </p>

            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
              {["Massages", "Facials", "Body Rituals", "Couple Suites"].map((label) => (
                <span key={label} className="px-4 py-2 rounded-full bg-white text-amber-700 border border-amber-200">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:-translate-y-1 transition-all hover:shadow-2xl border-0">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <span className="absolute bottom-4 left-4 text-xs tracking-[0.5em] text-white uppercase">
                    {`Ritual ${String(index + 1).padStart(2, "0")}`}
                  </span>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm uppercase font-semibold text-amber-600 mb-1">Golden Hands Exclusive</p>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                    <div className="text-lg font-semibold text-amber-600">{service.price}</div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-100 flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Includes guided breathwork + heated neck compress
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid lg:grid-cols-[2fr_1fr] gap-6 items-stretch">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
              <p className="text-sm uppercase tracking-[0.35em] text-amber-600">All experiences include</p>
              <div className="mt-6 grid sm:grid-cols-3 gap-5 text-gray-700">
                {experiencePerks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                    <p>{perk}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-amber-600 text-white p-8 space-y-4 shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Need guidance?</p>
              <h3 className="text-2xl font-semibold">Our team will build an experience path for you.</h3>
              <p className="text-sm text-amber-100">
                Share your goals (deep rest, glow, recovery) and we&apos;ll recommend the perfect pairing in under 15 minutes.
              </p>
              <Link href="/services">
                <Button size="lg" className="bg-white text-amber-700 w-full hover:bg-amber-100">
                  View Full Menu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Client Reflections</p>
            <h2 className="text-4xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From first-time guests to long-time members, every testimonial was shared after lounging beneath the same ambient glow in our hero image.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-14">
            <div className="px-8 py-6 rounded-3xl bg-amber-50 border border-amber-100 text-center">
              <p className="text-4xl font-bold text-amber-600">4.98/5</p>
              <p className="text-sm text-gray-600">Average relaxation rating</p>
            </div>
            <div className="px-8 py-6 rounded-3xl bg-white border border-gray-100 text-center shadow-sm">
              <p className="text-4xl font-bold text-gray-900">72%</p>
              <p className="text-sm text-gray-600">Guests book multi-session journeys</p>
            </div>
            <div className="px-8 py-6 rounded-3xl bg-amber-600 text-white text-center shadow-lg">
              <p className="text-4xl font-bold">15</p>
              <p className="text-sm text-amber-100">Languages spoken by therapists</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border border-amber-100 shadow-md bg-white/90 backdrop-blur">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Verified Guest</span>
                  </div>
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Visit + Concierge</p>
            <h2 className="text-4xl font-bold text-gray-900">Plan Your Visit</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Private suites, gracious hospitality, and seamless spa team support to match the glow you see in our hero lounge.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-stretch">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">Kilimani - Swiss Lenana Mount Hotel, 4th Floor (private wing)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600">0719369088</p>
                      <p className="text-sm text-gray-500">WhatsApp & calls, 09:00 - 21:00 daily</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">info@ghwellnessafrica.com</p>
                      <p className="text-sm text-gray-500">Concierge replies within 2 working hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Hours</h3>
                      <p className="text-gray-600">Daily: 09:00 - 21:00 (last booking 20:00)</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  {session ? (
                    <Link href="/bookings">
                      <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                        Reserve Your Appointment
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/register">
                      <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                        Create Client Account
                      </Button>
                    </Link>
                  )}
                  <Link href="/services">
                    <Button size="lg" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                      Explore Menu
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {teamHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="p-4 rounded-2xl bg-white/70 border border-amber-100 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.4em] text-amber-500 mb-2">{item.label}</p>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                          <Icon className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[420px]">
              <Image
                src="/image5.png"
                alt="Spa Interior"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60"></div>
              <div className="absolute bottom-0 p-8 text-white space-y-2">
                <p className="text-sm uppercase tracking-[0.4em] text-amber-200">Inside the lounge</p>
                <p className="text-2xl font-semibold">Sunset-ready suites with candlelight + custom playlists.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
