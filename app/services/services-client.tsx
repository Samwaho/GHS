'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Star, Calendar, Filter, Search, DollarSign } from 'lucide-react';
import { ExtendedUser } from '@/auth';
import BookingModal from '@/components/booking/booking-modal';

interface ServicesClientProps {
  session: { user: ExtendedUser } | null;
}

export function ServicesClient({ session }: ServicesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    serviceId: string;
    serviceTitle: string;
    serviceDuration: number;
  }>({
    isOpen: false,
    serviceId: '',
    serviceTitle: '',
    serviceDuration: 0
  });

  const t = useTRPC();
  const { data: services = [], isLoading: servicesLoading } = useQuery(
    t.public.getServices.queryOptions()
  );
  const { data: categories = [], isLoading: categoriesLoading } = useQuery(
    t.public.getCategories.queryOptions()
  );

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let filtered = services;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.categoryId === selectedCategory);
    }

    // Sort services
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b._count.bookings - a._count.bookings;
        });
      case 'price-low':
        return filtered.sort((a, b) => a.basePrice - b.basePrice);
      case 'price-high':
        return filtered.sort((a, b) => b.basePrice - a.basePrice);
      case 'duration-short':
        return filtered.sort((a, b) => a.duration - b.duration);
      case 'duration-long':
        return filtered.sort((a, b) => b.duration - a.duration);
      case 'name':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filtered;
    }
  }, [services, searchQuery, selectedCategory, sortBy]);

  if (servicesLoading || categoriesLoading) {
    return (
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters and Search */}
        <div className="mb-12 bg-white rounded-lg shadow-sm border p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category._count.services})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="duration-short">Duration: Short to Long</SelectItem>
                <SelectItem value="duration-long">Duration: Long to Short</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              {filteredAndSortedServices.length} service{filteredAndSortedServices.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredAndSortedServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all services
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || '/IMG_0912.jpg'}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {service.isPopular && (
                    <Badge className="absolute top-3 left-3 bg-amber-600 hover:bg-amber-700">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">
                      {service.category.name}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-amber-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration} min
                    </div>
                    <div className="flex items-center text-lg font-semibold text-amber-600">
                      <DollarSign className="h-4 w-4" />
                      KSH {service.basePrice}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {service._count.bookings} booking{service._count.bookings !== 1 ? 's' : ''}
                    </div>
                    
                    {session ? (
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700"
                        onClick={() => setBookingModal({
                          isOpen: true,
                          serviceId: service.id,
                          serviceTitle: service.title,
                          serviceDuration: service.duration
                        })}
                      >
                        <Calendar className="h-4 w-4 mr-1" />
                        Book Now
                      </Button>
                    ) : (
                      <Link href="/auth/register">
                        <Button size="sm" variant="outline">
                          Sign Up to Book
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Popular Services Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Most Popular Services</h2>
              <p className="text-lg text-gray-600">
                Discover our clients&apos; favorite treatments
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {services
                .filter(service => service.isPopular)
                .slice(0, 3)
                .map((service) => (
                  <Card key={`popular-${service.id}`} className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 to-white">
                    <div className="relative h-40">
                      <Image
                        src={service.image || '/IMG_0912.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-amber-600">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Popular Choice
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{service.duration} min</span>
                        <span className="font-semibold text-amber-600">KSH {service.basePrice}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        serviceId={bookingModal.serviceId}
        serviceTitle={bookingModal.serviceTitle}
        serviceDuration={bookingModal.serviceDuration}
      />
    </div>
  );
}
