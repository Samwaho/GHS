'use client';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, ShoppingCart, Percent, DollarSign, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import GiftVoucherPurchaseForm from '@/components/gift-vouchers/GiftVoucherPurchaseForm';
import { formatKES } from '@/lib/currency';
import type { Session } from 'next-auth';

interface GiftVouchersClientProps {
  session: Session | null;
}

export default function GiftVouchersClient({ session }: GiftVouchersClientProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    type: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC';
    value: number;
    price: number;
    validityDays: number;
    service?: { title: string } | null;
    maxUsageCount?: number | null;
    currentUsageCount?: number | null;
  } | null>(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC'>('ALL');
  const router = useRouter();
  const t = useTRPC();

  const templatesQuery = useQuery(t.user.getAvailableGiftVoucherTemplates.queryOptions());
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data]);

  const handlePurchase = (template: {
    id: string;
    name: string;
    type: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'SERVICE_SPECIFIC';
    value: number;
    price: number;
    validityDays: number;
    service?: { title: string } | null;
    maxUsageCount?: number | null;
    currentUsageCount?: number | null;
  }) => {
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

  const formatValue = (template: {
    type: string;
    value: number;
    service?: { title: string } | null;
  }) => {
    if (template.type === 'PERCENTAGE') {
      return `${template.value}% OFF`;
    } else if (template.type === 'SERVICE_SPECIFIC' && template.service) {
      return `${template.service.title}`;
    } else {
      return formatKES(template.value);
    }
  };

  const getPrice = (template: { price: number }) => {
    return formatKES(template.price);
  };

  const filteredTemplates = useMemo(() => {
    if (typeFilter === 'ALL') return templates;
    return templates.filter((template) => template.type === typeFilter);
  }, [templates, typeFilter]);

  const templateStats = useMemo(() => {
    if (templates.length === 0) {
      return { total: 0, bestValue: 0, percentageCount: 0 };
    }
    const bestValue = Math.max(...templates.map((template) => template.value || 0));
    const percentageCount = templates.filter((template) => template.type === 'PERCENTAGE').length;
    return {
      total: templates.length,
      bestValue,
      percentageCount
    };
  }, [templates]);

  const filterChips = [
    { label: 'All', value: 'ALL' as const },
    { label: 'Fixed Amount', value: 'FIXED_AMOUNT' as const },
    { label: 'Percentage', value: 'PERCENTAGE' as const },
    { label: 'Service Specific', value: 'SERVICE_SPECIFIC' as const }
  ];

  const giftingSteps = [
    { title: 'Choose a template', detail: 'Pick a fixed amount, percentage, or service-specific voucher.' },
    { title: 'Personalize the note', detail: 'Add heartfelt words plus optional team follow-up for the recipient.' },
    { title: 'Send instantly', detail: 'Deliver via email or request a printed card for local drop-off.' }
  ];

  if (templatesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading gift vouchers...</div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gift Vouchers Available</h3>
        <p className="text-gray-600">Check back later for new gift voucher options.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-amber-100 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-600 mb-2">Templates</p>
          <p className="text-3xl font-semibold text-gray-900">{templateStats.total}</p>
          <p className="text-sm text-gray-500 mt-1">Available gifting options</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Best value</p>
          <p className="text-3xl font-semibold text-gray-900">
            {templateStats.bestValue ? formatKES(templateStats.bestValue) : '—'}
          </p>
          <p className="text-sm text-gray-500 mt-1">Highest denomination available</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Percentage picks</p>
          <p className="text-3xl font-semibold text-gray-900">{templateStats.percentageCount}</p>
          <p className="text-sm text-gray-500 mt-1">Flexible discount vouchers</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {filterChips.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setTypeFilter(chip.value)}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              typeFilter === chip.value
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-amber-200 hover:text-amber-700'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-white/70 p-10 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No vouchers in this category</h3>
          <p className="text-gray-600">Try a different filter or check back soon for new designs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {template.imageUrl && (
              <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${template.imageUrl})` }}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-3 right-3">
                  {getTypeBadge(template.type)}
                </div>
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <CardTitle className="text-lg sm:text-xl line-clamp-2">{template.name}</CardTitle>
                </div>
                {!template.imageUrl && (
                  <div className="flex justify-end">
                    {getTypeBadge(template.type)}
                  </div>
                )}
                {template.description && (
                  <p className="text-gray-600 text-sm line-clamp-3">{template.description}</p>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-4">
              <div className="space-y-4">
                <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
                  <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {formatValue(template)}
                  </div>
                  <div className="text-lg font-semibold text-gray-700">
                    Price: {getPrice(template)}
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Valid for:</span>
                    <span className="font-medium">{template.validityDays} days</span>
                  </div>
                  {template.service && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-right max-w-[60%] truncate">{template.service.title}</span>
                    </div>
                  )}
                  {template.maxUsageCount && (
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-600">Available:</span>
                      <span className={`font-medium ${template.currentUsageCount >= template.maxUsageCount ? 'text-red-600' : 'text-green-600'}`}>
                        {template.maxUsageCount - template.currentUsageCount} left
                      </span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full h-12 text-base font-medium mt-auto" 
                  onClick={() => handlePurchase(template)}
                  disabled={!!(template.maxUsageCount && template.currentUsageCount >= template.maxUsageCount)}
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
      )}

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 sm:p-8 mt-12 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-900">Why Choose Our Gift Vouchers?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Gift className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-3 text-lg">Perfect Gift</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Give the gift of relaxation and wellness to your loved ones.</p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-3 text-lg">Great Value</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Enjoy our premium services at special voucher prices.</p>
          </div>
          <div className="text-center group sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-3 text-lg">Flexible Use</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Use vouchers for any of our services at your convenience.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {giftingSteps.map((step, index) => (
          <div key={step.title} className="rounded-2xl border border-amber-100 bg-white p-6">
            <div className="text-sm uppercase tracking-[0.35em] text-amber-600 mb-2">
              Step {index + 1}
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{step.detail}</p>
          </div>
        ))}
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
