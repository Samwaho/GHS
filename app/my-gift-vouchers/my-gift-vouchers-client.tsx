'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Copy, Calendar, DollarSign, Clock, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatKES } from '@/lib/currency';

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

  type Voucher = NonNullable<typeof vouchersQuery.data>[number];
  type VoucherUsage = Voucher["usages"][number];

  const formatValue = (voucher: Voucher) => {
    if (voucher.template.type === 'PERCENTAGE') {
      return `${voucher.template.value}% OFF`;
    }

    if (voucher.template.type === 'SERVICE_SPECIFIC' && voucher.template.service) {
      return voucher.template.service.title;
    }

    return formatKES(voucher.originalValue);
  };

  const isExpired = (expiresAt: string | Date) => {
    return new Date(expiresAt) < new Date();
  };

  const isExpiringSoon = (expiresAt: string | Date) => {
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
        <p className="text-gray-600 mb-6">You haven&apos;t purchased any gift vouchers yet.</p>
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

  const totalRemainingValue = vouchersQuery.data.reduce((sum, voucher) => sum + voucher.remainingValue, 0);
  const expiringSoonCount = vouchersQuery.data.filter(
    (voucher) => voucher.status === 'ACTIVE' && isExpiringSoon(voucher.expiresAt)
  ).length;
  const giftedCount = vouchersQuery.data.filter((voucher) => Boolean(voucher.recipientName)).length;

  const renderVoucherCard = (voucher: Voucher) => (
    <Card key={voucher.id} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{voucher.template.name}</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
              <p className="text-sm text-gray-600">
                Code: <span className="font-mono font-semibold">{voucher.code}</span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 self-start sm:self-center"
                onClick={() => copyToClipboard(voucher.code)}
              >
                <Copy className={`w-3 h-3 ${copiedCode === voucher.code ? 'text-green-600' : ''}`} />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row items-start sm:items-end">
            {getStatusBadge(voucher.status)}
            {getTypeBadge(voucher.template.type)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium flex items-center gap-1 text-gray-700">
                <DollarSign className="w-3 h-3" />
                Value:
              </span>
              <p className="text-lg font-bold text-primary mt-1">{formatValue(voucher)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-700">Price Paid:</span>
              <p className="text-lg font-bold text-green-600 mt-1">{formatKES(voucher.purchasePrice)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium text-gray-700">Remaining:</span>
              <p className="text-lg font-bold mt-1">{formatKES(voucher.remainingValue)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="font-medium flex items-center gap-1 text-gray-700">
                <Calendar className="w-3 h-3" />
                Expires:
              </span>
              <p className={`mt-1 ${isExpiringSoon(voucher.expiresAt) ? 'text-orange-600 font-semibold' : ''}`}>
                {new Date(voucher.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2 lg:col-span-1">
              <span className="font-medium text-gray-700">Purchased:</span>
              <p className="mt-1">{new Date(voucher.createdAt).toLocaleDateString()}</p>
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
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-800">Usage History:</h4>
              <div className="space-y-2">
                {voucher.usages.map((usage: VoucherUsage) => (
                  <div key={usage.id} className="p-3 bg-gray-50 rounded-lg border text-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{formatKES(usage.amountUsed)} used</p>
                        {usage.booking && (
                          <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            For: {usage.booking.service.title} at {usage.booking.branch.name}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                        {new Date(usage.usedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Your Gift Vouchers</h2>
          <p className="text-gray-600 mt-1">Total vouchers: {vouchersQuery.data.length}</p>
        </div>
        <Link href="/gift-vouchers">
          <Button className="w-full sm:w-auto">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Buy More Vouchers
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-600 mb-2">Remaining value</p>
          <p className="text-3xl font-semibold text-gray-900">{formatKES(totalRemainingValue)}</p>
          <p className="text-sm text-gray-500 mt-1">Across all active vouchers</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Expiring soon</p>
          <p className="text-3xl font-semibold text-gray-900">{expiringSoonCount}</p>
          <p className="text-sm text-gray-500 mt-1">Within the next 30 days</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-2">Gifted to others</p>
          <p className="text-3xl font-semibold text-gray-900">{giftedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Personal transfers or surprises</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="active" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Active</span>
            <span className="sm:hidden">Active</span>
            <span className="ml-1">({activeVouchers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="used" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Used</span>
            <span className="sm:hidden">Used</span>
            <span className="ml-1">({usedVouchers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="expired" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Expired</span>
            <span className="sm:hidden">Expired</span>
            <span className="ml-1">({expiredVouchers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm py-2">
            <span className="hidden sm:inline">Cancelled</span>
            <span className="sm:hidden">Cancelled</span>
            <span className="ml-1">({cancelledVouchers.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No active vouchers</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="used" className="space-y-4 mt-6">
          {usedVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No used vouchers</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {usedVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4 mt-6">
          {expiredVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No expired vouchers</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {expiredVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-6">
          {cancelledVouchers.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No cancelled vouchers</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {cancelledVouchers.map(renderVoucherCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
