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

interface GiftVoucherTemplateFormProps {
  template?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiftVoucherTemplateForm({ template, onClose, onSuccess }: GiftVoucherTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'FIXED_AMOUNT' as 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC',
    value: 0,
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
        type: template.type || 'FIXED_AMOUNT',
        value: template.value || 0,
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
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Gift Voucher Template' : 'Create Gift Voucher Template'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Spa Day Package"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Voucher Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this voucher offers..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">
                Value * {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                step={formData.type === 'PERCENTAGE' ? '1' : '0.01'}
                max={formData.type === 'PERCENTAGE' ? '100' : undefined}
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validityDays">Validity (Days) *</Label>
              <Input
                id="validityDays"
                type="number"
                min="1"
                value={formData.validityDays}
                onChange={(e) => handleInputChange('validityDays', parseInt(e.target.value) || 365)}
                required
              />
            </div>
          </div>

          {formData.type === 'SERVICE_SPECIFIC' && (
            <div className="space-y-2">
              <Label htmlFor="serviceId">Specific Service *</Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {servicesQuery.data?.map((service: any) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.title} - ${service.basePrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsageCount">Max Usage Count (Optional)</Label>
              <Input
                id="maxUsageCount"
                type="number"
                min="1"
                value={formData.maxUsageCount}
                onChange={(e) => handleInputChange('maxUsageCount', e.target.value)}
                placeholder="Leave empty for unlimited"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active Template</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
