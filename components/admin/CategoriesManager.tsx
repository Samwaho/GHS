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
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// Minimal type for category rows used in this table
type CategoryRow = {
  id: string;
  name: string;
  description?: string | null;
  _count: { services: number };
};


export default function CategoriesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const t = useTRPC();
  const { data: categories, refetch } = useQuery(t.admin.getCategories.queryOptions());
  const categoriesList = categories ?? [];
  const createMutation = useMutation(t.admin.createCategory.mutationOptions());
  const updateMutation = useMutation(t.admin.updateCategory.mutationOptions());
  const deleteMutation = useMutation(t.admin.deleteCategory.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name.trim(),
      description: formData.description.trim() ? formData.description.trim() : undefined,
    };
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data });
        toast.success('Category updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Category created successfully');
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      refetch();
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (category: CategoryRow) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Category deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setFormData({ name: '', description: '' }); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Category name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <Button type="submit" className="w-full">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Services Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categoriesList.map((category: CategoryRow) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.description || '-'}</TableCell>
              <TableCell>
                <Badge variant="secondary">{category._count.services}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
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
