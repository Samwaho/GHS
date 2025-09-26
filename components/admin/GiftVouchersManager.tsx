'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import GiftVoucherTemplateForm from './GiftVoucherTemplateForm';

export default function GiftVouchersManager() {
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const t = useTRPC();

  // Queries
  const templatesQuery = useQuery(t.admin.getGiftVoucherTemplates.queryOptions());
  const vouchersQuery = useQuery(t.admin.getGiftVouchers.queryOptions());
  const usagesQuery = useQuery(t.admin.getGiftVoucherUsages.queryOptions());

  // Mutations
  const deleteTemplateMutation = useMutation(t.admin.deleteGiftVoucherTemplate.mutationOptions());
  const updateVoucherStatusMutation = useMutation(t.admin.updateGiftVoucherStatus.mutationOptions());

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this gift voucher template?')) {
      try {
        await deleteTemplateMutation.mutateAsync({ id });
        toast.success('Gift voucher template deleted successfully');
        templatesQuery.refetch();
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete template');
      }
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setShowTemplateForm(true);
  };

  const handleUpdateVoucherStatus = async (id: string, status: 'ACTIVE' | 'CANCELLED' | 'USED' | 'EXPIRED') => {
    try {
      await updateVoucherStatusMutation.mutateAsync({ id, status });
      toast.success('Gift voucher status updated successfully');
      vouchersQuery.refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update voucher status');
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
    <div className="space-y-6">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="usage">Usage History</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Gift Voucher Templates</h3>
            <Button onClick={() => setShowTemplateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {templatesQuery.isLoading ? (
            <div>Loading templates...</div>
          ) : (
            <div className="grid gap-4">
              {templatesQuery.data?.map((template: any) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {getTypeBadge(template.type)}
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Value:</span>
                        <p>
                          {template.type === 'PERCENTAGE' ? `${template.value}%` : `$${template.value}`}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Validity:</span>
                        <p>{template.validityDays} days</p>
                      </div>
                      <div>
                        <span className="font-medium">Usage:</span>
                        <p>
                          {template._count.giftVouchers}
                          {template.maxUsageCount ? ` / ${template.maxUsageCount}` : ' (unlimited)'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Service:</span>
                        <p>{template.service?.title || 'Any service'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        disabled={deleteTemplateMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="vouchers" className="space-y-4">
          <h3 className="text-lg font-semibold">Purchased Gift Vouchers</h3>
          {vouchersQuery.isLoading ? (
            <div>Loading vouchers...</div>
          ) : (
            <div className="grid gap-4">
              {vouchersQuery.data?.map((voucher: any) => (
                <Card key={voucher.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Code: {voucher.code}</CardTitle>
                        <p className="text-sm text-gray-600">{voucher.template.name}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(voucher.status)}
                        {getTypeBadge(voucher.template.type)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Purchaser:</span>
                        <p>{voucher.purchasedBy.name || voucher.purchasedBy.email}</p>
                      </div>
                      <div>
                        <span className="font-medium">Recipient:</span>
                        <p>
                          {voucher.recipient?.name || voucher.recipientName || voucher.recipientEmail || 'Self'}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">Value:</span>
                        <p>${voucher.remainingValue} / ${voucher.originalValue}</p>
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span>
                        <p>{new Date(voucher.expiresAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {voucher.message && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Message:</span> {voucher.message}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateVoucherStatus(
                          voucher.id,
                          voucher.status === 'ACTIVE' ? 'CANCELLED' : 'ACTIVE'
                        )}
                        disabled={updateVoucherStatusMutation.isPending}
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

        <TabsContent value="usage" className="space-y-4">
          <h3 className="text-lg font-semibold">Voucher Usage History</h3>
          {usagesQuery.isLoading ? (
            <div>Loading usage history...</div>
          ) : (
            <div className="grid gap-4">
              {usagesQuery.data?.map((usage: any) => (
                <Card key={usage.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Voucher:</span>
                        <p>{usage.voucher.code}</p>
                        <p className="text-gray-600">{usage.voucher.template.name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Amount Used:</span>
                        <p>${usage.amountUsed}</p>
                      </div>
                      <div>
                        <span className="font-medium">Used For:</span>
                        <p>{usage.booking?.service.title || 'Direct usage'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Used At:</span>
                        <p>{new Date(usage.usedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {usage.notes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Notes:</span> {usage.notes}
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
          template={editingTemplate}
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
