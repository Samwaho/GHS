-- CreateEnum
CREATE TYPE "public"."GiftVoucherStatus" AS ENUM ('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."GiftVoucherType" AS ENUM ('FIXED_AMOUNT', 'PERCENTAGE', 'SERVICE_SPECIFIC');

-- CreateTable
CREATE TABLE "public"."gift_voucher_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."GiftVoucherType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "serviceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validityDays" INTEGER NOT NULL DEFAULT 365,
    "maxUsageCount" INTEGER,
    "currentUsageCount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "imageUuid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "gift_voucher_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gift_vouchers" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "purchasedById" TEXT NOT NULL,
    "recipientId" TEXT,
    "recipientEmail" TEXT,
    "recipientName" TEXT,
    "status" "public"."GiftVoucherStatus" NOT NULL DEFAULT 'ACTIVE',
    "originalValue" DOUBLE PRECISION NOT NULL,
    "remainingValue" DOUBLE PRECISION NOT NULL,
    "purchasePrice" DOUBLE PRECISION NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gift_voucher_usages" (
    "id" TEXT NOT NULL,
    "voucherId" TEXT NOT NULL,
    "bookingId" TEXT,
    "amountUsed" DOUBLE PRECISION NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "gift_voucher_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gift_vouchers_code_key" ON "public"."gift_vouchers"("code");

-- AddForeignKey
ALTER TABLE "public"."gift_voucher_templates" ADD CONSTRAINT "gift_voucher_templates_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_voucher_templates" ADD CONSTRAINT "gift_voucher_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_vouchers" ADD CONSTRAINT "gift_vouchers_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."gift_voucher_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_vouchers" ADD CONSTRAINT "gift_vouchers_purchasedById_fkey" FOREIGN KEY ("purchasedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_vouchers" ADD CONSTRAINT "gift_vouchers_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_voucher_usages" ADD CONSTRAINT "gift_voucher_usages_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "public"."gift_vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gift_voucher_usages" ADD CONSTRAINT "gift_voucher_usages_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
