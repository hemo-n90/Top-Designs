import { eq, desc, like, and, sql, gte } from "drizzle-orm";
import { db } from "./db";
import {
  adminUsers,
  categories,
  products,
  productImages,
  productColors,
  orders,
  orderItems,
  visitRequests,
  type AdminUser,
  type InsertAdminUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type ProductImage,
  type InsertProductImage,
  type ProductColor,
  type InsertProductColor,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type VisitRequest,
  type InsertVisitRequest,
  type ProductWithDetails,
} from "@shared/schema";

export interface IStorage {
  // Admin Users
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(data: InsertAdminUser): Promise<AdminUser>;

  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(data: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  // Products
  getProducts(filters?: {
    categoryId?: number;
    materialType?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ProductWithDetails[]>;
  getProduct(id: number): Promise<ProductWithDetails | undefined>;
  createProduct(data: InsertProduct, images?: string[], colors?: string[]): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>, images?: string[], colors?: string[]): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Orders
  getOrders(): Promise<(Order & { items: OrderItem[] })[]>;
  getOrder(id: number): Promise<(Order & { items: OrderItem[] }) | undefined>;
  createOrder(data: InsertOrder, items: Omit<InsertOrderItem, "orderId">[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Visit Requests
  getVisitRequests(): Promise<VisitRequest[]>;
  createVisitRequest(data: InsertVisitRequest): Promise<VisitRequest>;
  updateVisitRequestStatus(id: number, status: string): Promise<VisitRequest | undefined>;

  // Stats
  getStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalVisitRequests: number;
    newRequestsThisWeek: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email));
    return admin;
  }

  async createAdminUser(data: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(data).returning();
    return admin;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(desc(categories.createdAt));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return category;
  }

  async createCategory(data: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(data).returning();
    return category;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set(data)
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Products
  async getProducts(filters?: {
    categoryId?: number;
    materialType?: string;
    search?: string;
    featured?: boolean;
  }): Promise<ProductWithDetails[]> {
    let query = db.select().from(products);

    const conditions = [];
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    if (filters?.materialType) {
      conditions.push(eq(products.materialType, filters.materialType));
    }
    if (filters?.search) {
      conditions.push(like(products.titleAr, `%${filters.search}%`));
    }
    if (filters?.featured) {
      conditions.push(eq(products.isFeatured, true));
    }

    const productList = conditions.length > 0
      ? await db.select().from(products).where(and(...conditions)).orderBy(desc(products.createdAt))
      : await db.select().from(products).orderBy(desc(products.createdAt));

    // Fetch related data for each product
    const result: ProductWithDetails[] = [];
    for (const product of productList) {
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));
      const colors = await db
        .select()
        .from(productColors)
        .where(eq(productColors.productId, product.id));
      const category = product.categoryId
        ? await this.getCategory(product.categoryId)
        : null;

      result.push({
        ...product,
        images,
        colors,
        category: category || null,
      });
    }

    return result;
  }

  async getProduct(id: number): Promise<ProductWithDetails | undefined> {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, id));

    if (!product) return undefined;

    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, id));
    const colors = await db
      .select()
      .from(productColors)
      .where(eq(productColors.productId, id));
    const category = product.categoryId
      ? await this.getCategory(product.categoryId)
      : null;

    return {
      ...product,
      images,
      colors,
      category: category || null,
    };
  }

  async createProduct(
    data: InsertProduct,
    images?: string[],
    colors?: string[]
  ): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();

    if (images && images.length > 0) {
      await db.insert(productImages).values(
        images.map((url) => ({ productId: product.id, url }))
      );
    }

    if (colors && colors.length > 0) {
      await db.insert(productColors).values(
        colors.map((colorNameAr) => ({ productId: product.id, colorNameAr }))
      );
    }

    return product;
  }

  async updateProduct(
    id: number,
    data: Partial<InsertProduct>,
    images?: string[],
    colors?: string[]
  ): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();

    if (!product) return undefined;

    // Update images
    if (images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (images.length > 0) {
        await db.insert(productImages).values(
          images.map((url) => ({ productId: id, url }))
        );
      }
    }

    // Update colors
    if (colors !== undefined) {
      await db.delete(productColors).where(eq(productColors.productId, id));
      if (colors.length > 0) {
        await db.insert(productColors).values(
          colors.map((colorNameAr) => ({ productId: id, colorNameAr }))
        );
      }
    }

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Orders
  async getOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const orderList = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    const result: (Order & { items: OrderItem[] })[] = [];
    for (const order of orderList) {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));
      result.push({ ...order, items });
    }

    return result;
  }

  async getOrder(id: number): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return { ...order, items };
  }

  async createOrder(
    data: InsertOrder,
    items: Omit<InsertOrderItem, "orderId">[]
  ): Promise<Order> {
    const [order] = await db.insert(orders).values(data).returning();

    if (items.length > 0) {
      await db.insert(orderItems).values(
        items.map((item) => ({ ...item, orderId: order.id }))
      );
    }

    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Visit Requests
  async getVisitRequests(): Promise<VisitRequest[]> {
    return db
      .select()
      .from(visitRequests)
      .orderBy(desc(visitRequests.createdAt));
  }

  async createVisitRequest(data: InsertVisitRequest): Promise<VisitRequest> {
    const [request] = await db.insert(visitRequests).values(data).returning();
    // TODO: Send notification (SMS/WhatsApp/Email)
    console.log("New visit request created:", request.id, request.fullName, request.phone);
    return request;
  }

  async updateVisitRequestStatus(id: number, status: string): Promise<VisitRequest | undefined> {
    const [request] = await db
      .update(visitRequests)
      .set({ status })
      .where(eq(visitRequests.id, id))
      .returning();
    return request;
  }

  // Stats
  async getStats() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [productCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);
    const [orderCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders);
    const [visitCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(visitRequests);
    const [newVisitCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(visitRequests)
      .where(gte(visitRequests.createdAt, oneWeekAgo));

    return {
      totalProducts: productCount?.count || 0,
      totalOrders: orderCount?.count || 0,
      totalVisitRequests: visitCount?.count || 0,
      newRequestsThisWeek: newVisitCount?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
