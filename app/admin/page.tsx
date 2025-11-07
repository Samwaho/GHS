import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Image from 'next/image';
import { Shield, Users, Gift, BarChart3 } from 'lucide-react';

const adminHero = {
  src: '/image3.png',
  alt: 'Admin reviewing spa performance dashboards'
};

const adminHighlights = [
  {
    title: 'Team & therapists',
    description: 'Manage user roles, therapist rosters, and team permissions.',
    icon: Users
  },
  {
    title: 'Gift economy',
    description: 'Craft voucher templates, track usage, and surprise VIP guests.',
    icon: Gift
  },
  {
    title: 'Operational insights',
    description: 'Monitor bookings, utilization, and category performance.',
    icon: BarChart3
  }
];

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white min-h-screen">
      <Navigation />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={adminHero.src}
            alt={adminHero.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-amber-900/30" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-200 mb-5">
            Golden Hands Spa | Admin Console
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Orchestrate every touchpoint from one serene dashboard
          </h1>
          <p className="text-lg md:text-2xl text-gray-100 max-w-3xl">
            Oversee services, staff, bookings, gallery, and gifting flows with enterprise-grade control wrapped in spa-level calm.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white shadow-xl border border-amber-100 p-6 flex items-center gap-4">
            <Shield className="h-12 w-12 text-amber-600" />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Access level</p>
              <p className="text-xl font-semibold text-gray-900">Administrator</p>
            </div>
          </div>
          {adminHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl bg-white shadow-lg border border-amber-100 p-6">
                <Icon className="h-6 w-6 text-amber-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-600">Control center</p>
          <h2 className="text-3xl font-bold text-gray-900">Admin dashboard</h2>
          <p className="text-gray-600 mt-2">
            Switch between tabs to configure services, monitor gallery, manage branches, or craft gift vouchers.
          </p>
        </div>
        <AdminDashboard />
      </section>

      <Footer />
    </div>
  );
}
