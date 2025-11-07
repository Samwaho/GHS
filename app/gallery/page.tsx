import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Camera, Heart } from 'lucide-react';

const heroImage = {
  src: '/image5.png',
  alt: 'Golden Hands Spa interiors and treatment suites'
};

const galleryPillars = [
  {
    title: 'Spaces',
    description: 'Private suites, couples retreats, and tea lounges captured in golden hour light.'
  },
  {
    title: 'Textures',
    description: 'Botanicals, linen, basalt stones, and Kenyan craft that shape each experience.'
  },
  {
    title: 'People',
    description: 'Accredited therapists and team moments that make the experience personal.'
  }
];

export default function GalleryPage() {
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
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">Golden Hands Spa | Visual diary</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Step inside the candlelit calm before you arrive</h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            Explore treatment suites, botanical moments, and sensory design details captured throughout our Nairobi sanctuary.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/services">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Sparkles className="h-5 w-5 mr-2" />
                Book a visit
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white bg-white/10 hover:bg-white/20"
              >
                <Camera className="h-5 w-5 mr-2" />
                Schedule a tour
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          {galleryPillars.map((pillar) => (
            <div key={pillar.title} className="rounded-2xl bg-white shadow-lg border border-amber-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900">{pillar.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Gallery</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Scenes from Golden Hands Spa</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Every image is updated regularly to reflect current setups, ensuring you know exactly what awaits.
          </p>
        </div>

        <GalleryGrid />
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-gradient-to-r from-amber-600 to-amber-700 text-white p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200 mb-2">Love what you see?</p>
            <h3 className="text-3xl font-semibold mb-3">Turn any moment from our gallery into your next experience.</h3>
            <p className="text-amber-100">
              Send these vibes to someone special with a gift voucher or reserve your suite before it books out.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/gift-vouchers">
              <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-100">
                <Heart className="h-5 w-5 mr-2" />
                Share a gift
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:opacity-90">
                Reserve now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
