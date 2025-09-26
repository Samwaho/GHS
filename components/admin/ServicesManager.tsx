'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ServicesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  type ServiceItem = { id: string; title: string; description?: string | null; duration: number; basePrice: number; categoryId: string; status: 'ACTIVE' | 'INACTIVE'; image?: string | null; isPopular: boolean; category?: any; _count?: any; createdBy?: any; };
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    basePrice: 0,
    categoryId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    image: '',
    isPopular: false,
  });

  const t = useTRPC();
  const { data: services, refetch } = useQuery(t.admin.getServices.queryOptions());
  const { data: categories } = useQuery(t.admin.getCategories.queryOptions());
  const servicesList = services ?? [];
  const categoriesList = categories ?? [];
  const createMutation = useMutation(t.admin.createService.mutationOptions());
  const updateMutation = useMutation(t.admin.updateService.mutationOptions());
  const deleteMutation = useMutation(t.admin.deleteService.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateMutation.mutateAsync({ id: editingService.id, data: formData });
        toast.success('Service updated successfully');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Service created successfully');
      }
      setIsDialogOpen(false);
      setEditingService(null);
      resetForm();
      refetch();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 60,
      basePrice: 0,
      categoryId: '',
      status: 'ACTIVE',
      image: '',
      isPopular: false,
    });
  };

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      duration: service.duration || 60,
      basePrice: service.basePrice || 0,
      categoryId: service.categoryId || '',
      status: service.status || 'ACTIVE',
      image: service.image || '',
      isPopular: service.isPopular || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Service deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete service');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Services</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingService(null); resetForm(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Create Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Service title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Textarea
                placeholder="Service description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Base Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.basePrice || ''}
                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <Input
                placeholder="Image URL (optional)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPopular: checked })}
                  />
                  <label className="text-sm font-medium">Popular Service</label>
                </div>

                <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {editingService ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Popular</TableHead>
            <TableHead>Bookings</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicesList.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>{service.category.name}</TableCell>
              <TableCell>{service.duration} min</TableCell>
              <TableCell>${service.basePrice}</TableCell>
              <TableCell>
                <Badge variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {service.status}
                </Badge>
              </TableCell>
              <TableCell>
                {service.isPopular && <Badge variant="outline">Popular</Badge>}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{service._count.bookings}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(service.id)}>
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