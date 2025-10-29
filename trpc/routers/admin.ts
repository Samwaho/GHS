
import { adminProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  sendBookingStatusUpdateEmail,
  sendUserRoleChangeEmail,
} from "@/lib/mail";

// Schemas for validation
const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().min(1),
  basePrice: z.number().min(0),
  categoryId: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  image: z.string().optional(),
  isPopular: z.boolean().default(false),
});

const branchSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  isActive: z.boolean().default(true),
});

const branchServiceSchema = z.object({
  branchId: z.string(),
  serviceId: z.string(),
  price: z.number().min(0),
  isAvailable: z.boolean().default(true),
});

const gallerySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().min(1),
  imageUuid: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
});

const giftVoucherTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["FIXED_AMOUNT", "PERCENTAGE", "SERVICE_SPECIFIC"]),
  value: z.number().min(0),
  price: z.number().min(0),
  serviceId: z.string().optional(),
  isActive: z.boolean().default(true),
  validityDays: z.number().min(1).default(365),
  maxUsageCount: z.number().min(1).optional(),
  imageUrl: z.string().optional(),
  imageUuid: z.string().optional(),
});

export const adminRouter = createTRPCRouter({
  // Categories
  getCategories: adminProcedure.query(async () => {
    return await prisma.category.findMany({
      include: { _count: { select: { services: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createCategory: adminProcedure
    .input(categorySchema)
    .mutation(async ({ input }) => {
      return await prisma.category.create({ data: input });
    }),

  updateCategory: adminProcedure
    .input(z.object({ id: z.string(), data: categorySchema }))
    .mutation(async ({ input }) => {
      return await prisma.category.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.category.delete({ where: { id: input.id } });
    }),

  // Services
  getServices: adminProcedure.query(async () => {
    return await prisma.service.findMany({
      include: { 
        category: true, 
        createdBy: { select: { name: true, email: true } },
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createService: adminProcedure
    .input(serviceSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
      return await prisma.service.create({
        data: { ...input, createdById: userId },
      });
    }),

  updateService: adminProcedure
    .input(z.object({ id: z.string(), data: serviceSchema.partial() }))
    .mutation(async ({ input }) => {
      return await prisma.service.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteService: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.service.delete({ where: { id: input.id } });
    }),

  // Branches
  getBranches: adminProcedure.query(async () => {
    return await prisma.branch.findMany({
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createBranch: adminProcedure
    .input(branchSchema)
    .mutation(async ({ input }) => {
      return await prisma.branch.create({ data: input });
    }),

  updateBranch: adminProcedure
    .input(z.object({ id: z.string(), data: branchSchema.partial() }))
    .mutation(async ({ input }) => {
      return await prisma.branch.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteBranch: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.branch.delete({ where: { id: input.id } });
    }),

  // Branch Services
  getBranchServices: adminProcedure.query(async () => {
    return await prisma.branchService.findMany({
      include: { 
        branch: { select: { name: true } },
        service: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createBranchService: adminProcedure
    .input(branchServiceSchema)
    .mutation(async ({ input }) => {
      return await prisma.branchService.create({ data: input });
    }),

  updateBranchService: adminProcedure
    .input(z.object({ id: z.string(), data: branchServiceSchema.partial() }))
    .mutation(async ({ input }) => {
      return await prisma.branchService.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteBranchService: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.branchService.delete({ where: { id: input.id } });
    }),

  // Bookings Management
  getBookings: adminProcedure.query(async () => {
    return await prisma.booking.findMany({
      include: {
        user: { select: { name: true, email: true } },
        service: { select: { title: true } },
        branch: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  updateBookingStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
      adminNotes: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the booking with user and service details before updating
      const booking = await prisma.booking.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          service: {
            select: {
              title: true
            }
          },
          branch: {
            select: {
              name: true
            }
          }
        }
      });

      if (!booking) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: input.id },
        data: {
          status: input.status,
          adminNotes: input.adminNotes,
        },
      });

      // Send status update email to user
      if (booking.user?.email && booking.user?.name) {
        await sendBookingStatusUpdateEmail(
          booking.user.email,
          booking.user.name,
          {
            id: booking.id,
            serviceName: booking.service.title,
            branchName: booking.branch.name,
            scheduledAt: booking.scheduledAt.toISOString(),
            status: input.status,
            adminNotes: input.adminNotes
          }
        );
      }

      return updatedBooking;
    }),

  // Users Management
  getUsers: adminProcedure.query(async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  updateUserRole: adminProcedure
    .input(z.object({
      id: z.string(),
      role: z.enum(["ADMIN", "USER"])
    }))
    .mutation(async ({ input, ctx }) => {
      // Get the user details before updating
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        select: {
          name: true,
          email: true,
          role: true
        }
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      // Get the admin who is making the change
      const adminUser = await prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: {
          name: true,
          email: true
        }
      });

      const updatedUser = await prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });

      // Send role change notification email to user (only if role actually changed)
      if (user.role !== input.role && user.email && user.name && adminUser?.name) {
        await sendUserRoleChangeEmail(
          user.email,
          user.name,
          input.role,
          adminUser.name
        );
      }

      return updatedUser;
    }),

  // Gallery Management
  getGalleryItems: adminProcedure.query(async () => {
    return await prisma.gallery.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }),

  createGalleryItem: adminProcedure
    .input(gallerySchema)
    .mutation(async ({ input }) => {
      return await prisma.gallery.create({ data: input });
    }),

  updateGalleryItem: adminProcedure
    .input(z.object({ id: z.string(), data: gallerySchema.partial() }))
    .mutation(async ({ input }) => {
      return await prisma.gallery.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  deleteGalleryItem: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.gallery.delete({ where: { id: input.id } });
    }),

  reorderGalleryItems: adminProcedure
    .input(z.array(z.object({ id: z.string(), order: z.number() })))
    .mutation(async ({ input }) => {
      const updatePromises = input.map(item =>
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      );
      return await Promise.all(updatePromises);
    }),

  // Gift Voucher Templates Management
  getGiftVoucherTemplates: adminProcedure.query(async () => {
    return await prisma.giftVoucherTemplate.findMany({
      include: {
        service: { select: { title: true } },
        createdBy: { select: { name: true, email: true } },
        _count: { select: { giftVouchers: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createGiftVoucherTemplate: adminProcedure
    .input(giftVoucherTemplateSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user?.id;
      if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });

      // Validate service exists if SERVICE_SPECIFIC type
      if (input.type === 'SERVICE_SPECIFIC' && !input.serviceId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Service ID is required for service-specific vouchers' });
      }

      return await prisma.giftVoucherTemplate.create({
        data: { ...input, createdById: userId },
        include: {
          service: { select: { title: true } },
          createdBy: { select: { name: true, email: true } }
        }
      });
    }),

  updateGiftVoucherTemplate: adminProcedure
    .input(z.object({ id: z.string(), data: giftVoucherTemplateSchema.partial() }))
    .mutation(async ({ input }) => {
      return await prisma.giftVoucherTemplate.update({
        where: { id: input.id },
        data: input.data,
        include: {
          service: { select: { title: true } },
          createdBy: { select: { name: true, email: true } }
        }
      });
    }),

  deleteGiftVoucherTemplate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.giftVoucherTemplate.delete({ where: { id: input.id } });
    }),

  // Gift Vouchers Management
  getGiftVouchers: adminProcedure.query(async () => {
    return await prisma.giftVoucher.findMany({
      include: {
        template: { select: { name: true, type: true } },
        purchasedBy: { select: { name: true, email: true } },
        recipient: { select: { name: true, email: true } },
        _count: { select: { usages: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }),

  updateGiftVoucherStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["ACTIVE", "USED", "EXPIRED", "CANCELLED"])
    }))
    .mutation(async ({ input }) => {
      return await prisma.giftVoucher.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  getGiftVoucherUsages: adminProcedure.query(async () => {
    return await prisma.giftVoucherUsage.findMany({
      include: {
        voucher: {
          include: {
            template: { select: { name: true } },
            purchasedBy: { select: { name: true, email: true } }
          }
        },
        booking: {
          include: {
            service: { select: { title: true } },
            user: { select: { name: true, email: true } }
          }
        }
      },
      orderBy: { usedAt: 'desc' },
    });
  }),
});