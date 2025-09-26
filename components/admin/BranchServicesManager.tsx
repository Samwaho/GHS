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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BranchServicesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  type BranchServiceItem = { id: string; branchId: string; serviceId: string; price: number; isAvailable: boolean; };
  const [editingItem, setEditingItem] = useState<BranchServiceItem | null>(null);
  const [formData, setFormData] = useState({
    branchId: '',
    serviceId: '',
    price: 0,
    isAvailable: true,
  });

  const t = useTRPC();
  const { data: branchServices, refetch } = useQuery(t.admin.getBranchServices.queryOptions());
  const { data: branches } = useQuery(t.admin.getBranches.queryOptions());
  const { data: services } = useQuery(t.admin.getServices.queryOptions());
  const branchServicesList = branchServices ?? [];
  const branchesList = branches ?? [];
  const servicesList = services ?? [];

  const createMutation = useMutation(t.admin.createBranchService.mutationOptions());
  const updateMutation = useMutation(t.admin.updateBranchService.mutationOptions());
  const deleteMutation = useMutation(t.admin.deleteBranchService.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
        toast.success('Branch service updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Branch service created successfully');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      refetch();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const resetForm = () => {
    setFormData({ branchId: '', serviceId: '', price: 0, isAvailable: true });
  };

  const handleEdit = (item: BranchServiceItem) => {
    setEditingItem(item);
    setFormData({
      branchId: item.branchId || '',
      serviceId: item.serviceId || '',
      price: item.price || 0,
      isAvailable: item.isAvailable || true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this branch service?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Branch service deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete branch service');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Branch Services</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingItem(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Branch Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Branch Service' : 'Create Branch Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Select value={formData.branchId} onValueChange={(value) => setFormData({ ...formData, branchId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchesList.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                  />
                  <label className="text-sm font-medium">Available</label>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branchServicesList.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.branch.name}</TableCell>
              <TableCell>{item.service.title}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>
                <Badge variant={item.isAvailable ? 'default' : 'secondary'}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

