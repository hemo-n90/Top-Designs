import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Material types enum
export const MATERIAL_TYPES = ["ألمنيوم", "خشب", "صاج", "فورميكا"] as const;
export type MaterialType = typeof MATERIAL_TYPES[number];

// Order statuses
export const ORDER_STATUSES = ["new", "processing", "delivered", "cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

// Visit request statuses
export const VISIT_STATUSES = ["new", "contacted", "scheduled", "done", "cancelled"] as const;
export type VisitStatus = typeof VISIT_STATUSES[number];

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  email: true,
  passwordHash: true,
});
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  nameAr: true,
  slug: true,
});
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  titleAr: text("title_ar").notNull(),
  descriptionAr: text("description_ar").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  materialType: text("material_type").notNull(),
  pricePerMeter: numeric("price_per_meter", { precision: 10, scale: 2 }),
  isCustomPrice: boolean("is_custom_price").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  colors: many(productColors),
}));

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Product Images
export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
});

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const insertProductImageSchema = createInsertSchema(productImages).omit({
  id: true,
});
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
export type ProductImage = typeof productImages.$inferSelect;

// Product Colors
export const productColors = pgTable("product_colors", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  colorNameAr: text("color_name_ar").notNull(),
});

export const productColorsRelations = relations(productColors, ({ one }) => ({
  product: one(products, {
    fields: [productColors.productId],
    references: [products.id],
  }),
}));

export const insertProductColorSchema = createInsertSchema(productColors).omit({
  id: true,
});
export type InsertProductColor = z.infer<typeof insertProductColorSchema>;
export type ProductColor = typeof productColors.$inferSelect;

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  status: text("status").default("new").notNull(),
  subtotalAmount: numeric("subtotal_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
}));

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id),
  meters: numeric("meters", { precision: 10, scale: 2 }).notNull(),
  pricePerMeter: numeric("price_per_meter", { precision: 10, scale: 2 }),
  lineTotal: numeric("line_total", { precision: 10, scale: 2 }),
  titleSnapshotAr: text("title_snapshot_ar").notNull(),
  materialSnapshot: text("material_snapshot").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Visit Requests
export const visitRequests = pgTable("visit_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  materialType: text("material_type").notNull(),
  approxMeters: numeric("approx_meters", { precision: 10, scale: 2 }),
  notes: text("notes"),
  preferredDatetime: text("preferred_datetime"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVisitRequestSchema = createInsertSchema(visitRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});
export type InsertVisitRequest = z.infer<typeof insertVisitRequestSchema>;
export type VisitRequest = typeof visitRequests.$inferSelect;

// Extended types for frontend use
export type ProductWithDetails = Product & {
  images: ProductImage[];
  colors: ProductColor[];
  category: Category | null;
};

// Cart item type (client-side)
export interface CartItem {
  productId: number;
  titleAr: string;
  materialType: string;
  pricePerMeter: number | null;
  isCustomPrice: boolean;
  meters: number;
  imageUrl: string;
}

// Form validation schemas
export const saudiPhoneSchema = z.string().regex(/^(05|5)\d{8}$/, "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام");

export const checkoutFormSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: saudiPhoneSchema,
  city: z.string().min(2, "يرجى إدخال المدينة"),
  district: z.string().min(2, "يرجى إدخال الحي"),
  address: z.string().min(5, "يرجى إدخال العنوان التفصيلي"),
  notes: z.string().optional(),
});

export const visitRequestFormSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: saudiPhoneSchema,
  city: z.string().min(2, "يرجى إدخال المدينة"),
  district: z.string().min(2, "يرجى إدخال الحي"),
  address: z.string().min(5, "يرجى إدخال العنوان التفصيلي"),
  materialType: z.string().min(1, "يرجى اختيار نوع الخامة"),
  approxMeters: z.string().optional(),
  notes: z.string().optional(),
  preferredDatetime: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
export type VisitRequestFormData = z.infer<typeof visitRequestFormSchema>;

// Keep users table for compatibility
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
