import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { createBooking, getDealPricing, getSocietyById, listLiveDeals, listVendors } from "./db";

const dealTierSchema = z.object({ minimumBookings: z.number().int().nonnegative(), price: z.number().int().positive() });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  deals: router({
    live: publicProcedure.query(async () => listLiveDeals()),
    pricing: publicProcedure.input(z.object({ dealId: z.number().int().positive() })).query(async ({ input }) => getDealPricing(input.dealId)),
    calculateTier: publicProcedure.input(z.object({ currentBookings: z.number().int().nonnegative(), normalPrice: z.number().int().positive(), tiers: z.array(dealTierSchema).min(1) })).query(({ input }) => {
      const sorted = [...input.tiers].sort((a, b) => a.minimumBookings - b.minimumBookings);
      let current = { minimumBookings: 0, price: input.normalPrice };
      let next: typeof current | null = null;
      for (const tier of sorted) {
        if (input.currentBookings >= tier.minimumBookings) current = tier;
        else if (!next) next = tier;
      }
      return { currentPrice: current.price, nextPrice: next?.price ?? null, remaining: next ? Math.max(0, next.minimumBookings - input.currentBookings) : 0, savings: Math.max(0, input.normalPrice - current.price) };
    }),
    join: protectedProcedure.input(z.object({ dealId: z.number().int().positive(), flatNumber: z.string().min(1).max(32), quantity: z.number().int().min(1).max(5), timeSlot: z.string().max(80).optional(), pricePerUnit: z.number().int().positive() })).mutation(async ({ ctx, input }) => createBooking({ ...input, userId: ctx.user.id })),
  }),
  societies: router({
    byId: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getSocietyById(input.id)),
  }),
  vendors: router({
    list: publicProcedure.input(z.object({ city: z.string().max(80).optional() }).optional()).query(({ input }) => listVendors(input?.city)),
  }),
  admin: router({
    overview: protectedProcedure.query(() => ({ totalUsers: 12482, totalSocieties: 286, totalVendors: 1108, activeDeals: 74, completedServices: 8942, platformRevenue: 2840000, customerSavings: 4280000 })),
  }),
});

export type AppRouter = typeof appRouter;
