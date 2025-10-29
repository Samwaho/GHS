
import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  BOOKING_MIN_LEAD_TIME_MINUTES,
  BOOKING_OPENING_HOUR,
  BOOKING_CLOSING_HOUR,
  BOOKING_SLOT_INTERVAL_MINUTES,
} from "@/lib/booking-config";
import {
  addDays,
  addMinutes,
  format,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";

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

  getAvailableBookingSlots: baseProcedure
    .input(z.object({
      branchId: z.string(),
      serviceId: z.string(),
      date: z.string()
    }))
    .query(async ({ input }) => {
      const parsedDate = new Date(`${input.date}T00:00:00`);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid booking date provided." });
      }

      const branchService = await prisma.branchService.findFirst({
        where: {
          branchId: input.branchId,
          serviceId: input.serviceId,
          isAvailable: true,
        },
        include: {
          service: {
            select: {
              duration: true,
              status: true,
            },
          },
        },
      });

      if (!branchService || !branchService.service || branchService.service.status !== "ACTIVE") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This treatment is currently unavailable at the selected branch.",
        });
      }

      const serviceDuration = branchService.service.duration;
      if (!serviceDuration || serviceDuration <= 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Service duration is not configured correctly. Please contact support.",
        });
      }

      const now = new Date();
      const leadThreshold = addMinutes(now, BOOKING_MIN_LEAD_TIME_MINUTES);
      const dayStart = startOfDay(parsedDate);
      const dayEnd = addDays(dayStart, 1);

      const openingTime = setMinutes(setHours(new Date(parsedDate), BOOKING_OPENING_HOUR), 0);
      const closingTime = setMinutes(setHours(new Date(parsedDate), BOOKING_CLOSING_HOUR), 0);

      const existingBookings = await prisma.booking.findMany({
        where: {
          branchServiceId: branchService.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          scheduledAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
        include: {
          service: {
            select: {
              duration: true,
            },
          },
        },
        orderBy: { scheduledAt: "asc" },
      });

      const isSlotConflicting = (slotStart: Date) => {
        const slotEnd = addMinutes(slotStart, serviceDuration);
        return existingBookings.some((booking) => {
          const bookingDuration = booking.service?.duration ?? serviceDuration;
          const bookingStart = booking.scheduledAt;
          const bookingEnd = addMinutes(bookingStart, bookingDuration);
          return slotStart < bookingEnd && slotEnd > bookingStart;
        });
      };

      const availableSlots: string[] = [];
      let cursor = new Date(openingTime);

      while (addMinutes(cursor, serviceDuration) <= closingTime) {
        if (cursor >= leadThreshold && !isSlotConflicting(cursor)) {
          availableSlots.push(format(cursor, "HH:mm"));
        }
        cursor = addMinutes(cursor, BOOKING_SLOT_INTERVAL_MINUTES);
      }

      return {
        availableSlots,
        isFullyBooked: availableSlots.length === 0,
        serviceDuration,
      };
    }),

  // Gallery
  getGalleryItems: baseProcedure.query(async () => {
    return await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }),
});
