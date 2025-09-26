'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function UsersManager() {
  const t = useTRPC();
  const { data: users, refetch } = useQuery(t.admin.getUsers.queryOptions());
  const usersList = users ?? [];
  const updateRole = useMutation(t.admin.updateUserRole.mutationOptions());

  const [pendingRole, setPendingRole] = useState<Record<string, 'ADMIN' | 'USER'>>({});

  const handleSave = async (id: string) => {
    const role = pendingRole[id];
    if (!role) return;
    try {
      await updateRole.mutateAsync({ id, role });
      toast.success('User role updated');
      refetch();
    } catch {
      toast.error('Failed to update user');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Users</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersList.map((u) => {
            const role = pendingRole[u.id] ?? (u.role as 'ADMIN' | 'USER');
            return (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name ?? '—'}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                    <Select value={role} onValueChange={(value: 'ADMIN' | 'USER') => setPendingRole((p) => ({ ...p, [u.id]: value }))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">USER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={u.emailVerified ? 'default' : 'secondary'}>
                    {u.emailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{u._count.bookings}</Badge>
                </TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button size="sm" onClick={() => handleSave(u.id)}>Save</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

