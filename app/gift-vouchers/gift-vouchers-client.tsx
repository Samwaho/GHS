'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, ShoppingCart, Percent, DollarSign, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import GiftVoucherPurchaseForm from '@/components/gift-vouchers/GiftVoucherPurchaseForm';

interface GiftVouchersClientProps {
  session: any;
}

export default function GiftVouchersClient({ session }: GiftVouchersClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const router = useRouter();
  const t = useTRPC();

  const templatesQuery = useQuery(t.user.getAvailableGiftVoucherTemplates.queryOptions());

  const handlePurchase = (template: any) => {
    if (!session?.user) {
      toast.error('Please log in to purchase gift vouchers');
      router.push('/auth/login');
      return;
    }
    setSelectedTemplate(template);
    setShowPurchaseForm(true);
  };

  const handleClosePurchaseForm = () => {
    setShowPurchaseForm(false);
    setSelectedTemplate(null);
  };

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

  const formatValue = (template: any) => {
    if (template.type === 'PERCENTAGE') {
      return `${template.value}% OFF`;
    } else if (template.type === 'SERVICE_SPECIFIC' && template.service) {
      return `${template.service.title}`;
    } else {
      return `$${template.value}`;
    }
  };

  const getPrice = (template: any) => {
    if (template.type === 'FIXED_AMOUNT') {
      return template.value;
    } else if (template.type === 'SERVICE_SPECIFIC' && template.service) {
      return template.service.basePrice;
    } else {
      // For percentage vouchers, we might want to set a base price
      return template.value; // This could be adjusted based on business logic
    }
  };

  if (templatesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading gift vouchers...</div>
      </div>
    );
  }

  if (!templatesQuery.data || templatesQuery.data.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gift Vouchers Available</h3>
        <p className="text-gray-600">Check back later for new gift voucher options.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templatesQuery.data.map((template) => (
          <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            {template.imageUrl && (
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${template.imageUrl})` }} />
            )}
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                </div>
                {getTypeBadge(template.type)}
              </div>
              {template.description && (
                <p className="text-gray-600 text-sm">{template.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {formatValue(template)}
                  </div>
                  <div className="text-lg text-gray-600">
                    ${getPrice(template)}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Valid for:</span>
                    <span>{template.validityDays} days</span>
                  </div>
                  {template.service && (
                    <div className="flex justify-between">
                      <span>Service:</span>
                      <span>{template.service.title}</span>
                    </div>
                  )}
                  {template.maxUsageCount && (
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span>{template.maxUsageCount - template.currentUsageCount} left</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(template)}
                  disabled={template.maxUsageCount && template.currentUsageCount >= template.maxUsageCount}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {template.maxUsageCount && template.currentUsageCount >= template.maxUsageCount 
                    ? 'Sold Out' 
                    : 'Purchase Gift Voucher'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Our Gift Vouchers?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Perfect Gift</h3>
            <p className="text-gray-600 text-sm">Give the gift of relaxation and wellness to your loved ones.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Great Value</h3>
            <p className="text-gray-600 text-sm">Enjoy our premium services at special voucher prices.</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Flexible Use</h3>
            <p className="text-gray-600 text-sm">Use vouchers for any of our services at your convenience.</p>
          </div>
        </div>
      </div>

      {showPurchaseForm && selectedTemplate && (
        <GiftVoucherPurchaseForm
          template={selectedTemplate}
          onClose={handleClosePurchaseForm}
          onSuccess={() => {
            handleClosePurchaseForm();
            toast.success('Gift voucher purchased successfully!');
          }}
        />
      )}
    </div>
  );
}
