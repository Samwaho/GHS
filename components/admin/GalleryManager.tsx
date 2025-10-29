'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, Plus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useTRPC } from '@/trpc/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { UploadcareUploader } from '@/components/ui/uploadcare-uploader';
import { buildUploadcareUrl, imageTransformations } from '@/lib/uploadcare';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  imageUuid?: string | null;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GalleryFormData {
  title: string;
  description: string;
  imageUrl: string;
  imageUuid?: string;
  order: number;
  isActive: boolean;
}

export default function GalleryManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    imageUrl: '',
    imageUuid: '',
    order: 0,
    isActive: true,
  });

  const t = useTRPC();

  // Queries
  const { data: galleryItems, refetch } = useQuery(
    t.admin.getGalleryItems.queryOptions()
  );

  // Mutations
  const createMutation = useMutation(t.admin.createGalleryItem.mutationOptions());
  const updateMutation = useMutation(t.admin.updateGalleryItem.mutationOptions());
  const deleteMutation = useMutation(t.admin.deleteGalleryItem.mutationOptions());

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      imageUuid: '',
      order: 0,
      isActive: true,
    });
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.imageUrl) {
      toast.error('Title and image are required');
      return;
    }

    try {
      await createMutation.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl,
        imageUuid: formData.imageUuid || undefined,
        order: formData.order,
        isActive: formData.isActive,
      });
      toast.success('Gallery item created successfully');
      refetch();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to create gallery item');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      imageUrl: item.imageUrl,
      imageUuid: item.imageUuid || '',
      order: item.order,
      isActive: item.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem || !formData.title || !formData.imageUrl) {
      toast.error('Title and image are required');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        data: {
          title: formData.title,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl,
          imageUuid: formData.imageUuid || undefined,
          order: formData.order,
          isActive: formData.isActive,
        },
      });
      toast.success('Gallery item updated successfully');
      refetch();
      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetForm();
    } catch {
      toast.error('Failed to update gallery item');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success('Gallery item deleted successfully');
        refetch();
      } catch {
        toast.error('Failed to delete gallery item');
      }
    }
  };

  const handleImageUpload = (result: { cdnUrl: string; uuid: string }) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: result.cdnUrl,
      imageUuid: result.uuid,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Gallery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter gallery item title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter gallery item description"
                />
              </div>
              <div>
                <Label>Image Upload</Label>
                <div className="mt-2">
                  <UploadcareUploader
                    onUpload={handleImageUpload}
                    preview={formData.imageUrl}
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={buildUploadcareUrl(formData.imageUuid || '', imageTransformations.thumbnail)}
                      alt="Preview"
                      width={128}
                      height={96}
                      className="w-32 h-24 object-cover rounded"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {galleryItems?.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="cursor-move">
                <GripVertical className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-shrink-0">
                <Image
                  src={buildUploadcareUrl(item.imageUuid || '', imageTransformations.thumbnail)}
                  alt={item.title}
                  width={80}
                  height={64}
                  className="w-20 h-16 object-cover rounded"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant={item.isActive ? 'default' : 'secondary'}>
                    {item.isActive ? (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inactive
                      </>
                    )}
                  </Badge>
                  <span className="text-sm text-gray-500">Order: {item.order}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter gallery item title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter gallery item description"
              />
            </div>
            <div>
              <Label>Image Upload</Label>
              <div className="mt-2">
                <UploadcareUploader
                  onUpload={handleImageUpload}
                  preview={editingItem?.imageUrl}
                />
              </div>
              {formData.imageUrl && (
                <div className="mt-2">
                  <Image
                    src={buildUploadcareUrl(formData.imageUuid || '', imageTransformations.thumbnail)}
                    alt="Preview"
                    width={128}
                    height={96}
                    className="w-32 h-24 object-cover rounded"
                    unoptimized
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="edit-order">Order</Label>
              <Input
                id="edit-order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="Display order"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
