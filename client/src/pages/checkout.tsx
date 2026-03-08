import { useState } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/lib/i18n";
import { useCreateOrder } from "@/hooks/use-orders";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotal, clearCart } = useCart();
  const { t } = useLanguage();
  const createOrder = useCreateOrder();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Redirect if cart is empty
  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const generateTelegramMessage = () => {
    const formatter = new Intl.NumberFormat('uz-UZ');
    const itemsText = items
      .map(i => `- ${i.product.titleUz} — ${formatter.format(i.product.price)} UZS x ${i.quantity}`)
      .join('\n');
    
    const tgText = `Siz buyurtma qilgan mahsulotlar:\n${itemsText}\n\nJami: ${formatter.format(getTotal())} UZS\n✨ To'lov qabul qilingandan keyin yetkaziladi`;
    return tgText;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderItems = items.map(i => ({
      productId: i.product.id,
      quantity: i.quantity,
      price: i.product.price
    }));

    createOrder.mutate({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      totalAmount: getTotal(),
      items: orderItems,
    }, {
      onSuccess: () => {
        clearCart();
        const tgText = generateTelegramMessage();
        window.open(`https://t.me/+998774884846?text=${encodeURIComponent(tgText)}`, '_blank');
        setLocation("/confirmation");
      }
    });
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-muted-foreground" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Orqaga
        </Button>

        <Card className="p-6 md:p-10 rounded-[2rem] border-border/50 shadow-xl shadow-black/5">
          <h1 className="text-2xl md:text-3xl font-bold font-display mb-8 text-center">{t('checkout_form_title')}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">{t('name')}</Label>
              <Input 
                id="name"
                required
                className="h-14 rounded-xl text-lg bg-secondary/30 border-border focus-visible:ring-primary"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ali Valiyev"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">{t('phone')}</Label>
              <Input 
                id="phone"
                required
                type="tel"
                className="h-14 rounded-xl text-lg bg-secondary/30 border-border focus-visible:ring-primary"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-base">{t('address')}</Label>
              <Input 
                id="address"
                required
                className="h-14 rounded-xl text-lg bg-secondary/30 border-border focus-visible:ring-primary"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Toshkent shahar, Yunusobod tumani..."
              />
            </div>

            <div className="bg-secondary/50 p-4 rounded-2xl flex justify-between items-center mt-8">
              <span className="font-medium text-muted-foreground">{t('total')}:</span>
              <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('uz-UZ').format(getTotal())} UZS</span>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all mt-6"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Yuborilmoqda..." : t('confirm_order')}
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
