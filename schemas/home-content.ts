import { z } from "zod";

export const homeIconOptions = ["Sparkles", "Heart", "Leaf", "Phone", "MapPin", "Mail", "Clock"] as const;

export type HomeIconName = (typeof homeIconOptions)[number];

export const homeIconSchema = z.enum(homeIconOptions);

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const heroHighlightSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: homeIconSchema,
});

const heroSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.object({
    url: z.string().min(1),
    alt: z.string().min(1),
    blurDataURL: z.string().optional(),
    uuid: z.string().optional(),
  }),
  highlights: z.array(heroHighlightSchema).min(1),
  primaryCta: ctaSchema,
  authenticatedCta: ctaSchema,
  guestCta: ctaSchema,
});

const aboutSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  stats: z.array(
    z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
  quote: z.string().min(1),
  attribution: z.string().min(1),
  image: z.object({
    url: z.string().min(1),
    alt: z.string().min(1),
    uuid: z.string().optional(),
  }),
});

const featureHighlightSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: homeIconSchema,
});

const scorecardSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  stats: z.array(
    z.object({
      value: z.string().min(1),
      label: z.string().min(1),
    }),
  ),
  bullets: z.array(z.string().min(1)).min(1),
});

const featuresSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  highlights: z.array(featureHighlightSchema).min(1),
  scorecard: scorecardSchema,
});

const serviceCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  price: z.string().min(1),
  image: z.string().min(1),
});

const servicesSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)),
  services: z.array(serviceCardSchema).min(1),
  perksEyebrow: z.string().min(1),
  perksTitle: z.string().min(1),
  perks: z.array(z.string().min(1)).min(1),
  highlightCard: z.object({
    eyebrow: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    button: ctaSchema,
  }),
});

const testimonialMetricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  variant: z.enum(["light", "dark", "accent"]),
});

const testimonialSchema = z.object({
  name: z.string().min(1),
  rating: z.number().min(1).max(5),
  text: z.string().min(1),
});

const testimonialsSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  metrics: z.array(testimonialMetricSchema),
  testimonials: z.array(testimonialSchema),
});

const contactCardSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  subtext: z.string().optional(),
  icon: homeIconSchema,
});

const teamHighlightSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: homeIconSchema,
});

const contactSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  cards: z.array(contactCardSchema),
  ctas: z.object({
    authenticated: ctaSchema,
    guest: ctaSchema,
    secondary: ctaSchema,
  }),
  teamHighlights: z.array(teamHighlightSchema),
  image: z.object({
    url: z.string().min(1),
    alt: z.string().min(1),
    captionEyebrow: z.string().min(1),
    captionTitle: z.string().min(1),
    uuid: z.string().optional(),
  }),
});

export const homeContentSchema = z.object({
  hero: heroSchema,
  about: aboutSchema,
  features: featuresSchema,
  servicesSection: servicesSectionSchema,
  testimonialsSection: testimonialsSectionSchema,
  contactSection: contactSectionSchema,
});

export type HomeContentData = z.infer<typeof homeContentSchema>;
