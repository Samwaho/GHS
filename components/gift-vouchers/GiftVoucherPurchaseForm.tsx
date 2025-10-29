'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, DollarSign, Percent, Star, User, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { formatKES } from '@/lib/currency';

interface GiftVoucherPurchaseFormProps {
  template: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GiftVoucherPurchaseForm({ template, onClose, onSuccess }: GiftVoucherPurchaseFormProps) {
  const [formData, setFormData] = useState({
    recipientEmail: '',
    recipientName: '',
    message: '',
    isForSelf: true,
  });
  const t = useTRPC();

  const purchaseMutation = useMutation(t.user.purchaseGiftVoucher.mutationOptions());

  const getFormattedPrice = () => formatKES(template.price);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'FIXED_AMOUNT':
        return <DollarSign className="w-5 h-5" />;
      case 'PERCENTAGE':
        return <Percent className="w-5 h-5" />;
      case 'SERVICE_SPECIFIC':
        return <Star className="w-5 h-5" />;
      default:
        return <Gift className="w-5 h-5" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      FIXED_AMOUNT: 'default',
      PERCENTAGE: 'secondary',
      SERVICE_SPECIFIC: 'outline',
    };
    const labels: Record<string, string> = {
      FIXED_AMOUNT: 'Fixed Amount',
      PERCENTAGE: 'Percentage Off',
      SERVICE_SPECIFIC: 'Service Specific',
    };
    return <Badge variant={variants[type] || 'outline'}>{labels[type] || type}</Badge>;
  };

  const formatValue = () => {
    if (template.type === 'PERCENTAGE') {
      return `${template.value}% OFF`;
    } else if (template.type === 'SERVICE_SPECIFIC' && template.service) {
      return template.service.title;
    } else {
      return formatKES(template.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const purchaseData = {
      templateId: template.id,
      recipientEmail: formData.isForSelf ? undefined : formData.recipientEmail,
      recipientName: formData.isForSelf ? undefined : formData.recipientName,
      message: formData.message || undefined,
    };

    try {
      await purchaseMutation.mutateAsync(purchaseData);
      toast.success('Gift voucher purchased successfully!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to purchase gift voucher');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Purchase Gift Voucher
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Voucher Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                {getTypeBadge(template.type)}
              </div>
              {template.description && (
                <p className="text-gray-600 text-sm mt-2">{template.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Value:</span>
                  <p className="text-lg font-bold text-primary">{formatValue()}</p>
                </div>
                <div>
                  <span className="font-medium">Price:</span>
                  <p className="text-lg font-bold">{getFormattedPrice()}</p>
                </div>
                <div>
                  <span className="font-medium">Valid for:</span>
                  <p>{template.validityDays} days</p>
                </div>
                {template.service && (
                  <div>
                    <span className="font-medium">Service:</span>
                    <p>{template.service.title}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isForSelf"
                  checked={formData.isForSelf}
                  onCheckedChange={(checked) => handleInputChange('isForSelf', checked)}
                />
                <Label htmlFor="isForSelf" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  This gift voucher is for me
                </Label>
              </div>

              {!formData.isForSelf && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Recipient Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <Input
                        id="recipientName"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        placeholder="Enter recipient's name"
                        required={!formData.isForSelf}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">Recipient Email</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                        placeholder="Enter recipient's email"
                        required={!formData.isForSelf}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Personal Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Add a personal message to the gift voucher..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">{formData.message.length}/500 characters</p>
              </div>
            </div>

            {/* Order Summary */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gift Voucher:</span>
                    <span>{template.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span>{formatValue()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{getFormattedPrice()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={purchaseMutation.isPending}
                className="min-w-[120px]"
              >
                {purchaseMutation.isPending ? 'Processing...' : `Purchase ${getFormattedPrice()}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
