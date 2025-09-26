import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import BookingsClient from "./bookings-client";

export default async function BookingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your spa appointments</p>
          </div>

          <BookingsClient />
        </div>
      </div>

      <Footer />
    </div>
  );
}
