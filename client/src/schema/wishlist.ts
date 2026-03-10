import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  productId: integer("product_id"),
  createdAt: timestamp("created_at").defaultNow(),
});