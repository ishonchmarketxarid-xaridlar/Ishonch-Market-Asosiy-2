import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useLanguage } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, Send, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCart();
  const { t, getLocalized } = useLanguage();

  const totalFormatted = new Intl.NumberFormat('uz-UZ').format(getTotal());

  const handleTelegramConfirm = () => {
    const formatter = new Intl.NumberFormat('uz-UZ');
    const orderList = items.map(i => {
      const title = getLocalized(i.product, 'title');
      const price = formatter.format(i.product.price);
      return `- ${title} — ${price} UZS x ${i.quantity}`;
    }).join('\n');
    
    const text = `Siz buyurtma qilgan mahsulotlar:\n${orderList}\n\nJami: ${formatter.format(getTotal())} UZS\n✨ To'lov buyurtma qabul qilingandan keyin beriladi`;
    window.open(`https://t.me/+998774884846?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in fade-in">
          <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-primary/40" />
          </div>
          <h2 className="text-2xl font-bold font-display mb-2">{t('cart_empty')}</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Hozircha savatchangizga hech narsa qo'shilmagan. Mahsulotlarni ko'rish uchun asosiy sahifaga o'ting.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 h-14 shadow-lg shadow-primary/20">
              {t('home')}ga o'tish
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-32 md:pb-6">
        <h1 className="text-3xl font-bold font-display mb-6">{t('cart')}</h1>
        
        <div className="space-y-4 mb-8">
          {items.map((item) => {
            const title = getLocalized(item.product, 'title');
            const price = item.product.price * item.quantity;
            return (
              <div key={item.product.id} className="flex gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border/50 items-center transition-all hover:shadow-md">
                <div className="w-20 h-20 bg-secondary/50 rounded-xl overflow-hidden shrink-0">
                  <img src={item.product.imageUrl} alt={title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate mb-1">{title}</h3>
                  <div className="font-bold text-primary">{new Intl.NumberFormat('uz-UZ').format(price)} UZS</div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center gap-3 bg-secondary rounded-full p-1 border border-border/50">
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-background text-foreground shadow-sm transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-card hover:bg-background text-foreground shadow-sm transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.product.id)}
                    className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1 transition-colors px-2"
                  >
                    <Trash2 className="w-4 h-4" /> O'chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Card Stickied to bottom on mobile, inline on desktop */}
        <div className="fixed bottom-[4rem] left-0 right-0 p-4 bg-card border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:relative md:bottom-auto md:bg-transparent md:border-none md:shadow-none md:p-0 z-30">
          <div className="md:bg-card md:p-6 md:rounded-3xl md:shadow-xl md:border md:border-border/50 max-w-4xl mx-auto space-y-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-muted-foreground">{t('total')}:</span>
              <span className="text-3xl font-black text-primary">{totalFormatted} UZS</span>
            </div>
            
            <div className="text-center text-sm font-medium text-emerald-600 bg-emerald-50 py-2 rounded-xl mb-4">
              ✨ {t('cash_on_delivery')}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/checkout" className="flex-1">
                <Button size="lg" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                  {t('checkout')}
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline"
                className="flex-1 h-14 text-lg rounded-2xl border-2 border-[#229ED9] text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-colors"
                onClick={handleTelegramConfirm}
              >
                <Send className="w-5 h-5 mr-2" />
                {t('checkout_telegram')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
