import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, User, users, bulkDeals, bulkPricingTiers, bookings, societies, vendors } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
    }
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listLiveDeals() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ deal: bulkDeals, service: { id: sql<number>`${bulkDeals.serviceId}`, name: sql<string>`''` } }).from(bulkDeals).where(eq(bulkDeals.status, "live")).orderBy(desc(bulkDeals.createdAt));
}

export async function getDealPricing(dealId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bulkPricingTiers).where(eq(bulkPricingTiers.dealId, dealId)).orderBy(bulkPricingTiers.minimumBookings);
}

export async function createBooking(input: { dealId: number; userId: number; flatNumber: string; quantity: number; timeSlot?: string; pricePerUnit: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(bookings).values({ ...input, timeSlot: input.timeSlot ?? null });
  return result;
}

export async function getSocietyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(societies).where(eq(societies.id, id)).limit(1);
  return result[0];
}

export async function listVendors(city?: string) {
  const db = await getDb();
  if (!db) return [];
  return city ? db.select().from(vendors).where(eq(vendors.city, city)).orderBy(desc(vendors.rating)) : db.select().from(vendors).orderBy(desc(vendors.rating));
}
