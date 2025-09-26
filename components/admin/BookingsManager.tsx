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

const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

type Status = typeof statuses[number];

export default function BookingsManager() {
  const t = useTRPC();
  const { data: bookings, refetch } = useQuery(t.admin.getBookings.queryOptions());
  const bookingsList = bookings ?? [];
  const updateStatus = useMutation(t.admin.updateBookingStatus.mutationOptions());

  const [pending, setPending] = useState<Record<string, { status: Status; adminNotes: string }>>({});

  const handleSave = async (id: string) => {
    const state = pending[id];
    if (!state) return;
    try {
      await updateStatus.mutateAsync({ id, status: state.status, adminNotes: state.adminNotes || undefined });
      toast.success('Booking updated');
      setPending((p) => ({ ...p, [id]: { status: state.status, adminNotes: '' } }));
      refetch();
    } catch {
      toast.error('Failed to update booking');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Bookings</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingsList.map((b) => {
            const st = pending[b.id] ?? { status: b.status as Status, adminNotes: b.adminNotes || '' };
            return (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{b.user?.name ?? '—'}</div>
                    <div className="text-muted-foreground text-xs">{b.user?.email}</div>
                  </div>
                </TableCell>
                <TableCell>{b.service?.title}</TableCell>
                <TableCell>{b.branch?.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={b.status === 'CONFIRMED' ? 'default' : b.status === 'CANCELLED' ? 'secondary' : 'outline'}>
                      {b.status}
                    </Badge>
                    <Select
                      value={st.status}
                      onValueChange={(value: Status) => setPending((p) => ({ ...p, [b.id]: { ...st, status: value } }))}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Admin notes"
                    value={st.adminNotes}
                    onChange={(e) => setPending((p) => ({ ...p, [b.id]: { ...st, adminNotes: e.target.value } }))}
                  />
                </TableCell>
                <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleSave(b.id)}>Save</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

