'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Copy, Eye, Calendar, DollarSign, Clock, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function MyGiftVouchersClient() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const t = useTRPC();

  const vouchersQuery = useQuery(t.user.getMyGiftVouchers.queryOptions());

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Voucher code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      ACTIVE: 'default',
      USED: 'secondary',
      EXPIRED: 'destructive',
      CANCELLED: 'outline',
    };
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      USED: 'bg-gray-100 text-gray-800',
      EXPIRED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <Badge variant={variants[status] || 'outline'} className={colors[status]}>
        {status}
      </Badge>
    );
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

  const formatValue = (voucher: any) => {
    if (voucher.template.type === 'PERCENTAGE') {
      return `${voucher.template.value}% OFF`;
    } else if (voucher.template.type === 'SERVICE_SPECIFIC' && voucher.template.service) {
      return voucher.template.service.title;
    } else {
      return `$${voucher.originalValue}`;
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const isExpiringSoon = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  if (vouchersQuery.isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-lg text-gray-600">Loading your gift vouchers...</div>
      </div>
    );
  }

  if (!vouchersQuery.data || vouchersQuery.data.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gift Vouchers Yet</h3>
        <p className="text-gray-600 mb-6">You haven't purchased any gift vouchers yet.</p>
        <Link href="/gift-vouchers">
          <Button>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Gift Vouchers
          </Button>
        </Link>
      </div>
    );
  }

  const activeVouchers = vouchersQuery.data.filter(v => v.status === 'ACTIVE' && !isExpired(v.expiresAt));
  const usedVouchers = vouchersQuery.data.filter(v => v.status === 'USED');
  const expiredVouchers = vouchersQuery.data.filter(v => v.status === 'EXPIRED' || isExpired(v.expiresAt));
  const cancelledVouchers = vouchersQuery.data.filter(v => v.status === 'CANCELLED');

  const renderVoucherCard = (voucher: any) => (
    <Card key={voucher.id} className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5" />
              {voucher.template.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Code: <span className="font-mono font-semibold">{voucher.code}</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6 p-0"
                onClick={() => copyToClipboard(voucher.code)}
              >
                <Copy className={`w-3 h-3 ${copiedCode === voucher.code ? 'text-green-600' : ''}`} />
              </Button>
            </p>
          </div>
          <div className="flex gap-2 flex-col items-end">
            {getStatusBadge(voucher.status)}
            {getTypeBadge(voucher.template.type)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Value:
              </span>
              <p className="text-lg font-bold text-primary">{formatValue(voucher)}</p>
            </div>
            <div>
              <span className="font-medium">Remaining:</span>
              <p className="text-lg font-bold">${voucher.remainingValue}</p>
            </div>
            <div>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Expires:
              </span>
              <p className={isExpiringSoon(voucher.expiresAt) ? 'text-orange-600 font-semibold' : ''}>
                {new Date(voucher.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="font-medium">Purchased:</span>
              <p>{new Date(voucher.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {voucher.message && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Message:</span>
              <p className="text-blue-800 text-sm mt-1">{voucher.message}</p>
            </div>
          )}

          {voucher.recipientName && (
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Gift for:</span>
              <p className="text-green-800 text-sm mt-1">
                {voucher.recipientName} ({voucher.recipientEmail})
              </p>
            </div>
          )}

          {isExpiringSoon(voucher.expiresAt) && voucher.status === 'ACTIVE' && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Expiring Soon!</span>
              </div>
              <p className="text-orange-700 text-sm mt-1">
                This voucher expires in {Math.ceil((new Date(voucher.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.
              </p>
            </div>
          )}

          {voucher.usages && voucher.usages.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Usage History:</h4>
              {voucher.usages.map((usage: any) => (
                <div key={usage.id} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">${usage.amountUsed} used</p>
                      {usage.booking && (
                        <p className="text-gray-600">
                          For: {usage.booking.service.title} at {usage.booking.branch.name}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-500">
                      {new Date(usage.usedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Gift Vouchers</h2>
          <p className="text-gray-600">Total vouchers: {vouchersQuery.data.length}</p>
        </div>
        <Link href="/gift-vouchers">
          <Button>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Buy More Vouchers
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Active ({activeVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="used">
            Used ({usedVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredVouchers.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledVouchers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeVouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No active vouchers</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          {usedVouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No used vouchers</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {usedVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredVouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No expired vouchers</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {expiredVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledVouchers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No cancelled vouchers</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cancelledVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
