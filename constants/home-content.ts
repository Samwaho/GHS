import { LucideIcon, Clock, Heart, Leaf, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { HomeContentData, HomeIconName } from "@/schemas/home-content";

export const HOME_CONTENT_SLUG = "main";

export const homeIconMap: Record<HomeIconName, LucideIcon> = {
  Sparkles,
  Heart,
  Leaf,
  Phone,
  MapPin,
  Mail,
  Clock,
};

export const defaultHomeContent: HomeContentData = {
  hero: {
    eyebrow: "Golden Hands Spa | Kilimani",
    title: "Unwind in Nairobi's golden sanctuary",
    description:
      "Sink into the candlelit relaxation lounge pictured here, where warm amber lighting, plush textures, and curated botanicals signal it's time to breathe deeper and reset.",
    image: {
      url: "/image8.jpeg",
      alt: "Luxurious spa treatment lounge bathed in warm ambient lighting",
      blurDataURL:
        "data:image/webp;base64,UklGRtgBAABXRUJQVlA4IMwBAABQCgCdASowACQAPu1sr0+ppiSiJzgMkTAdiWMAwg7xta215tfltabNpIpPBodPgO5k8yPY2QLbH5BGJD2phXq49dCJvJBkuzXTI/leLlJtefb3bwg0EqRl2nwoAP7o7+wJQPtGf6gLzqA8PZTn0Uzn72IXQitrQEWV+IrWPOiLzKLeXKVHWb5kVKCmclSka6MP/dRXLk3JOcvfoKloXOtseEEO7dZYw7PWsk1zXHUNHuWqhGqt7RglZaM1rU7E9I/NRU0okIUayNtDLNwkaqotzj2qBCP+VzmBw2S1fuXfJeK5sPMBgo+SMxLTEYHIQccuzX1MDXOD1ZIA9ftXIjjcR+0Joyzqy3w20SJMaBuaIeSbyySouy54+4Dlr0X45yf/3uOz1tQREWZl0tn6HpyPiNAljNE7frKyszWXBCCdDStrhP5a3JcPr5ADsW4u+hF5PVhKvpAyBcG1/eeBmN+QgXILB3hlXBhuDp55XZQcNGc9D0gTHas/kyKWFKUuCXidDhIH7ymFHgKwga5waG8QLjXiOaqsESceFKN1Tou6IcczcEqS0owbN0Wk9CKyQA62JKSG5g2+58Gu/wJ4ic5NW5fIpwhv+UggAAAA",
    },
    highlights: [
      {
        eyebrow: "Pictured Mood",
        title: "Amber-lit Tranquility Lounge",
        description: "Evening experience setup with artisanal tea and calming soundscape.",
        icon: "Sparkles",
      },
      {
        eyebrow: "Therapists",
        title: "Accredited touch artists",
        description: "Every session begins with a sensory reading to tailor pressure and pace.",
        icon: "Heart",
      },
      {
        eyebrow: "Botanicals",
        title: "Kenyan-grown calm",
        description: "Marula, baobab, and neroli infusions ground you through every experience.",
        icon: "Leaf",
      },
    ],
    primaryCta: {
      label: "View Treatment Menu",
      href: "/services",
    },
    authenticatedCta: {
      label: "Reserve Your Appointment",
      href: "/bookings",
    },
    guestCta: {
      label: "Create Client Account",
      href: "/auth/register",
    },
  },
  about: {
    eyebrow: "About Us",
    title: "Rooted in Kenyan wellness traditions, refined for the modern guest",
    paragraphs: [
      "Golden Hands Spa was founded by veteran therapists who believe that restoration starts with intentional touch, locally sourced botanicals, and environments that encourage deep calm.",
      "From private suites to bespoke treatment experiences, every detail is calibrated to help you disconnect, breathe, and reconnect with your best self.",
    ],
    stats: [
      { value: "15+", label: "Years of holistic therapy experience" },
      { value: "3,000+", label: "Personalized experiences delivered" },
    ],
    quote:
      "Our Nairobi lounge is intentionally intimate so every guest can ground, sip warm botanicals, and feel seen.",
    attribution: "Golden Hands Spa",
    image: {
      url: "/about.png",
      alt: "Golden Hands therapist guiding a calming experience",
    },
  },
  features: {
    eyebrow: "Signature Tenets",
    title: "The Golden Hands Spa Difference",
    description:
      "We blend Kenyan heritage botanicals with evidence-based bodywork. The same sensorial cues from our lounge: warm light, gentle percussion, curated playlists carry through every private suite.",
    highlights: [
      {
        title: "Intuitive bodywork",
        description: "Therapists conduct a sensory reading before every session to sync pressure, rhythm, and breathwork.",
        icon: "Heart",
      },
      {
        title: "Botanical alchemy",
        description: "Kenyan marula, neroli, and baobab blends are cold-pressed in-house for maximum potency.",
        icon: "Leaf",
      },
      {
        title: "Ritual sequencing",
        description: "Steam, exfoliation, sculpting, and guided rest are layered just like in the lounge pictured above.",
        icon: "Sparkles",
      },
    ],
    scorecard: {
      eyebrow: "Spa Scorecard",
      title: "An experience for every nervous system",
      description:
        "From decompressing executives to pre-wedding glow experiences, we pinpoint what your body needs before it needs it.",
      stats: [
        { value: "9.7/10", label: "Guest tranquility rating (past 90 days)" },
        { value: "42", label: "Bespoke experiences crafted weekly" },
      ],
      bullets: [
        "Aromatherapy is paired to your current mood and intention.",
        "Soundscapes change as therapists move from activation to deep calm.",
        "After-care kits extend the glow long after you leave the lounge.",
      ],
    },
  },
  servicesSection: {
    eyebrow: "Treatment Menu",
    title: "Our Signature Services",
    description:
      "Select from restorative massages, regenerative facials, and grounding body journeys that mirror the warmth of our lounge.",
    tags: ["Massages", "Facials", "Body Rituals", "Couple Suites"],
    services: [
      {
        title: "Signature Relaxation Massage",
        description:
          "Tailored full-body massage with aromatherapeutic botanicals to dissolve tension and restore balance.",
        duration: "60 min",
        price: "From KES 18,000",
        image: "/image6.jpg",
      },
      {
        title: "Regenerative Facial Ritual",
        description:
          "Advanced facial therapy pairing botanical actives with lymphatic sculpting for a luminous glow.",
        duration: "45 min",
        price: "From KES 14,500",
        image: "/spa-2.jpg",
      },
      {
        title: "Basalt Stone Therapy",
        description: "Heated basalt stones and skilled techniques to ease muscular fatigue and encourage deep calm.",
        duration: "75 min",
        price: "From KES 22,500",
        image: "/spa-treatment.jpg",
      },
    ],
    perksEyebrow: "All experiences include",
    perksTitle: "All experiences include",
    perks: [
      "Warm basalt welcome for circulation",
      "Aromatherapy tea pairing on departure",
      "Personalized after-care notes via email",
    ],
    highlightCard: {
      eyebrow: "Need guidance?",
      title: "Our team will build an experience path for you.",
      description: "Share your goals (deep rest, glow, recovery) and we'll recommend the perfect pairing in under 15 minutes.",
      button: {
        label: "View Full Menu",
        href: "/services",
      },
    },
  },
  testimonialsSection: {
    eyebrow: "Client Reflections",
    title: "What Our Clients Say",
    description:
      "From first-time guests to long-time members, every testimonial was shared after lounging beneath the same ambient glow in our hero image.",
    metrics: [
      { value: "4.98/5", label: "Average relaxation rating", variant: "light" },
      { value: "72%", label: "Guests book multi-session journeys", variant: "dark" },
      { value: "15", label: "Languages spoken by therapists", variant: "accent" },
    ],
    testimonials: [
      {
        name: "Sarah Johnson",
        rating: 5,
        text: "Absolutely amazing experience! The staff was professional and the atmosphere was so relaxing. I left feeling completely rejuvenated.",
      },
      {
        name: "Michael Chen",
        rating: 5,
        text: "Best spa in the city! The hot stone massage was incredible. I'll definitely be coming back regularly.",
      },
      {
        name: "Emma Davis",
        rating: 5,
        text: "Golden Hands Spa exceeded all my expectations. The attention to detail and quality of service is unmatched.",
      },
    ],
  },
  contactSection: {
    eyebrow: "Visit + Concierge",
    title: "Plan Your Visit",
    description:
      "Private suites, gracious hospitality, and seamless spa team support to match the glow you see in our hero lounge.",
    cards: [
      {
        title: "Address",
        description: "Kilimani - Swiss Lenana Mount Hotel, 4th Floor (private wing)",
        icon: "MapPin",
      },
      {
        title: "Phone",
        description: "0719369088",
        subtext: "WhatsApp & calls, 09:00 - 21:00 daily",
        icon: "Phone",
      },
      {
        title: "Email",
        description: "info@ghwellnessafrica.com",
        subtext: "Concierge replies within 2 working hours",
        icon: "Mail",
      },
      {
        title: "Hours",
        description: "Daily: 09:00 - 21:00 (last booking 20:00)",
        icon: "Clock",
      },
    ],
    ctas: {
      authenticated: {
        label: "Reserve Your Appointment",
        href: "/bookings",
      },
      guest: {
        label: "Create Client Account",
        href: "/auth/register",
      },
      secondary: {
        label: "Explore Menu",
        href: "/services",
      },
    },
    teamHighlights: [
      {
        label: "Spa Team",
        title: "Same-day scheduling",
        description: "WhatsApp confirmations and discreet reminders.",
        icon: "Phone",
      },
      {
        label: "Arrival",
        title: "Chauffeur-friendly drop-off",
        description: "Private entry at Swiss Lenana Mount Hotel, level 4.",
        icon: "MapPin",
      },
      {
        label: "Follow-up",
        title: "Post-treatment care",
        description: "Skin + muscle recommendations sent within 24 hours.",
        icon: "Mail",
      },
    ],
    image: {
      url: "/image5.png",
      alt: "Spa Interior",
      captionEyebrow: "Inside the lounge",
      captionTitle: "Sunset-ready suites with candlelight + custom playlists.",
    },
  },
};
