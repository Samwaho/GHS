'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';


import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Minimal type for branch rows used in this table
type BranchRow = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string | null;
  email?: string | null;
  isActive: boolean;
  _count: { bookings: number };
};


export default function BranchesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchRow | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    isActive: true,
  });

  const t = useTRPC();
  const { data: branches, refetch } = useQuery(t.admin.getBranches.queryOptions());
  const branchRows = (branches ?? []) as BranchRow[];
  const createMutation = useMutation(t.admin.createBranch.mutationOptions());
  const updateMutation = useMutation(t.admin.updateBranch.mutationOptions());
  const deleteMutation = useMutation(t.admin.deleteBranch.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      phone: formData.phone.trim() ? formData.phone.trim() : undefined,
      email: formData.email.trim() ? formData.email.trim() : undefined,
    };
    try {
      if (editingBranch) {
        await updateMutation.mutateAsync({ id: editingBranch.id, data });
        toast.success('Branch updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Branch created successfully');
      }
      setIsDialogOpen(false);
      setEditingBranch(null);
      resetForm();
      refetch();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
      isActive: true,
    });
  };

  const handleEdit = (branch: BranchRow) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone || '',
      email: branch.email || '',
      isActive: branch.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Branch deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete branch');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Branches</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingBranch(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBranch ? 'Edit Branch' : 'Create Branch'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Branch name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <label className="text-sm font-medium">Active Branch</label>
              </div>

              <Button type="submit" className="w-full">
                {editingBranch ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branchRows.map((branch: BranchRow) => (
            <TableRow key={branch.id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell>{branch.address}</TableCell>
              <TableCell>{branch.city}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {branch.phone && <div>{branch.phone}</div>}
                  {branch.email && <div className="text-muted-foreground">{branch.email}</div>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={branch.isActive ? 'default' : 'secondary'}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{branch._count.bookings}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(branch)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(branch.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}