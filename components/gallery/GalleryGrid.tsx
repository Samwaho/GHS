'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { buildUploadcareUrl, imageTransformations } from '@/lib/uploadcare';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageUuid?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = useTRPC();
  const { data: galleryItems, isLoading } = useQuery(
    t.public.getGalleryItems.queryOptions()
  );

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedImage(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (!galleryItems) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryItems[newIndex]);
  };

  const goToNext = () => {
    if (!galleryItems) return;
    const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryItems[newIndex]);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!galleryItems || galleryItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No gallery items available at the moment.</div>
        <p className="text-gray-400 mt-2">Please check back later for updates.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {galleryItems.map((item, index) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
            onClick={() => openLightbox(item, index)}
          >
            <CardContent className="p-0">
              <div className="aspect-square overflow-hidden relative">
                <Image
                  src={buildUploadcareUrl(item.imageUuid || '', imageTransformations.gallery)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full p-0 bg-black/90 border-none">
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            {galleryItems && galleryItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Image */}
            {selectedImage && (
              <div className="flex flex-col">
                <div className="relative min-h-[300px]">
                  <Image
                    src={buildUploadcareUrl(selectedImage.imageUuid || '', imageTransformations.large)}
                    alt={selectedImage.title}
                    fill
                    className="object-contain max-h-[80vh]"
                    unoptimized
                  />
                </div>
                
                {/* Image Info */}
                <div className="p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
                  {selectedImage.description && (
                    <p className="text-gray-300">{selectedImage.description}</p>
                  )}
                  {galleryItems && (
                    <p className="text-sm text-gray-400 mt-4">
                      {currentIndex + 1} of {galleryItems.length}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
