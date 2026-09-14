import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const societies = mysqlTable("societies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  address: text("address"),
  residentCount: int("residentCount").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "active", "suspended"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const societyMembers = mysqlTable("societyMembers", {
  id: int("id").autoincrement().primaryKey(),
  societyId: int("societyId").notNull(),
  userId: int("userId").notNull(),
  flatNumber: varchar("flatNumber", { length: 32 }),
  memberRole: mysqlEnum("memberRole", ["resident", "secretary"]).default("resident").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  businessName: varchar("businessName", { length: 160 }).notNull(),
  city: varchar("city", { length: 80 }).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00").notNull(),
  servicesCompleted: int("servicesCompleted").default(0).notNull(),
  yearsExperience: int("yearsExperience").default(0).notNull(),
  verified: boolean("verified").default(false).notNull(),
  onTimeRate: int("onTimeRate").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 16 }),
  active: boolean("active").default(true).notNull(),
});

export const bulkDeals = mysqlTable("bulkDeals", {
  id: int("id").autoincrement().primaryKey(),
  societyId: int("societyId").notNull(),
  serviceId: int("serviceId").notNull(),
  vendorId: int("vendorId"),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  targetBookings: int("targetBookings").notNull(),
  currentBookings: int("currentBookings").default(0).notNull(),
  normalPrice: int("normalPrice").notNull(),
  serviceDate: timestamp("serviceDate").notNull(),
  bookingDeadline: timestamp("bookingDeadline").notNull(),
  status: mysqlEnum("status", ["draft", "live", "unlocked", "completed", "cancelled"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const bulkPricingTiers = mysqlTable("bulkPricingTiers", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId").notNull(),
  minimumBookings: int("minimumBookings").notNull(),
  price: int("price").notNull(),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId").notNull(),
  userId: int("userId").notNull(),
  flatNumber: varchar("flatNumber", { length: 32 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  timeSlot: varchar("timeSlot", { length: 80 }),
  pricePerUnit: int("pricePerUnit").notNull(),
  status: mysqlEnum("status", ["confirmed", "vendor_assigned", "in_progress", "completed", "cancelled"]).default("confirmed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  amount: int("amount").notNull(),
  platformFee: int("platformFee").default(0).notNull(),
  savings: int("savings").default(0).notNull(),
  status: mysqlEnum("status", ["mock_pending", "paid", "refunded"]).default("mock_pending").notNull(),
  paidAt: timestamp("paidAt"),
});

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  bookingId: int("bookingId").notNull(),
  vendorId: int("vendorId").notNull(),
  userId: int("userId").notNull(),
  quality: int("quality").notNull(),
  professionalism: int("professionalism").notNull(),
  punctuality: int("punctuality").notNull(),
  valueForMoney: int("valueForMoney").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  kind: varchar("kind", { length: 48 }).notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const serviceRequests = mysqlTable("serviceRequests", {
  id: int("id").autoincrement().primaryKey(),
  societyId: int("societyId").notNull(),
  createdBy: int("createdBy").notNull(),
  requestedService: varchar("requestedService", { length: 160 }).notNull(),
  interestCount: int("interestCount").default(1).notNull(),
  targetInterest: int("targetInterest").notNull(),
  estimatedPrice: int("estimatedPrice"),
  status: mysqlEnum("status", ["collecting", "converted", "closed"]).default("collecting").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vendorQuotes = mysqlTable("vendorQuotes", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId").notNull(),
  vendorId: int("vendorId").notNull(),
  pricePerService: int("pricePerService").notNull(),
  warranty: varchar("warranty", { length: 120 }),
  completionMinutes: int("completionMinutes"),
  availableDate: timestamp("availableDate"),
  score: decimal("score", { precision: 5, scale: 2 }),
  status: mysqlEnum("status", ["submitted", "shortlisted", "selected", "declined"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const supportTickets = mysqlTable("supportTickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  bookingId: int("bookingId"),
  category: varchar("category", { length: 80 }).notNull(),
  subject: varchar("subject", { length: 180 }).notNull(),
  description: text("description").notNull(),
  status: mysqlEnum("status", ["open", "in_review", "resolved"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  dealId: int("dealId").notNull(),
  inviterUserId: int("inviterUserId").notNull(),
  inviteeContact: varchar("inviteeContact", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["sent", "joined"]).default("sent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type BulkDeal = typeof bulkDeals.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
