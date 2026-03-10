import { useLanguage } from "@/lib/i18n";
import { useWishlist } from "@/hooks/use-wishlist";
import { useProducts } from "@/hooks/use-products";
import { Layout } from "@/components/layout";
import { ProductCard } from "@/components/product-card";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Wishlist() {
  const { t } = useLanguage();
  const { data: wishlistItems, isLoading: wishlistLoading, isError: wishlistError } = useWishlist(1); // Using mock userId 1
  const { data: products, isLoading: productsLoading, isError: productsError } = useProducts();

  const favoriteProducts = products?.filter(p => 
    wishlistItems?.some(item => item.productId === p.id)
  ) || [];

  const isLoading = wishlistLoading || productsLoading;
  const isError = wishlistError || productsError;

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in pb-24">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-3xl font-black font-display text-primary">{t('wishlist')}</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-64 rounded-2xl w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-muted-foreground bg-card rounded-[2rem] border border-dashed border-destructive/20">
            <p className="text-lg font-medium text-destructive">Xatolik yuz berdi</p>
            <p className="text-sm">Ma'lumotlarni yuklashda xatolik yuz berdi. Iltimos sahifani yangilang.</p>
          </div>
        ) : favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground bg-card rounded-[2rem] border border-dashed border-border/50">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Hozircha sevimlilar yo'q</p>
            <p className="text-sm">Mahsulotlarga yurakcha belgisini bosib saqlab qo'ying</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
