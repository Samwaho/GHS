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
import { format } from 'date-fns';

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

interface UserBooking {
  id: string;
  scheduledAt: Date;
  status: BookingStatus;
  notes: string | null;
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
  
  const upcomingBookings = bookingsList.filter(
    (booking) => booking.status === 'PENDING' || booking.status === 'CONFIRMED'
  );
  
  const pastBookings = bookingsList.filter(
    (booking) => booking.status === 'COMPLETED' || booking.status === 'CANCELLED'
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

  const BookingCard = ({ booking }: { booking: UserBooking }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
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
                ${booking.totalPrice || booking.branchService?.price || 0}
              </p>
            </div>
            
            {booking.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {booking.notes}
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

  if (bookingsList.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
        <p className="text-gray-600 mb-6">
          Ready to book your first spa treatment?
        </p>
        <Button asChild>
          <a href="/services">Browse Services</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
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
