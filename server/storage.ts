import { products, orders, reviews, wishlist, type Wishlist, type Product, type InsertProduct, type Order, type InsertOrder, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  
  getOrders(userId?: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<void>;

  getWishlist(userId?: number): Promise<Wishlist[]>;
  toggleWishlist(userId: number | undefined, productId: number): Promise<{ action: 'added' | 'removed' }>;
  getReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  
  async updateProduct(id: number, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(productUpdate).where(eq(products.id, id)).returning();
    return updated;
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }
  
  async getOrders(userId?: number): Promise<Order[]> {
    if (userId) {
      return await db.select().from(orders).where(eq(orders.userId, userId));
    }
    return await db.select().from(orders);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return updated;
  }
  
  async deleteOrder(id: number): Promise<void> {
    await db.delete(orders).where(eq(orders.id, id));
  }

  async getWishlist(userId?: number): Promise<Wishlist[]> {
    if (userId) {
      return await db.select().from(wishlist).where(eq(wishlist.userId, userId));
    }
    return await db.select().from(wishlist);
  }

  async toggleWishlist(userId: number | undefined, productId: number): Promise<{ action: 'added' | 'removed' }> {
    const existing = await db.select().from(wishlist).where(
      eq(wishlist.productId, productId)
      // and eq(wishlist.userId, userId) - add when auth is ready
    );

    if (existing.length > 0) {
      await db.delete(wishlist).where(eq(wishlist.productId, productId));
      return { action: 'removed' };
    } else {
      await db.insert(wishlist).values({ userId, productId });
      return { action: 'added' };
    }
  }

  async getReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Recalculate product rating
    const productReviews = await db.select().from(reviews).where(eq(reviews.productId, review.productId));
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / productReviews.length;
    
    // Update product rating
    await db.update(products).set({
      ratingAverage: avgRating.toString(),
      ratingCount: productReviews.length
    }).where(eq(products.id, review.productId));
    
    return newReview;
  }
}

export const storage = new DatabaseStorage();
