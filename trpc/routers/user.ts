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
} from "@/lib/mail";
import z from "zod";

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
        }
      });

      if (!booking) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
      }

      if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot cancel this booking' });
      }

      return await prisma.booking.update({
        where: { id: input.bookingId },
        data: { status: 'CANCELLED' }
      });
    }),

  // Create a new booking
  createBooking: protectedProcedure
    .input(z.object({
      serviceId: z.string(),
      branchId: z.string(),
      scheduledAt: z.string(), // ISO date string
      notes: z.string().optional()
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

      return await prisma.booking.create({
        data: {
          userId,
          serviceId: input.serviceId,
          branchId: input.branchId,
          branchServiceId: branchService.id,
          scheduledAt: new Date(input.scheduledAt),
          totalPrice: branchService.price,
          notes: input.notes,
          status: 'PENDING'
        },
        include: {
          service: {
            include: {
              category: true
            }
          },
          branch: true,
          branchService: true
        }
      });
    }),
});
