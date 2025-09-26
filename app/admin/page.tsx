import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your spa business operations</p>
        </div>

        <AdminDashboard />
      </div>

      <Footer />
    </div>
  );
}