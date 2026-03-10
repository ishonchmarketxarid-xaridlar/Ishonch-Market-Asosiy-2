import { Link } from "wouter";
import { Product } from "@shared/schema";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useWishlist, useToggleWishlist } from "@/hooks/use-wishlist";

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => 
    i < Math.round(rating) ? '⭐' : '☆'
  ).join('');
}

export function ProductCard({ product }: { product: Product }) {
  const { getLocalized, t } = useLanguage();
  const addItem = useCart(state => state.addItem);
  const { toast } = useToast();
  const { data: wishlistItems } = useWishlist();
  const toggleWishlist = useToggleWishlist();

  const isFavorite = wishlistItems?.some(item => item.productId === product.id);

  const title = getLocalized(product, 'title');
  const priceFormatted = new Intl.NumberFormat('uz-UZ').format(product.price);
  const hasDiscount = product.discountPercent && product.discountPercent > 0 && product.originalPrice;
  const originalPriceFormatted = hasDiscount ? new Intl.NumberFormat('uz-UZ').format(product.originalPrice!) : null;
  const rating = product.ratingAverage ? parseFloat(product.ratingAverage.toString()) : 0;
  const ratingCount = product.ratingCount || 0;

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist.mutate(product.id);
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
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full h-8 w-8 shadow-sm transition-colors ${isFavorite ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'}`}
            onClick={handleToggleWishlist}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          {product.isPopular && <div className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">HOT</div>}
          {product.isNew && <div className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">NEW</div>}
          {product.isHot && <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">🔥</div>}
        </div>
        {(product.isSale || hasDiscount) && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
            {hasDiscount ? `-${product.discountPercent}%` : 'SALE'}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight flex-1 mb-2 font-display">{title}</h3>
        
        <div className="text-sm text-muted-foreground mb-3">
          {renderStars(rating)} ({ratingCount})
        </div>

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
