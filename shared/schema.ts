import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  descriptionUz: text("description_uz").notNull(),
  descriptionRu: text("description_ru").notNull(),
  price: integer("price").notNull(), // in UZS
  originalPrice: integer("original_price"), // in UZS - if discounted
  discountPercent: integer("discount_percent"), // discount percentage (0-100)
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  isSale: boolean("is_sale").default(false).notNull(),
  ratingAverage: decimal("rating_average", { precision: 3, scale: 2 }).default("0"),
  ratingCount: integer("rating_count").default(0).notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userName: text("user_name").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  items: jsonb("items").notNull(), // Array of { productId, quantity, price }
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default('pending'), // pending, confirmed, delivered
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, ratingAverage: true, ratingCount: true }).extend({
  originalPrice: z.number().int().optional(),
  discountPercent: z.number().int().min(0).max(100).optional(),
});
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Request Types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;
export type CreateReviewRequest = InsertReview;
export type CreateOrderRequest = InsertOrder;
export type UpdateOrderRequest = Partial<InsertOrder>;
