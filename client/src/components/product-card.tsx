import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({ product }: { product: Product }) {
  const { getLocalized, t } = useLanguage();
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();

  const title = getLocalized(product, 'title');
  const priceFormatted = new Intl.NumberFormat('uz-UZ').format(product.price);
  const hasDiscount = product.discountPercent && product.discountPercent > 0 && product.originalPrice;
  const originalPriceFormatted = hasDiscount ? new Intl.NumberFormat('uz-UZ').format(product.originalPrice!) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if wrapped in link
    e.stopPropagation();
    addItem(product);
    toast({
      title: title,
      description: "Savatchaga qo'shildi",
      duration: 2000,
    });
  };

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full bg-secondary/50 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.isPopular && (
          <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            HOT
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm z-10">
            -{product.discountPercent}%
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight flex-1 mb-2 font-display">{title}</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">{originalPriceFormatted} UZS</span>
            )}
            <span className="font-bold text-lg text-primary">{priceFormatted} <span className="text-sm font-normal text-muted-foreground">{t('uzs')}</span></span>
          </div>
          <Button 
            size="icon" 
            variant="secondary" 
            className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors h-10 w-10"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
