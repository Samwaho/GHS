'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UploadcareUploader } from '@/components/ui/uploadcare-uploader';
import { buildUploadcareUrl, imageTransformations } from '@/lib/uploadcare';
import Image from 'next/image';
import { formatKES } from '@/lib/currency';

interface GiftVoucherTemplateFormProps {
  template?: {
    id: string;
    name: string;
    description?: string | null;
    type: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC';
    value: number;
    price: number;
    serviceId?: string | null;
    isActive: boolean;
    validityDays: number;
    maxUsageCount?: number | null;
    imageUrl?: string | null;
    imageUuid?: string | null;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiftVoucherTemplateForm({ template, onClose, onSuccess }: GiftVoucherTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'FIXED_AMOUNT' as 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC',
    value: 0,
    price: 0,
    serviceId: '',
    isActive: true,
    validityDays: 365,
    maxUsageCount: '',
    imageUrl: '',
    imageUuid: '',
  });

  const t = useTRPC();
  const servicesQuery = useQuery(t.admin.getServices.queryOptions());

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        type: (template.type as 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC') || 'FIXED_AMOUNT',
        value: template.value || 0,
        price: template.price || 0,
        serviceId: template.serviceId || '',
        isActive: template.isActive ?? true,
        validityDays: template.validityDays || 365,
        maxUsageCount: template.maxUsageCount?.toString() || '',
        imageUrl: template.imageUrl || '',
        imageUuid: template.imageUuid || '',
      });
    }
  }, [template]);

  const createMutation = useMutation(t.admin.createGiftVoucherTemplate.mutationOptions());
  const updateMutation = useMutation(t.admin.updateGiftVoucherTemplate.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      maxUsageCount: formData.maxUsageCount ? parseInt(formData.maxUsageCount) : undefined,
      serviceId: formData.type === 'SERVICE_SPECIFIC' ? formData.serviceId : undefined,
      imageUrl: formData.imageUrl || undefined,
      imageUuid: formData.imageUuid || undefined,
    };

    try {
      if (template) {
        await updateMutation.mutateAsync({ id: template.id, data: submitData });
        toast.success('Gift voucher template updated successfully');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('Gift voucher template created successfully');
      }
      onSuccess();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'An error occurred');
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (result: { cdnUrl: string; uuid: string }) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: result.cdnUrl,
      imageUuid: result.uuid,
    }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto w-[98vw] sm:w-full">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl sm:text-3xl font-bold">
            {template ? 'Edit Gift Voucher Template' : 'Create Gift Voucher Template'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Spa Day Package"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-base font-medium">Voucher Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
                  <SelectItem value="SERVICE_SPECIFIC">Service Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this voucher offers..."
              rows={4}
              className="text-base resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label htmlFor="value" className="text-base font-medium">
                Value * {formData.type === 'PERCENTAGE' ? '(%)' : '(KES)'}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="price" className="text-base font-medium">Price * (KES)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="validityDays" className="text-base font-medium">Validity (Days) *</Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                value={formData.validityDays}
                onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value) || 365)}
                className="h-12 text-base"
                required
              />
            </div>
          </div>

          {formData.type === 'SERVICE_SPECIFIC' && (
            <div className="space-y-3">
              <Label htmlFor="serviceId" className="text-base font-medium">Specific Service *</Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {servicesQuery.data?.map((service: { id: string; title: string; basePrice: number }) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title} - {formatKES(service.basePrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="maxUsageCount" className="text-base font-medium">Max Usage Count (Optional)</Label>
            <Input
              id="maxUsageCount"
              type="number"
              min="1"
              value={formData.maxUsageCount}
              onChange={(e) => handleInputChange('maxUsageCount', e.target.value)}
              placeholder="Leave empty for unlimited"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-4 pt-4 border-t-2 border-gray-200">
            <div>
              <Label className="text-base font-medium">Template Image (Optional)</Label>
              <p className="text-sm text-gray-600 mt-1">Upload an image to display with this voucher template</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150 transition-colors">
              <UploadcareUploader
                onUpload={handleImageUpload}
                preview={formData.imageUrl}
              />
            </div>
            {formData.imageUrl && (
              <div className="flex justify-center pt-4">
                <div className="relative">
                  <Image
                    src={buildUploadcareUrl(formData.imageUuid || '', imageTransformations.thumbnail)}
                    alt="Preview"
                    width={224}
                    height={160}
                    className="w-56 h-40 object-cover rounded-lg border-2 border-gray-300 shadow-lg"
                    unoptimized
                  />
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                    ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive" className="text-base font-medium">Active Template</Label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t-2 border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto h-12 text-base">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto h-12 text-base">
              {isLoading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
