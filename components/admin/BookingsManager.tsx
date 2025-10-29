'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatKES } from '@/lib/currency';

const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

type Status = typeof statuses[number];
type FilterStatus = Status | 'ALL';

const statusBadgeVariant: Record<Status, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  CONFIRMED: 'default',
  CANCELLED: 'secondary',
  COMPLETED: 'outline',
};

export default function BookingsManager() {
  const t = useTRPC();
  const { data: bookings, refetch, isLoading } = useQuery(t.admin.getBookings.queryOptions());
  const bookingsList = bookings ?? [];
  const updateStatus = useMutation(t.admin.updateBookingStatus.mutationOptions());

  const [pending, setPending] = useState<Record<string, { status: Status; adminNotes: string }>>({});
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredBookings = bookingsList.filter((booking) =>
    statusFilter === 'ALL' ? true : booking.status === statusFilter
  );

  const handleSave = async (id: string) => {
    const state = pending[id];
    if (!state) return;
    try {
      setSavingId(id);
      await updateStatus.mutateAsync({ id, status: state.status, adminNotes: state.adminNotes || undefined });
      toast.success('Booking updated');
      setPending((p) => ({ ...p, [id]: { status: state.status, adminNotes: state.adminNotes } }));
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update booking';
      toast.error(message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold">Bookings</h3>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Concierge Notes</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                {isLoading ? 'Loading bookings...' : 'No bookings match the selected filter.'}
              </TableCell>
            </TableRow>
          ) : (
            filteredBookings.map((booking) => {
              const state = pending[booking.id] ?? {
                status: booking.status as Status,
                adminNotes: booking.adminNotes || '',
              };

              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{booking.user?.name || 'Walk-in client'}</span>
                      {booking.user?.email && (
                        <span className="text-xs text-muted-foreground">{booking.user.email}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{booking.service?.title ?? 'Service removed'}</span>
                      {booking.branch?.name && (
                        <span className="text-xs text-muted-foreground">{booking.branch.name}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{format(new Date(booking.scheduledAt), 'EEE, MMM d, yyyy')}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(booking.scheduledAt), 'h:mm a')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatKES(booking.totalPrice ?? 0)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusBadgeVariant[booking.status as Status]}>
                        {booking.status}
                      </Badge>
                      <Select
                        value={state.status}
                        onValueChange={(value) =>
                          setPending((prev) => ({ ...prev, [booking.id]: { ...state, status: value as Status } }))
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Concierge notes"
                      value={state.adminNotes}
                      onChange={(event) =>
                        setPending((prev) => ({
                          ...prev,
                          [booking.id]: { ...state, adminNotes: event.target.value },
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleSave(booking.id)}
                      disabled={savingId === booking.id && updateStatus.isPending}
                    >
                      {savingId === booking.id && updateStatus.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
