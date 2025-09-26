
import { adminProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  imageUrl: z.string().url(),
  imageUuid: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
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
    .mutation(async ({ input }) => {
      return await prisma.booking.update({
        where: { id: input.id },
        data: { 
          status: input.status,
          adminNotes: input.adminNotes,
        },
      });
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
    .mutation(async ({ input }) => {
      return await prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });
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
});