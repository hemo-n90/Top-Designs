import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import {
  insertCategorySchema,
  insertProductSchema,
  insertOrderSchema,
  insertVisitRequestSchema,
  checkoutFormSchema,
  visitRequestFormSchema,
} from "@shared/schema";

const JWT_SECRET = process.env.SESSION_SECRET || "qimma-secret-key-2024";

// Rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { error: "عدد المحاولات كثير، يرجى المحاولة لاحقاً" },
});

// Auth middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرح" });
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "رمز غير صالح" });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // =====================
  // PUBLIC ROUTES
  // =====================

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "حدث خطأ في جلب التصنيفات" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, material_type, search, featured } = req.query;
      const products = await storage.getProducts({
        categoryId: category ? parseInt(category as string) : undefined,
        materialType: material_type as string | undefined,
        search: search as string | undefined,
        featured: featured === "true",
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "حدث خطأ في جلب المنتجات" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: "المنتج غير موجود" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "حدث خطأ في جلب المنتج" });
    }
  });

  // Visit Requests
  app.post("/api/visit-requests", async (req, res) => {
    try {
      const data = visitRequestFormSchema.parse(req.body);
      const request = await storage.createVisitRequest({
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        district: data.district,
        address: data.address,
        materialType: data.materialType,
        approxMeters: data.approxMeters || null,
        notes: data.notes || null,
        preferredDatetime: data.preferredDatetime || null,
      });
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating visit request:", error);
      res.status(500).json({ error: "حدث خطأ في إرسال الطلب" });
    }
  });

  // Orders
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, subtotalAmount, ...customerData } = req.body;
      const validatedCustomer = checkoutFormSchema.parse(customerData);

      const order = await storage.createOrder(
        {
          ...validatedCustomer,
          subtotalAmount: subtotalAmount?.toString() || null,
        },
        items.map((item: any) => ({
          productId: item.productId,
          meters: item.meters.toString(),
          pricePerMeter: item.pricePerMeter?.toString() || null,
          lineTotal: item.lineTotal?.toString() || null,
          titleSnapshotAr: item.titleSnapshotAr,
          materialSnapshot: item.materialSnapshot,
        }))
      );

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "حدث خطأ في إنشاء الطلب" });
    }
  });

  // =====================
  // ADMIN ROUTES
  // =====================

  // Admin Login
  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "البريد وكلمة المرور مطلوبان" });
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: "بيانات غير صحيحة" });
      }

      const isValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "بيانات غير صحيحة" });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "حدث خطأ في تسجيل الدخول" });
    }
  });

  // Admin Stats
  app.get("/api/admin/stats", authMiddleware, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "حدث خطأ في جلب الإحصائيات" });
    }
  });

  // Admin Categories CRUD
  app.post("/api/admin/categories", authMiddleware, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "حدث خطأ في إنشاء التصنيف" });
    }
  });

  app.patch("/api/admin/categories/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = req.body;
      const category = await storage.updateCategory(id, data);
      if (!category) {
        return res.status(404).json({ error: "التصنيف غير موجود" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "حدث خطأ في تحديث التصنيف" });
    }
  });

  app.delete("/api/admin/categories/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ error: "حدث خطأ في حذف التصنيف" });
    }
  });

  // Admin Products CRUD
  app.post("/api/admin/products", authMiddleware, async (req, res) => {
    try {
      const { images, colors, ...productData } = req.body;
      const product = await storage.createProduct(
        {
          titleAr: productData.titleAr,
          descriptionAr: productData.descriptionAr,
          categoryId: productData.categoryId || null,
          materialType: productData.materialType,
          pricePerMeter: productData.pricePerMeter || null,
          isCustomPrice: productData.isCustomPrice || false,
          isFeatured: productData.isFeatured || false,
        },
        images,
        colors
      );
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "حدث خطأ في إنشاء المنتج" });
    }
  });

  app.patch("/api/admin/products/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { images, colors, ...productData } = req.body;
      const product = await storage.updateProduct(id, productData, images, colors);
      if (!product) {
        return res.status(404).json({ error: "المنتج غير موجود" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "حدث خطأ في تحديث المنتج" });
    }
  });

  app.delete("/api/admin/products/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "حدث خطأ في حذف المنتج" });
    }
  });

  // Admin Orders
  app.get("/api/admin/orders", authMiddleware, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "حدث خطأ في جلب الطلبات" });
    }
  });

  app.get("/api/admin/orders/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "حدث خطأ في جلب الطلب" });
    }
  });

  app.patch("/api/admin/orders/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ error: "حدث خطأ في تحديث الطلب" });
    }
  });

  // Admin Visit Requests
  app.get("/api/admin/visit-requests", authMiddleware, async (req, res) => {
    try {
      const requests = await storage.getVisitRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching visit requests:", error);
      res.status(500).json({ error: "حدث خطأ في جلب الطلبات" });
    }
  });

  app.patch("/api/admin/visit-requests/:id", authMiddleware, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const request = await storage.updateVisitRequestStatus(id, status);
      if (!request) {
        return res.status(404).json({ error: "الطلب غير موجود" });
      }
      res.json(request);
    } catch (error) {
      console.error("Error updating visit request:", error);
      res.status(500).json({ error: "حدث خطأ في تحديث الطلب" });
    }
  });

  return httpServer;
}
