import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("deals.calculateTier", () => {
  const tiers = [
    { minimumBookings: 5, price: 525 },
    { minimumBookings: 10, price: 450 },
    { minimumBookings: 20, price: 399 },
    { minimumBookings: 30, price: 349 },
  ];

  it("returns the current, next, remaining, and savings values for an active tier", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.deals.calculateTier({ currentBookings: 17, normalPrice: 600, tiers });
    expect(result).toEqual({ currentPrice: 450, nextPrice: 399, remaining: 3, savings: 150 });
  });

  it("returns the best price with no next tier once capacity is exceeded", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.deals.calculateTier({ currentBookings: 31, normalPrice: 600, tiers });
    expect(result).toEqual({ currentPrice: 349, nextPrice: null, remaining: 0, savings: 251 });
  });
});
