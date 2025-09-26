
import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/db";
import { z } from "zod";

export const publicRouter = createTRPCRouter({
  // Get all active services with categories
  getServices: baseProcedure.query(async () => {
    return await prisma.service.findMany({
      where: { status: 'ACTIVE' },
      include: { 
        category: true,
        _count: { select: { bookings: true } }
      },
      orderBy: [
        { isPopular: 'desc' },
        { createdAt: 'desc' }
      ],
    });
  }),

  // Get services by category
  getServicesByCategory: baseProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.service.findMany({
        where: { 
          status: 'ACTIVE',
          categoryId: input.categoryId 
        },
        include: { 
          category: true,
          _count: { select: { bookings: true } }
        },
        orderBy: [
          { isPopular: 'desc' },
          { createdAt: 'desc' }
        ],
      });
    }),

  // Get all categories with service counts
  getCategories: baseProcedure.query(async () => {
    return await prisma.category.findMany({
      include: { 
        _count: { 
          select: { 
            services: { 
              where: { status: 'ACTIVE' } 
            } 
          } 
        } 
      },
      orderBy: { name: 'asc' },
    });
  }),

  // Get service details by ID
  getServiceById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.service.findUnique({
        where: { 
          id: input.id,
          status: 'ACTIVE'
        },
        include: { 
          category: true,
          _count: { select: { bookings: true } }
        },
      });
    }),

  // Get popular services
  getPopularServices: baseProcedure.query(async () => {
    return await prisma.service.findMany({
      where: { 
        status: 'ACTIVE',
        isPopular: true 
      },
      include: { 
        category: true,
        _count: { select: { bookings: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  }),

  // Search services
  searchServices: baseProcedure
    .input(z.object({ 
      query: z.string().min(1),
      categoryId: z.string().optional()
    }))
    .query(async ({ input }) => {
      const whereClause: any = {
        status: 'ACTIVE',
        OR: [
          { title: { contains: input.query, mode: 'insensitive' } },
          { description: { contains: input.query, mode: 'insensitive' } },
          { category: { name: { contains: input.query, mode: 'insensitive' } } }
        ]
      };

      if (input.categoryId) {
        whereClause.categoryId = input.categoryId;
      }

      return await prisma.service.findMany({
        where: whereClause,
        include: { 
          category: true,
          _count: { select: { bookings: true } }
        },
        orderBy: [
          { isPopular: 'desc' },
          { createdAt: 'desc' }
        ],
      });
    }),

  // Get branches with their services
  getBranches: baseProcedure.query(async () => {
    return await prisma.branch.findMany({
      where: { isActive: true },
      include: {
        branchServices: {
          where: {
            isAvailable: true,
            service: { status: 'ACTIVE' }
          },
          include: {
            service: {
              include: { category: true }
            }
          }
        },
        _count: { select: { bookings: true } }
      },
      orderBy: { name: 'asc' },
    });
  }),

  // Get branch services for a specific branch
  getBranchServices: baseProcedure
    .input(z.object({ branchId: z.string() }))
    .query(async ({ input }) => {
      const branchServices = await prisma.branchService.findMany({
        where: {
          branchId: input.branchId,
          isAvailable: true
        },
        include: {
          service: {
            include: { category: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      });

      // Filter out inactive services
      return branchServices.filter(bs => bs.service.status === 'ACTIVE');
    }),

  // Gallery
  getGalleryItems: baseProcedure.query(async () => {
    return await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }),
});
