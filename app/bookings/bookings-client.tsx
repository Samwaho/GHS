'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Phone, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { formatKES } from '@/lib/currency';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface UserBooking {
  id: string;
  scheduledAt: string | Date;
  status: BookingStatus;
  notes: string | null;
  adminNotes: string | null;
  totalPrice: number;
  service: {
    id: string;
    title: string;
    duration: number;
    image: string | null;
    category: {
      name: string;
    };
  };
  branch: {
    id: string;
    name: string;
    address: string;
    phone: string | null;
  };
  branchService?: {
    price: number;
  };
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export default function BookingsClient() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const t = useTRPC();
  const { data: bookings, refetch } = useQuery(t.user.getMyBookings.queryOptions());
  const cancelMutation = useMutation(t.user.cancelBooking.mutationOptions());
  
  const bookingsList = bookings ?? [];
  
  const now = new Date();
  const upcomingBookings = bookingsList.filter(
    (booking) => (booking.status === 'PENDING' || booking.status === 'CONFIRMED') && new Date(booking.scheduledAt) >= now
  );
  
  const pastBookings = bookingsList.filter(
    (booking) => booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
  );

  const completedBookings = bookingsList.filter((booking) => booking.status === 'COMPLETED');

  const totalValue = bookingsList.reduce(
    (sum, booking) => sum + (booking.totalPrice ?? booking.branchService?.price ?? 0),
    0
  );

  const nextBooking = upcomingBookings
    .slice()
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )[0];

  const teamNotes = bookingsList.filter((booking) => booking.adminNotes).length;
  const expiredBookings = bookingsList.filter(
    (booking) =>
      (booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
      new Date(booking.scheduledAt) < now
  );

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await cancelMutation.mutateAsync({ bookingId });
      toast.success('Booking cancelled successfully');
      refetch();
    } catch {
      toast.error('Failed to cancel booking');
    }
  };

  const BookingCard = ({ booking, isExpired }: { booking: UserBooking; isExpired?: boolean }) => {
    const pastDue =
      isExpired ??
      ((booking.status === 'PENDING' || booking.status === 'CONFIRMED') &&
        new Date(booking.scheduledAt) < now);

    return (
    <Card className={`hover:shadow-lg transition-shadow ${pastDue ? 'border-red-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {booking.service.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {booking.service.category.name}
            </p>
          </div>
          <Badge className={statusColors[booking.status]}>
            {statusLabels[booking.status]}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{format(new Date(booking.scheduledAt), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{format(new Date(booking.scheduledAt), 'h:mm a')} ({booking.service.duration} minutes)</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{booking.branch.name}</span>
            </div>
            
            {booking.branch.phone && (
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>{booking.branch.phone}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">
                {formatKES(booking.totalPrice ?? booking.branchService?.price ?? 0)}
              </p>
            </div>
            
            {booking.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
                </p>
              </div>
            )}

            {booking.adminNotes && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-900">
                  <strong>Spa team update:</strong> {booking.adminNotes}
                </p>
              </div>
            )}

            {pastDue && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  This booking is past its scheduled time. Please cancel or contact our team to reschedule.
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
              
              {booking.status === 'COMPLETED' && (
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  };

  if (bookingsList.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-amber-100">
        <Calendar className="h-16 w-16 text-amber-300 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-600 mb-6">
          Ready to schedule your first Golden Hands experience?
        </p>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <a href="/services">Browse services</a>
        </Button>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Active bookings',
      value: upcomingBookings.length,
      caption: 'Currently on your calendar'
    },
    {
      label: 'Completed experiences',
      value: completedBookings.length,
      caption: 'All-time pampering sessions'
    },
    {
      label: 'Lifetime spend',
      value: formatKES(totalValue),
      caption: 'Across every booking'
    },
    {
      label: 'Expired requests',
      value: expiredBookings.length,
      caption: 'Require status updates'
    },
    {
      label: 'Team notes',
      value: teamNotes,
      caption: 'Updates awaiting your review'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-600 mb-2">{metric.label}</p>
            <p className="text-3xl font-semibold text-gray-900">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.caption}</p>
          </div>
        ))}
      </div>

      {nextBooking && (
        <Card className="border-amber-100 bg-gradient-to-r from-amber-50 to-white">
          <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-600 mb-1">Next visit</p>
              <h3 className="text-2xl font-semibold text-gray-900">{nextBooking.service.title}</h3>
              <p className="text-gray-600">
                {format(new Date(nextBooking.scheduledAt), 'EEEE, MMM d • h:mm a')}
                {' · '}
                {nextBooking.branch.name}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Starts in {formatDistanceToNow(new Date(nextBooking.scheduledAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                <a href="tel:0719369088">Call our team</a>
              </Button>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <a href="/services">Add enhancement</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingBookings.length})
        </TabsTrigger>
        <TabsTrigger value="expired">
          Expired ({expiredBookings.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastBookings.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="mt-6">
        {upcomingBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="expired" className="mt-6">
        {expiredBookings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No expired bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {expiredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isExpired />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="mt-6">
        {pastBookings.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No past bookings</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
    </div>
  );
}
