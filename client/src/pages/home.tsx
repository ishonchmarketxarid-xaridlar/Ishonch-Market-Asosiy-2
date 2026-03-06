import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { Layout } from "@/components/layout";
import { Search, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const { t, getLocalized } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(p => 
      getLocalized(p, 'title').toLowerCase().includes(lowerQuery) ||
      getLocalized(p, 'description').toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery, getLocalized]);

  const popularProducts = useMemo(() => {
    return products?.filter(p => p.isPopular) || [];
  }, [products]);

  return (
    <Layout>
      <div className="p-4 md:p-0 space-y-8 animate-in fade-in duration-500">
        
        {/* Search Header */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm shadow-black/5 text-lg focus-visible:ring-primary/20 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col space-y-3 bg-card p-4 rounded-2xl">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {!searchQuery && popularProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold font-display">{t('popular_products')}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {popularProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t border-border/50">
              <h2 className="text-xl font-bold font-display">{searchQuery ? 'Natijalar' : t('all_products')}</h2>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border/50 border-dashed">
                  Topilmadi
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
