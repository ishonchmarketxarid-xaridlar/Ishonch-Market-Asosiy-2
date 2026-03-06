import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  titleUz: text("title_uz").notNull(),
  titleRu: text("title_ru").notNull(),
  descriptionUz: text("description_uz").notNull(),
  descriptionRu: text("description_ru").notNull(),
  price: integer("price").notNull(), // in UZS
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
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

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true });

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// Request Types
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;
export type CreateOrderRequest = InsertOrder;
export type UpdateOrderRequest = Partial<InsertOrder>;
