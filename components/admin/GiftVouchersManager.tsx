'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import GiftVoucherTemplateForm from './GiftVoucherTemplateForm';
import { formatKES } from '@/lib/currency';

export default function GiftVouchersManager() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const t = useTRPC();

  const templatesQuery = useQuery(t.admin.getGiftVoucherTemplates.queryOptions());
  const vouchersQuery = useQuery(t.admin.getGiftVouchers.queryOptions());
  const usagesQuery = useQuery(t.admin.getGiftVoucherUsages.queryOptions());

  type Template = NonNullable<typeof templatesQuery.data>[number];
  type Voucher = NonNullable<typeof vouchersQuery.data>[number];
  type VoucherUsage = NonNullable<typeof usagesQuery.data>[number];

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Mutations
  const deleteTemplateMutation = useMutation(t.admin.deleteGiftVoucherTemplate.mutationOptions());
  const updateVoucherStatusMutation = useMutation(t.admin.updateGiftVoucherStatus.mutationOptions());

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this gift voucher template?')) {
      try {
        await deleteTemplateMutation.mutateAsync({ id });
        toast.success('Gift voucher template deleted successfully');
        templatesQuery.refetch();
      } catch (error: unknown) {
        toast.error((error as Error).message || 'Failed to delete template');
      }
    }
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleUpdateVoucherStatus = async (id: string, status: 'ACTIVE' | 'CANCELLED' | 'USED' | 'EXPIRED') => {
    try {
      await updateVoucherStatusMutation.mutateAsync({ id, status });
      toast.success('Gift voucher status updated successfully');
      vouchersQuery.refetch();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to update voucher status');
    }
  };

  const handleCloseForm = () => {
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      USED: 'secondary',
      EXPIRED: 'destructive',
      CANCELLED: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      FIXED_AMOUNT: 'default',
      PERCENTAGE: 'secondary',
      SERVICE_SPECIFIC: 'outline',
    };
    return <Badge variant={variants[type] || 'outline'}>{type.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3">
          <TabsTrigger value="templates" className="py-2 text-sm font-medium sm:text-base">
            Templates
          </TabsTrigger>
          <TabsTrigger value="vouchers" className="py-2 text-sm font-medium sm:text-base">
            Vouchers
          </TabsTrigger>
          <TabsTrigger value="usage" className="py-2 text-sm font-medium sm:text-base">
            Usage History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-2xl font-bold">Gift Voucher Templates</h3>
            <Button onClick={() => setShowTemplateForm(true)} className="w-full sm:w-auto h-12 text-base">
              <Plus className="w-5 h-5 mr-2" />
              Create Template
            </Button>
          </div>

          {templatesQuery.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600">Loading templates...</div>
            </div>
          ) : (
            <div className="grid gap-6">
              {templatesQuery.data?.map((template: Template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                        <p className="text-gray-600 leading-relaxed">{template.description}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {getTypeBadge(template.type)}
                        <Badge variant={template.isActive ? 'default' : 'secondary'} className="text-sm">
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Value:</span>
                        <p className="text-lg font-bold text-primary mt-1">
                          {template.type === 'PERCENTAGE' ? `${template.value}%` : formatKES(template.value)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Price:</span>
                        <p className="text-lg font-bold text-green-600 mt-1">{formatKES(template.price)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Validity:</span>
                        <p className="text-lg font-bold mt-1">{template.validityDays} days</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Usage:</span>
                        <p className="text-lg font-bold mt-1">
                          {template._count.giftVouchers}
                          {template.maxUsageCount ? ` / ${template.maxUsageCount}` : ' (unlimited)'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2 lg:col-span-1">
                        <span className="font-medium text-gray-700 block">Service:</span>
                        <p className="text-sm mt-1 truncate">{template.service?.title || 'Any service'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 sm:flex-none h-10"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteTemplate(template.id)}
                        disabled={deleteTemplateMutation.isPending}
                        className="flex-1 sm:flex-none h-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vouchers" className="space-y-6 mt-6">
          <h3 className="text-2xl font-bold">Purchased Gift Vouchers</h3>
          {vouchersQuery.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600">Loading vouchers...</div>
            </div>
          ) : (
            <div className="grid gap-6">
              {vouchersQuery.data?.map((voucher: Voucher) => (
                <Card key={voucher.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">Code: {voucher.code}</CardTitle>
                        <p className="text-gray-600">{voucher.template.name}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {getStatusBadge(voucher.status)}
                        {getTypeBadge(voucher.template.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Purchaser:</span>
                        <p className="text-sm mt-1 truncate">{voucher.purchasedBy.name || voucher.purchasedBy.email}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Recipient:</span>
                        <p className="text-sm mt-1 truncate">
                          {voucher.recipient?.name || voucher.recipientName || voucher.recipientEmail || 'Self'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Value:</span>
                        <p className="text-sm mt-1">
                          {formatKES(voucher.remainingValue)} / {formatKES(voucher.originalValue)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Expires:</span>
                        <p className="text-sm mt-1">{new Date(voucher.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {voucher.message && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <span className="font-medium text-blue-900">Message:</span>
                        <p className="text-blue-800 text-sm mt-1">{voucher.message}</p>
                      </div>
                    )}
                    <div className="flex justify-end pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateVoucherStatus(
                          voucher.id,
                          voucher.status === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE'
                        )}
                        disabled={updateVoucherStatusMutation.isPending}
                        className={`h-10 ${
                          voucher.status === 'ACTIVE' 
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                      >
                        {voucher.status === 'ACTIVE' ? 'Cancel' : 'Reactivate'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <h3 className="text-2xl font-bold">Voucher Usage History</h3>
          {usagesQuery.isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600">Loading usage history...</div>
            </div>
          ) : (
            <div className="grid gap-6">
              {usagesQuery.data?.map((usage: VoucherUsage) => (
                <Card key={usage.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Voucher:</span>
                        <p className="text-sm font-mono mt-1">{usage.voucher.code}</p>
                        <p className="text-xs text-gray-600 mt-1">{usage.voucher.template.name}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Amount Used:</span>
                        <p className="text-lg font-bold text-primary mt-1">{formatKES(usage.amountUsed)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Used For:</span>
                        <p className="text-sm mt-1 truncate">{usage.booking?.service.title || 'Direct usage'}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium text-gray-700 block">Used At:</span>
                        <p className="text-sm mt-1">{new Date(usage.usedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {usage.notes && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <span className="font-medium text-yellow-900">Notes:</span>
                        <p className="text-yellow-800 text-sm mt-1">{usage.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {showTemplateForm && (
        <GiftVoucherTemplateForm
          template={
            editingTemplate
              ? {
                  id: editingTemplate.id,
                  name: editingTemplate.name,
                  description: editingTemplate.description,
                  type: editingTemplate.type,
                  value: editingTemplate.value,
                  price: editingTemplate.price,
                  serviceId: editingTemplate.serviceId,
                  isActive: editingTemplate.isActive,
                  validityDays: editingTemplate.validityDays,
                  maxUsageCount: editingTemplate.maxUsageCount,
                  imageUrl: editingTemplate.imageUrl,
                  imageUuid: editingTemplate.imageUuid,
                }
              : undefined
          }
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            templatesQuery.refetch();
          }}
        />
      )}
    </div>
  );
}
