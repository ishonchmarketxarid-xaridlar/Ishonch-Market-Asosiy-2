import { useLanguage } from "@/lib/i18n";
import { useOrders } from "@/hooks/use-orders";
import { useCart } from "@/hooks/use-cart";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Globe, TrendingUp, ShoppingBag, ShieldAlert, Clock, Zap, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";

import { useWishlist } from "@/hooks/use-wishlist";


// Используем только currentUser.id
const { data: wishlistItems, isLoading: wishlistLoading, toggleWishlist } = useWishlist(currentUser.id);

const handleToggleFavorite = (productId: number) => {
  toggleWishlist({ userId: currentUser.id, productId });
};


export default function Settings() {
  const { lang, setLang, t, getLocalized } = useLanguage();
  const currentUser = useCurrentUser(); // должен вернуть { id: number, name: string }
  const { data: orders, isLoading: ordersLoading } = useOrders(currentUser?.id || 0);
  // <-- const currentUser = useCurrentUser(); // <-- добавить этот хук, который вернет id текущего пользователя
  // <-- const { data: orders, isLoading: ordersLoading } = useOrders(currentUser.id);
  // <-- const { data: wishlistItems, isLoading: wishlistLoading } = useWishlist(currentUser.id);
  // <-- const { data: orders, isLoading: ordersLoading } = useOrders(1); // mock userId 1
  const { items: cartItems } = useCart();
  // <-- const { data: wishlistItems, isLoading: wishlistLoading } = useWishlist(1); // mock userId 1 
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState("");

  const { data: products, isLoading: productsLoading } = useProducts();

  const isLoading = ordersLoading || productsLoading || wishlistLoading;

  const userStats = useMemo(() => {
    if (!orders) return null;
    
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipping').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalSpent = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    let lastOrderText = "—";
    if (orders.length > 0) {
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const lastOrder = sortedOrders[0];
      const daysAgo = Math.floor(
        (Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysAgo === 0) {
        const hoursAgo = Math.floor(
          (Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60)
        );
        lastOrderText = hoursAgo === 0 ? "Hozir" : `${hoursAgo} soat oldin`;
      } else if (daysAgo === 1) {
        lastOrderText = "Kecha";
      } else {
        lastOrderText = `${daysAgo} kun oldin`;
      }
    }
    
    return {
      totalOrders,
      activeOrders,
      cartItemsCount: cartItems.length,
      wishlistCount: wishlistItems?.length || 0,
      totalSpent,
      lastOrderText
    };
  }, [orders, cartItems, wishlistItems]);

  const handleAdminAccess = () => {
    if (password === "9billionaire$$$$$") {
      setLocation("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Noto'g'ri parol",
      });
      setPassword("");
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8 animate-in fade-in pb-24">
        <h1 className="text-3xl font-black font-display text-primary">Ishonch Market</h1>
        
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Til sozlamalari</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={lang === 'uz' ? 'default' : 'outline'}
              className="h-14 rounded-2xl text-lg font-bold"
              onClick={() => setLang('uz')}
            >
              O'zbek tili 🇺🇿
            </Button>
            <Button
              variant={lang === 'ru' ? 'default' : 'outline'}
              className="h-14 rounded-2xl text-lg font-bold"
              onClick={() => setLang('ru')}
            >
              Русский язык 🇷🇺
            </Button>
          </div>
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Mening statistikam</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="h-24 rounded-2xl w-full" />
              ))}
            </div>
          ) : userStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">Jami buyurtmalar</span>
                </div>
                <div className="text-2xl font-black text-foreground">{userStats.totalOrders}</div>
              </Card>
              
              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Faol buyurtmalar</span>
                </div>
                <div className="text-2xl font-black text-foreground">{userStats.activeOrders}</div>
              </Card>

              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">Savatchada</span>
                </div>
                <div className="text-2xl font-black text-foreground">{userStats.cartItemsCount}</div>
              </Card>

              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Sevimlilar</span>
                </div>
                <div className="text-2xl font-black text-foreground">{userStats.wishlistCount}</div>
              </Card>

              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Jami sarflangan</span>
                </div>
                <div className="text-lg font-black text-primary truncate">
                  {new Intl.NumberFormat('uz-UZ').format(userStats.totalSpent)} UZS
                </div>
              </Card>

              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Oxirgi buyurtma</span>
                </div>
                <div className="text-lg font-black text-foreground">{userStats.lastOrderText}</div>
              </Card>
            </div>
          ) : null}
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">{t('my_orders')}</h2>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-32 rounded-2xl w-full" />
            ) : orders && orders.length > 0 ? (
              [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(order => (
                <Card key={order.id} className="p-4 rounded-2xl border-border/50 bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">#{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                      order.status === 'shipping' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status === 'pending' ? 'Kutilmoqda' : 
                       order.status === 'confirmed' ? 'Tasdiqlandi' :
                       order.status === 'shipping' ? 'Yetkazilmoqda' :
                       order.status === 'delivered' ? 'Yetkazildi' : 'Bekor qilindi'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3 space-y-1">
                    {((order.items as any) || []).map((item: any, i: number) => {
                      const product = products?.find(p => p.id === item.productId);
                      const title = product ? getLocalized(product, 'title') : `Mahsulot #${item.productId}`;
                      return (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <span className="truncate flex-1 mr-2">{title} x {item.quantity}</span>
                          <span className="shrink-0 font-medium">{new Intl.NumberFormat('uz-UZ').format(item.price * item.quantity)} UZS</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-2">
                    <span className="text-sm font-medium">Jami:</span>
                    <span className="font-black text-primary">{new Intl.NumberFormat('uz-UZ').format(order.totalAmount)} UZS</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground bg-card rounded-2xl border border-dashed border-border/50">
                Hozircha buyurtmalar yo'q
              </div>
            )}
          </div>
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Admin panel</h2>
          </div>
          
          <Card 
            className="p-6 rounded-2xl border-border/50 shadow-sm hover:bg-secondary transition-colors cursor-pointer flex items-center justify-between"
            onClick={() => setShowAdminModal(true)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Admin panelga kirish</h3>
                <p className="text-sm text-muted-foreground">Mahsulotlar va buyurtmalarni boshqarish</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xl font-bold">→</span>
            </div>
          </Card>
        </section>

        <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-display">Admin kirish</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="password"
                placeholder="Admin parolini kiriting"
                className="h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAdminAccess} className="w-full h-12 rounded-xl font-bold text-lg">
                Kirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
