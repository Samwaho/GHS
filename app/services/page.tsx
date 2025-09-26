import { auth } from "@/auth";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star } from "lucide-react";
import { ServicesClient } from "./services-client";

export default async function ServicesPage() {
  const session = await auth();

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-amber-600 to-amber-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our Premium Services
          </h1>
          <p className="text-xl text-amber-100 max-w-3xl mx-auto">
            Discover our comprehensive range of luxury spa treatments designed to rejuvenate your body, mind, and spirit
          </p>
        </div>
      </section>

      {/* Services Content */}
      <ServicesClient session={session} />

      {/* Call to Action Section */}
      <section className="py-20 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Ultimate Relaxation?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Book your appointment today and let our expert therapists help you unwind and rejuvenate
          </p>
          {session ? (
            <Link href="/bookings">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg font-semibold">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Appointment
              </Button>
            </Link>
          ) : (
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg font-semibold">
                Sign Up to Book
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Golden Hands Spa?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing exceptional service and unforgettable experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Therapists</h3>
              <p className="text-gray-600">Certified professionals with years of experience</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book appointments that fit your busy lifestyle</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image src="/logo.png" alt="Premium" width={32} height={32} className="rounded-full" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Products</h3>
              <p className="text-gray-600">Only the finest organic and natural products</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking system available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
