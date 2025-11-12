import { auth } from "@/auth";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, Sparkles } from "lucide-react";
import { getHomeContentData } from "@/lib/home-content";
import { homeIconMap } from "@/constants/home-content";
import type { HomeIconName } from "@/schemas/home-content";

const metricVariantClasses: Record<
  "light" | "dark" | "accent",
  { container: string; value: string; label: string }
> = {
  light: {
    container: "bg-amber-50 border border-amber-100 text-amber-600",
    value: "text-amber-600",
    label: "text-gray-600"
  },
  dark: {
    container: "bg-white border border-gray-100 text-gray-900 shadow-sm",
    value: "text-gray-900",
    label: "text-gray-600"
  },
  accent: {
    container: "bg-amber-600 text-white border border-amber-600 shadow-lg",
    value: "text-white",
    label: "text-amber-100"
  }
};

export default async function Home() {
  const session = await auth();
  const content = await getHomeContentData();
  const { hero, about, features, servicesSection, testimonialsSection, contactSection } = content;

  const renderIcon = (icon: HomeIconName, className: string) => {
    const Icon = homeIconMap[icon];
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <Navigation />
      <section className="relative min-h-[80vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image.url}
            alt={hero.image.alt}
            fill
            sizes="100vw"
            className="object-cover object-[50%_45%] sm:object-[50%_40%] md:object-[50%_38%] lg:object-[50%_32%]"
            priority
            placeholder={hero.image.blurDataURL ? "blur" : "empty"}
            blurDataURL={hero.image.blurDataURL}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-amber-900/30"></div>
        </div>

        <div className="relative z-10 w-full">
          <div className="max-w-6xl mx-auto px-4 text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-6">{hero.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white">{hero.title}</h1>
            <p className="text-lg md:text-2xl mb-10 text-gray-100 max-w-3xl">{hero.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start max-w-6xl mx-auto px-4">
            <Link href={hero.primaryCta.href}>
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                {hero.primaryCta.label}
              </Button>
            </Link>
            {session ? (
              <Link href={hero.authenticatedCta.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-amber-800 px-8 py-3 text-lg"
                >
                  {hero.authenticatedCta.label}
                </Button>
              </Link>
            ) : (
              <Link href={hero.guestCta.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-amber-800 px-8 py-3 text-lg"
                >
                  {hero.guestCta.label}
                </Button>
              </Link>
            )}
          </div>

          <div className="max-w-6xl mx-auto px-4 mt-12 grid md:grid-cols-3 gap-4">
            {hero.highlights.map((highlight) => {
              const Icon = homeIconMap[highlight.icon];
              return (
                <div key={highlight.title} className="bg-white/10 border border-white/20 rounded-2xl p-5 text-white backdrop-blur">
                  <div className="flex items-center gap-3 text-amber-200">
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="text-sm uppercase tracking-wide">{highlight.eyebrow}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold">{highlight.title}</p>
                  <p className="text-sm text-gray-200">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm font-semibold tracking-[0.3em] text-amber-600 uppercase">{about.eyebrow}</p>
              <h2 className="text-4xl font-bold text-gray-900">{about.title}</h2>
              {about.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-600">
                  {paragraph}
                </p>
              ))}

              <div className="grid sm:grid-cols-2 gap-6">
                {about.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-amber-600">{stat.value}</p>
                    <p className="text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <blockquote className="border-l-4 border-amber-200 pl-5 text-gray-600 italic">
                &ldquo;{about.quote}&rdquo;
              </blockquote>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="font-semibold text-gray-900">{about.attribution}</p>
                <div className="h-px flex-1 bg-amber-200 sm:ml-6"></div>
              </div>
            </div>

            <div className="relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl shadow-amber-200/60">
              <Image
                src={about.image.url}
                alt={about.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
            <div>
              <p className="text-sm font-semibold tracking-[0.35em] text-amber-600 uppercase mb-4">{features.eyebrow}</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{features.title}</h2>
              <p className="text-lg text-gray-600">{features.description}</p>

              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {features.highlights.map((highlight) => {
                  const Icon = homeIconMap[highlight.icon];
                  return (
                    <div
                      key={highlight.title}
                      className="p-6 rounded-2xl bg-white shadow-sm border border-amber-100/70 hover:border-amber-200 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                        {Icon && <Icon className="h-6 w-6 text-amber-600" />}
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
                <p className="text-sm uppercase tracking-[0.3em] text-amber-700 mb-3">{features.scorecard.eyebrow}</p>
                <h3 className="text-2xl font-semibold text-gray-900">{features.scorecard.title}</h3>
                <p className="text-gray-600 mt-3">{features.scorecard.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {features.scorecard.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-4xl font-bold text-amber-700">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 text-gray-700">
                {features.scorecard.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-600"></span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">{servicesSection.eyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-900">{servicesSection.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{servicesSection.description}</p>

            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
              {servicesSection.tags.map((label) => (
                <span key={label} className="px-4 py-2 rounded-full bg-white text-amber-700 border border-amber-200">
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {servicesSection.services.map((service, index) => (
              <Card key={service.title} className="overflow-hidden hover:-translate-y-1 transition-all hover:shadow-2xl border-0">
                <div className="relative h-48">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
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
              <p className="text-sm uppercase tracking-[0.35em] text-amber-600">{servicesSection.perksEyebrow}</p>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">{servicesSection.perksTitle}</h3>
              <div className="mt-6 grid sm:grid-cols-3 gap-5 text-gray-700">
                {servicesSection.perks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
                    <p>{perk}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-amber-600 text-white p-8 space-y-4 shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200">{servicesSection.highlightCard.eyebrow}</p>
              <h3 className="text-2xl font-semibold">{servicesSection.highlightCard.title}</h3>
              <p className="text-sm text-amber-100">{servicesSection.highlightCard.description}</p>
              <Link href={servicesSection.highlightCard.button.href}>
                <Button size="lg" className="bg-white text-amber-700 w-full hover:bg-amber-100">
                  {servicesSection.highlightCard.button.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">{testimonialsSection.eyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-900">{testimonialsSection.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{testimonialsSection.description}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-14">
            {testimonialsSection.metrics.map((metric) => {
              const variant = metricVariantClasses[metric.variant];
              return (
                <div key={metric.label} className={`px-8 py-6 rounded-3xl ${variant.container} text-center`}>
                  <p className={`text-4xl font-bold ${variant.value}`}>{metric.value}</p>
                  <p className={`text-sm ${variant.label}`}>{metric.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonialsSection.testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 border border-amber-100 shadow-md bg-white/90 backdrop-blur">
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
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-600">{contactSection.eyebrow}</p>
            <h2 className="text-4xl font-bold text-gray-900">{contactSection.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{contactSection.description}</p>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-stretch">
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-amber-100">
                <div className="space-y-6">
                  {contactSection.cards.map((card) => {
                    const Icon = homeIconMap[card.icon];
                    return (
                      <div key={card.title} className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          {Icon && <Icon className="h-5 w-5 text-amber-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{card.title}</h3>
                          <p className="text-gray-600">{card.description}</p>
                          {card.subtext && <p className="text-sm text-gray-500">{card.subtext}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href={(session ? contactSection.ctas.authenticated : contactSection.ctas.guest).href}>
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      {(session ? contactSection.ctas.authenticated : contactSection.ctas.guest).label}
                    </Button>
                  </Link>
                  <Link href={contactSection.ctas.secondary.href}>
                    <Button size="lg" variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
                      {contactSection.ctas.secondary.label}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {contactSection.teamHighlights.map((item) => (
                  <div key={item.title} className="p-4 rounded-2xl bg-white/70 border border-amber-100 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-500 mb-2">{item.label}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                        {renderIcon(item.icon, "h-4 w-4 text-amber-600")}
                      </div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[420px]">
              <Image
                src={contactSection.image.url}
                alt={contactSection.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60"></div>
              <div className="absolute bottom-0 p-8 text-white space-y-2">
                <p className="text-sm uppercase tracking-[0.4em] text-amber-200">{contactSection.image.captionEyebrow}</p>
                <p className="text-2xl font-semibold">{contactSection.image.captionTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
