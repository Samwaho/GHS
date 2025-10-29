import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import GiftVouchersClient from './gift-vouchers-client';
import { auth } from '@/auth';

export default async function GiftVouchersPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Gift Vouchers</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Give the gift of relaxation and wellness. Perfect for birthdays, holidays, or any special occasion.
          </p>
        </div>

        <GiftVouchersClient session={session} />
      </div>

      <Footer />
    </div>
  );
}
