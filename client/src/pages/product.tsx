import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useLanguage } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Send, ChevronLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading } = useProduct(id);
  const { t, getLocalized } = useLanguage();
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Layout>
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/2 aspect-square rounded-3xl" />
            <div className="w-full md:w-1/2 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="p-10 text-center text-xl text-muted-foreground">Mahsulot topilmadi.</div>
      </Layout>
    );
  }

  const title = getLocalized(product, 'title');
  const description = getLocalized(product, 'description');
  const priceFormatted = new Intl.NumberFormat('uz-UZ').format(product.price);

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: title,
      description: "Savatchaga qo'shildi",
    });
  };

  const handleTelegramOrder = () => {
    const text = `Assalomu alaykum!\nMen Ishonch Market saytidan mahsulot buyurtma qilmoqchiman.\nMahsulot: ${product.titleUz}\nNarxi: ${product.price} UZS\nManzil: Toshkent`;
    window.open(`https://t.me/+998774884846?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 mr-1" /> Orqaga
        </Button>

        <div className="bg-card rounded-[2rem] shadow-xl shadow-black/5 overflow-hidden flex flex-col md:flex-row border border-border/50">
          
          {/* Image Section */}
          <div className="w-full md:w-1/2 bg-secondary/30 relative">
            <div className="aspect-square w-full relative">
              <img 
                src={product.imageUrl} 
                alt={title} 
                className="absolute inset-0 w-full h-full object-contain p-6"
              />
            </div>
            {product.isPopular && (
              <div className="absolute top-6 left-6 bg-destructive text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                HOT
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col">
            <div className="text-sm font-bold text-primary mb-3 uppercase tracking-widest bg-primary/10 inline-flex self-start px-3 py-1 rounded-full">
              {product.category}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold font-display text-foreground leading-tight mb-4">
              {title}
            </h1>
            
            <div className="text-3xl font-black text-primary mb-8 flex items-baseline gap-2">
              {priceFormatted} <span className="text-lg font-medium text-muted-foreground">{t('uzs')}</span>
            </div>

            <div className="prose prose-sm md:prose-base text-muted-foreground mb-10 flex-1">
              <p className="whitespace-pre-line leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <Button 
                size="lg" 
                className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-primary/25 hover:-translate-y-1 transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('add_to_cart')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full h-14 text-lg rounded-2xl border-2 border-[#229ED9] text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition-all shadow-sm"
                onClick={handleTelegramOrder}
              >
                <Send className="w-5 h-5 mr-2" />
                {t('order_telegram')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
