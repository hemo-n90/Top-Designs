import { db } from "./db";
import {
  adminUsers,
  categories,
  products,
  productImages,
  productColors,
} from "@shared/schema";
import bcrypt from "bcrypt";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=600&fit=crop",
];

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const existingAdmin = await db.select().from(adminUsers).limit(1);
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    await db.insert(adminUsers).values({
      email: "admin@qimma.sa",
      passwordHash,
    });
    console.log("✅ Admin user created: admin@qimma.sa / admin123");
  } else {
    console.log("⏭️ Admin user already exists");
  }

  // Create categories
  const existingCategories = await db.select().from(categories).limit(1);
  if (existingCategories.length === 0) {
    const categoryData = [
      { nameAr: "مطابخ عصرية", slug: "modern-kitchens" },
      { nameAr: "مطابخ كلاسيكية", slug: "classic-kitchens" },
      { nameAr: "مطابخ صغيرة", slug: "small-kitchens" },
      { nameAr: "مطابخ فاخرة", slug: "luxury-kitchens" },
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .returning();
    console.log(`✅ Created ${insertedCategories.length} categories`);

    // Create products
    const productData = [
      {
        titleAr: "مطبخ ألمنيوم عصري",
        descriptionAr: "مطبخ عصري مصنوع من الألمنيوم عالي الجودة مع تشطيبات ممتازة وتصميم أنيق يناسب المنازل الحديثة",
        categoryId: insertedCategories[0].id,
        materialType: "ألمنيوم",
        pricePerMeter: "1500",
        isCustomPrice: false,
        isFeatured: true,
        colors: ["أبيض", "فضي", "رمادي"],
      },
      {
        titleAr: "مطبخ خشب طبيعي",
        descriptionAr: "مطبخ من الخشب الطبيعي الفاخر مع تشطيبات يدوية دقيقة ولمسة كلاسيكية راقية",
        categoryId: insertedCategories[1].id,
        materialType: "خشب",
        pricePerMeter: "2200",
        isCustomPrice: false,
        isFeatured: true,
        colors: ["بني فاتح", "بني غامق", "أوك"],
      },
      {
        titleAr: "مطبخ صاج مقاوم للصدأ",
        descriptionAr: "مطبخ صاج عالي الجودة مقاوم للصدأ والرطوبة مثالي للمطابخ التجارية والمنزلية",
        categoryId: insertedCategories[2].id,
        materialType: "صاج",
        pricePerMeter: "1200",
        isCustomPrice: false,
        isFeatured: false,
        colors: ["فضي", "أسود"],
      },
      {
        titleAr: "مطبخ فورميكا اقتصادي",
        descriptionAr: "مطبخ فورميكا عملي واقتصادي مع خيارات ألوان متعددة وسهولة في الصيانة",
        categoryId: insertedCategories[2].id,
        materialType: "فورميكا",
        pricePerMeter: "800",
        isCustomPrice: false,
        isFeatured: false,
        colors: ["أبيض", "كريمي", "بيج"],
      },
      {
        titleAr: "مطبخ ألمنيوم فاخر",
        descriptionAr: "مطبخ ألمنيوم فاخر مع إضاءة LED مدمجة وأدراج ناعمة الإغلاق وتصميم إيطالي",
        categoryId: insertedCategories[3].id,
        materialType: "ألمنيوم",
        pricePerMeter: "2500",
        isCustomPrice: false,
        isFeatured: true,
        colors: ["أبيض لامع", "أسود مطفي", "ذهبي"],
      },
      {
        titleAr: "مطبخ خشب زان طبيعي",
        descriptionAr: "مطبخ من خشب الزان الطبيعي الأصلي مع رخام طبيعي وتفاصيل نحاسية أنيقة",
        categoryId: insertedCategories[3].id,
        materialType: "خشب",
        pricePerMeter: null,
        isCustomPrice: true,
        isFeatured: true,
        colors: ["زان طبيعي", "ماهوجني"],
      },
      {
        titleAr: "مطبخ صاج مودرن",
        descriptionAr: "تصميم حديث من الصاج المعالج مع زجاج ملون وإضاءة جانبية",
        categoryId: insertedCategories[0].id,
        materialType: "صاج",
        pricePerMeter: "1800",
        isCustomPrice: false,
        isFeatured: false,
        colors: ["رمادي", "أزرق"],
      },
      {
        titleAr: "مطبخ فورميكا حديث",
        descriptionAr: "مطبخ فورميكا بتصميم عصري وألوان جريئة مناسب للشباب والعائلات الصغيرة",
        categoryId: insertedCategories[0].id,
        materialType: "فورميكا",
        pricePerMeter: "950",
        isCustomPrice: false,
        isFeatured: false,
        colors: ["أخضر", "أزرق", "برتقالي"],
      },
      {
        titleAr: "مطبخ ألمنيوم كلاسيكي",
        descriptionAr: "مطبخ ألمنيوم بلمسة كلاسيكية راقية مع مقابض نحاسية وزجاج منقوش",
        categoryId: insertedCategories[1].id,
        materialType: "ألمنيوم",
        pricePerMeter: "1700",
        isCustomPrice: false,
        isFeatured: false,
        colors: ["أبيض عاجي", "ذهبي عتيق"],
      },
      {
        titleAr: "مطبخ خشب أمريكي",
        descriptionAr: "مطبخ من خشب البلوط الأمريكي مع سطح جرانيت وتجهيزات ألمانية",
        categoryId: insertedCategories[3].id,
        materialType: "خشب",
        pricePerMeter: "3200",
        isCustomPrice: false,
        isFeatured: true,
        colors: ["بلوط طبيعي", "بلوط مدخن"],
      },
    ];

    for (let i = 0; i < productData.length; i++) {
      const { colors, ...product } = productData[i];
      const [insertedProduct] = await db
        .insert(products)
        .values(product)
        .returning();

      // Add images
      await db.insert(productImages).values([
        { productId: insertedProduct.id, url: PLACEHOLDER_IMAGES[i] },
        { productId: insertedProduct.id, url: PLACEHOLDER_IMAGES[(i + 1) % 10] },
      ]);

      // Add colors
      if (colors.length > 0) {
        await db.insert(productColors).values(
          colors.map((colorNameAr) => ({ productId: insertedProduct.id, colorNameAr }))
        );
      }
    }

    console.log(`✅ Created ${productData.length} products with images and colors`);
  } else {
    console.log("⏭️ Products already exist");
  }

  console.log("🎉 Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
