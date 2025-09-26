import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import MyGiftVouchersClient from './my-gift-vouchers-client';

export default async function MyGiftVouchersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gift Vouchers</h1>
          <p className="text-gray-600">Manage your purchased gift vouchers and track their usage</p>
        </div>

        <MyGiftVouchersClient />
      </div>

      <Footer />
    </div>
  );
}
