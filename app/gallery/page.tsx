import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import GalleryGrid from '@/components/gallery/GalleryGrid';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the beauty and tranquility of our spa through our carefully curated gallery. 
            Each image captures the essence of relaxation and luxury that awaits you.
          </p>
        </div>

        <GalleryGrid />
      </div>

      <Footer />
    </div>
  );
}
