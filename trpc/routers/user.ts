import { baseProcedure, protectedProcedure, createTRPCRouter } from "../init";
import {
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from "@/schemas";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendGiftVoucherPurchaseEmail,
  sendGiftVoucherDeliveryEmail,
} from "@/lib/mail";
import z from "zod";

// Helper function to generate unique voucher codes
function generateVoucherCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const userRouter = createTRPCRouter({
  // Register a new user
  register: baseProcedure.input(registerSchema).mutation(async ({ input }) => {
    const { email, password, name } = input;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new TRPCError({ code: "CONFLICT", message: "User already exists" });
    }
    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: true, message: "Verify your email. Check your inbox." };
  }),
  // Login a user
  login: baseProcedure.input(loginSchema).mutation(async ({ input }) => {
    const { email, password, twoFactorToken } = input;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });
    if (!existingUser || !existingUser.email || !existingUser.password) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
      return {
        success: true,
        message: "Verify your email. Check your inbox.",
        verifyEmail: true,
      };
    }
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (twoFactorToken) {
        const existingTwoFactorToken = await prisma.twoFactorToken.findFirst({
          where: { email: existingUser.email },
        });
        if (!existingTwoFactorToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid two-factor token",
          });
        }
        if (existingTwoFactorToken.token !== twoFactorToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid two-factor token",
          });
        }
        const hasExpired =
          new Date(existingTwoFactorToken.expires) < new Date();
        if (hasExpired) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Two-factor token expired",
          });
        }
        await prisma.twoFactorToken.delete({
          where: { id: existingTwoFactorToken.id },
        });

        const existingTwoFactorConfirmation =
          await prisma.twoFactorConfirmation.findFirst({
            where: { userId: existingUser.id },
          });
        if (existingTwoFactorConfirmation) {
          await prisma.twoFactorConfirmation.delete({
            where: { id: existingTwoFactorConfirmation.id },
          });
        }
        await prisma.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          },
        });
      } else {
        const newTwoFactorToken = await generateTwoFactorToken(
          existingUser.email
        );
        await sendTwoFactorEmail(existingUser.email, newTwoFactorToken.token);
        return { twoFactorEnabled: true };
      }
    }
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid credentials",
            });
          default:
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Something went wrong",
            });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  verifyEmail: baseProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const { token } = input;
      const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
      });
      if (!verificationToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      }
      const hasExpired = new Date(verificationToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Token expired" });
      }
      const existingUser = await prisma.user.findFirst({
        where: { email: verificationToken.email },
      });
      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date() },
      });
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      // Send welcome email after successful verification
      if (existingUser.name) {
        await sendWelcomeEmail(existingUser.email, existingUser.name);
      }

      return { success: true, message: "Email verified successfully" };
    }),
  resetPassword: baseProcedure
    .input(resetSchema)
    .mutation(async ({ input }) => {
      const { email } = input;
      const existingUser = await prisma.user.findFirst({
        where: { email },
      });
      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const resetToken = await generatePasswordResetToken(email);
      await sendPasswordResetEmail(resetToken.email, resetToken.token);
      return { success: true, message: "Reset password link sent to email" };
    }),
  newPassword: baseProcedure
    .input(newPasswordSchema)
    .mutation(async ({ input }) => {
      const { password, token } = input;

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
      });
      if (!resetToken) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid token" });
      }
      const hasExpired = new Date(resetToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Token expired" });
      }
      const existingUser = await prisma.user.findFirst({
        where: { email: resetToken.email },
      });
      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return { success: true, message: "Password reset successfully" };
    }),

  // Get user's bookings
  getMyBookings: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
      }

      return await prisma.booking.findMany({
        where: { userId },
        include: {
          service: {
            include: {
              category: true
            }
          },
          branch: true,
          branchService: true
        },
        orderBy: { scheduledAt: 'desc' }
      });
    }),

  // Cancel a booking
  cancelBooking: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const booking = await prisma.booking.findFirst({
        where: {
          id: input.bookingId,
          userId: ctx.session.user.id
        },
        include: {
          service: {
            select: {
              title: true
            }
          },
          branch: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      if (!booking) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
      }

      if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot cancel this booking' });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: input.bookingId },
        data: { status: 'CANCELLED' }
      });

      // Send booking cancellation email
      if (booking.user?.email && booking.user?.name) {
        await sendBookingCancellationEmail(
          booking.user.email,
          booking.user.name,
          {
            id: booking.id,
            serviceName: booking.service.title,
            branchName: booking.branch.name,
            scheduledAt: booking.scheduledAt.toISOString()
          }
        );
      }

      return updatedBooking;
    }),

  // Create a new booking
  createBooking: protectedProcedure
    .input(z.object({
      serviceId: z.string(),
      branchId: z.string(),
      scheduledAt: z.string(), // ISO date string
      notes: z.string().optional(),
      attachmentUrl: z.string().optional(),
      attachmentUuid: z.string().optional(),
      giftVoucherCode: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
      }

      // Check if branch service exists
      const branchService = await prisma.branchService.findFirst({
        where: {
          serviceId: input.serviceId,
          branchId: input.branchId,
          isAvailable: true
        }
      });

      if (!branchService) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Service not available at this branch' });
      }

      let finalPrice = branchService.price;
      let giftVoucher = null;
      let voucherUsageAmount = 0;

      // Handle gift voucher if provided
      if (input.giftVoucherCode) {
        giftVoucher = await prisma.giftVoucher.findUnique({
          where: { code: input.giftVoucherCode },
          include: { template: { include: { service: true } } }
        });

        if (!giftVoucher) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Gift voucher not found' });
        }

        if (giftVoucher.status !== 'ACTIVE') {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher is not active' });
        }

        if (giftVoucher.expiresAt < new Date()) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher has expired' });
        }

        if (giftVoucher.remainingValue <= 0) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher has no remaining value' });
        }

        // Check if voucher is service-specific
        if (giftVoucher.template.type === 'SERVICE_SPECIFIC' && giftVoucher.template.serviceId !== input.serviceId) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher is not valid for this service' });
        }

        // Calculate discount
        if (giftVoucher.template.type === 'FIXED_AMOUNT') {
          voucherUsageAmount = Math.min(giftVoucher.remainingValue, finalPrice);
        } else if (giftVoucher.template.type === 'PERCENTAGE') {
          voucherUsageAmount = Math.min(giftVoucher.remainingValue, (finalPrice * giftVoucher.template.value) / 100);
        } else if (giftVoucher.template.type === 'SERVICE_SPECIFIC') {
          voucherUsageAmount = Math.min(giftVoucher.remainingValue, finalPrice);
        }

        finalPrice = Math.max(0, finalPrice - voucherUsageAmount);
      }

      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          userId,
          serviceId: input.serviceId,
          branchId: input.branchId,
          branchServiceId: branchService.id,
          scheduledAt: new Date(input.scheduledAt),
          totalPrice: finalPrice,
          notes: input.notes,
          attachmentUrl: input.attachmentUrl,
          attachmentUuid: input.attachmentUuid,
          status: 'PENDING'
        },
        include: {
          service: {
            include: {
              category: true
            }
          },
          branch: true,
          branchService: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });

      // Record gift voucher usage if applicable
      if (giftVoucher && voucherUsageAmount > 0) {
        await prisma.giftVoucherUsage.create({
          data: {
            voucherId: giftVoucher.id,
            bookingId: booking.id,
            amountUsed: voucherUsageAmount,
            notes: `Used for booking ${booking.id}`
          }
        });

        // Update voucher remaining value
        const newRemainingValue = giftVoucher.remainingValue - voucherUsageAmount;
        await prisma.giftVoucher.update({
          where: { id: giftVoucher.id },
          data: {
            remainingValue: newRemainingValue,
            status: newRemainingValue <= 0 ? 'USED' : 'ACTIVE',
            usedAt: newRemainingValue <= 0 ? new Date() : undefined
          }
        });
      }

      // Send booking confirmation email
      if (booking.user?.email && booking.user?.name) {
        await sendBookingConfirmationEmail(
          booking.user.email,
          booking.user.name,
          {
            id: booking.id,
            serviceName: booking.service.title,
            branchName: booking.branch.name,
            scheduledAt: booking.scheduledAt.toISOString(),
            totalPrice: booking.totalPrice,
            notes: booking.notes || undefined
          }
        );
      }

      return booking;
    }),

  // Gift Voucher Procedures
  getAvailableGiftVoucherTemplates: baseProcedure.query(async () => {
    return await prisma.giftVoucherTemplate.findMany({
      where: {
        isActive: true,
        OR: [
          { maxUsageCount: null },
          { currentUsageCount: { lt: prisma.giftVoucherTemplate.fields.maxUsageCount } }
        ]
      },
      include: {
        service: { select: { title: true, basePrice: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }),

  purchaseGiftVoucher: protectedProcedure
    .input(z.object({
      templateId: z.string(),
      recipientEmail: z.string().email({ message: "Invalid email address" }).optional(),
      recipientName: z.string().optional(),
      message: z.string().optional(),
      purchasePrice: z.number().min(0)
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
      }

      // Get the template
      const template = await prisma.giftVoucherTemplate.findUnique({
        where: { id: input.templateId },
        include: { service: true }
      });

      if (!template || !template.isActive) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Gift voucher template not found or inactive' });
      }

      // Check usage limit
      if (template.maxUsageCount && template.currentUsageCount >= template.maxUsageCount) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher template has reached maximum usage limit' });
      }

      // Find recipient user if email provided
      let recipientId = null;
      if (input.recipientEmail) {
        const recipient = await prisma.user.findUnique({
          where: { email: input.recipientEmail }
        });
        recipientId = recipient?.id || null;
      }

      // Generate unique voucher code
      let voucherCode;
      let isUnique = false;
      while (!isUnique) {
        voucherCode = generateVoucherCode();
        const existing = await prisma.giftVoucher.findUnique({
          where: { code: voucherCode }
        });
        if (!existing) isUnique = true;
      }

      // Calculate voucher value
      let voucherValue = input.purchasePrice;
      if (template.type === 'FIXED_AMOUNT') {
        voucherValue = template.value;
      } else if (template.type === 'SERVICE_SPECIFIC' && template.service) {
        voucherValue = template.service.basePrice;
      }

      // Create the gift voucher
      const voucher = await prisma.giftVoucher.create({
        data: {
          code: voucherCode!,
          templateId: input.templateId,
          purchasedById: userId,
          recipientId,
          recipientEmail: input.recipientEmail,
          recipientName: input.recipientName,
          originalValue: voucherValue,
          remainingValue: voucherValue,
          purchasePrice: input.purchasePrice,
          expiresAt: new Date(Date.now() + template.validityDays * 24 * 60 * 60 * 1000),
          message: input.message
        },
        include: {
          template: { include: { service: true } },
          purchasedBy: { select: { name: true, email: true } },
          recipient: { select: { name: true, email: true } }
        }
      });

      // Update template usage count
      await prisma.giftVoucherTemplate.update({
        where: { id: input.templateId },
        data: { currentUsageCount: { increment: 1 } }
      });

      // Send purchase confirmation email to purchaser
      if (voucher.purchasedBy?.email && voucher.purchasedBy?.name) {
        await sendGiftVoucherPurchaseEmail(
          voucher.purchasedBy.email,
          voucher.purchasedBy.name,
          {
            code: voucher.code,
            templateName: voucher.template.name,
            originalValue: voucher.originalValue,
            expiresAt: voucher.expiresAt.toISOString(),
            recipientEmail: voucher.recipientEmail || undefined,
            recipientName: voucher.recipientName || undefined,
            message: voucher.message || undefined
          }
        );
      }

      // Send gift voucher delivery email to recipient if email provided
      if (voucher.recipientEmail && voucher.recipientName && voucher.purchasedBy?.name) {
        await sendGiftVoucherDeliveryEmail(
          voucher.recipientEmail,
          voucher.recipientName,
          voucher.purchasedBy.name,
          {
            code: voucher.code,
            templateName: voucher.template.name,
            originalValue: voucher.originalValue,
            expiresAt: voucher.expiresAt.toISOString(),
            message: voucher.message || undefined
          }
        );
      }

      return voucher;
    }),

  getMyGiftVouchers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User not found' });
    }

    return await prisma.giftVoucher.findMany({
      where: {
        OR: [
          { purchasedById: userId },
          { recipientId: userId }
        ]
      },
      include: {
        template: { include: { service: true } },
        purchasedBy: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true } },
        usages: {
          include: {
            booking: {
              include: {
                service: { select: { title: true } },
                branch: { select: { name: true } }
              }
            }
          },
          orderBy: { usedAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }),

  validateGiftVoucher: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const voucher = await prisma.giftVoucher.findUnique({
        where: { code: input.code },
        include: {
          template: { include: { service: true } }
        }
      });

      if (!voucher) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Gift voucher not found' });
      }

      if (voucher.status !== 'ACTIVE') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher is not active' });
      }

      if (voucher.expiresAt < new Date()) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher has expired' });
      }

      if (voucher.remainingValue <= 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Gift voucher has no remaining value' });
      }

      return voucher;
    }),
});
