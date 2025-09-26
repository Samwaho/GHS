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
      title: "Relaxation Massage",
      description: "Unwind with our signature full-body massage designed to melt away stress and tension.",
      duration: "60 min",
      price: "From $120",
      image: "/IMG_0912.jpg"
    },
    {
      title: "Facial Treatment",
      description: "Rejuvenate your skin with our premium facial treatments using organic products.",
      duration: "45 min",
      price: "From $95",
      image: "/IMG_0913.JPG"
    },
    {
      title: "Hot Stone Therapy",
      description: "Experience deep relaxation with heated stones that soothe muscles and calm the mind.",
      duration: "75 min",
      price: "From $150",
      image: "/IMG_0919.JPG"
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

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/IMG_0248.JPG"
            alt="Spa Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Welcome to
            <span className="block text-amber-300">Golden Hands Spa</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Experience ultimate relaxation and rejuvenation in our luxurious spa sanctuary
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Explore Services
              </Button>
            </Link>
            {session ? (
              <Link href="/bookings">
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-amber-800 px-8 py-3 text-lg">
                  Book Now
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-800 px-8 py-3 text-lg">
                  Join Us
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Golden Hands Spa?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional spa experiences with premium services and personalized care
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Care</h3>
              <p className="text-gray-600">Our certified therapists provide personalized treatments tailored to your needs</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Products</h3>
              <p className="text-gray-600">We use only premium, organic products for all our treatments</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Experience</h3>
              <p className="text-gray-600">Immerse yourself in our tranquil environment designed for ultimate relaxation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Signature Services</h2>
            <p className="text-xl text-gray-600">Discover our range of premium spa treatments</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {service.duration}
                    </div>
                    <div className="text-lg font-semibold text-amber-600">{service.price}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Read testimonials from our satisfied customers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Us Today</h2>
            <p className="text-xl text-gray-600">Experience the ultimate in relaxation and wellness</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-amber-600 mr-4" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">123 Wellness Street, Spa District, City 12345</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-amber-600 mr-4" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-amber-600 mr-4" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">info@goldenhandsspa.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-amber-600 mr-4" />
                  <div>
                    <h3 className="font-semibold">Hours</h3>
                    <p className="text-gray-600">Mon-Sun: 9:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                {session ? (
                  <Link href="/bookings">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      Book Your Appointment
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                      Sign Up to Book
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/ead942cf-2ade-41ce-bd61-4976c7f7a66f.JPG"
                alt="Spa Interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
