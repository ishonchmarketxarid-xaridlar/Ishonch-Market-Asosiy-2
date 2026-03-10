import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    const p1 = await storage.createProduct({
      titleUz: "Smartfon Samsung Galaxy S23",
      titleRu: "Смартфон Samsung Galaxy S23",
      descriptionUz: "Yangi avlod smartfoni, 128GB xotira",
      descriptionRu: "Смартфон нового поколения, память 128ГБ",
      price: 10500000,
      originalPrice: 15000000,
      discountPercent: 30,
      imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
      category: "Elektronika",
      isPopular: true
    });
    const p2 = await storage.createProduct({
      titleUz: "Noutbuk Apple MacBook Air M2",
      titleRu: "Ноутбук Apple MacBook Air M2",
      descriptionUz: "Yengil va kuchli noutbuk",
      descriptionRu: "Легкий и мощный ноутбук",
      price: 15200000,
      originalPrice: 19000000,
      discountPercent: 20,
      imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
      category: "Kompyuterlar",
      isPopular: true
    });
    await storage.createProduct({
      titleUz: "Choynak Tefal",
      titleRu: "Чайник Tefal",
      descriptionUz: "Elektr choynak, 1.7 litr",
      descriptionRu: "Электрический чайник, 1.7 литра",
      price: 450000,
      imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1",
      category: "Maishiy texnika",
      isPopular: false
    });

    // Seed sample reviews
    await storage.createReview({
      productId: p1.id,
      userName: "Ali",
      rating: 5,
      comment: "Juda yaxshi smartfon! Batareya uzoq turadi va kamera sifati a'lo."
    });
    await storage.createReview({
      productId: p1.id,
      userName: "Fatima",
      rating: 4,
      comment: "Yaxshi, lekin biraz qimmat."
    });
    await storage.createReview({
      productId: p2.id,
      userName: "Karim",
      rating: 5,
      comment: "MacBook ajoyib! Tez va ishonchli. Hamma uchun tavsiya qilaman."
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {


  // Seed initial data
  seedDatabase().catch(console.error);

  app.get(api.products.list.path, async (req, res) => {
    const productsList = await storage.getProducts();
    res.json(productsList);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const updated = await storage.updateProduct(Number(req.params.id), input);
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.orders.list.path, async (req, res) => {
    const ordersList = await storage.getOrders();
    res.json(ordersList);
  });

  app.get('/api/user/orders/:userId', async (req, res) => {
    const ordersList = await storage.getOrders(Number(req.params.userId));
    res.json(ordersList);
  });

  app.get('/api/wishlist/:userId', async (req, res) => {
    const items = await storage.getWishlist(Number(req.params.userId));
    res.json(items);
  });

  app.post('/api/wishlist/add', async (req, res) => {
    const { userId, productId } = req.body;
    await storage.toggleWishlist(userId, productId);
    res.json({ success: true, action: 'added' });
  });

  app.post('/api/wishlist/remove', async (req, res) => {
    const { userId, productId } = req.body;
    await storage.toggleWishlist(userId, productId);
    res.json({ success: true, action: 'removed' });
  });

  app.post(api.orders.create.path, async (req, res) => {
  try {
    const input = api.orders.create.input.parse(req.body);

    const order = await storage.createOrder({
      ...input,
      userId: 1
    });

    res.status(201).json(order);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.orders.updateStatus.path, async (req, res) => {
    try {
      const { status } = api.orders.updateStatus.input.parse(req.body);
      const updated = await storage.updateOrderStatus(Number(req.params.id), status);
      if (!updated) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.orders.delete.path, async (req, res) => {
    await storage.deleteOrder(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.reviews.list.path, async (req, res) => {
    const productId = Number(req.params.productId);
    const reviewsList = await storage.getReviews(productId);
    res.json(reviewsList);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    try {
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({
        ...input,
        productId: Number(req.params.productId),
      });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.admin.stats.path, async (req, res) => {
    const productsList = await storage.getProducts();
    const ordersList = await storage.getOrders();
    
    const totalProducts = productsList.length;
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.reduce((sum, order) => sum + order.totalAmount, 0);
    
    res.json({
      totalOrders,
      totalProducts,
      totalRevenue
    });
  });

  return httpServer;
}
