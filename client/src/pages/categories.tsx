import { useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const { data: products, isLoading } = useProducts();
  const { t } = useLanguage();

  const categories = useMemo(() => {
    if (!products) return {};
    const catMap: Record<string, typeof products> = {};
    products.forEach(p => {
      if (!catMap[p.category]) catMap[p.category] = [];
      catMap[p.category].push(p);
    });
    return catMap;
  }, [products]);

  return (
    <Layout>
      <div className="p-4 md:p-0 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold font-display mb-6">{t('categories')}</h1>
        
        {isLoading ? (
           <div className="space-y-8">
            {[1, 2].map(i => (
              <div key={i}>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(categories).map(([category, items]) => (
              <section key={category} className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <h2 className="text-2xl font-semibold capitalize font-display text-foreground/90">{category}</h2>
                  <span className="text-muted-foreground text-sm font-medium bg-secondary px-3 py-1 rounded-full">
                    {items.length} 
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {items.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
            
            {Object.keys(categories).length === 0 && (
               <div className="text-center py-20 text-muted-foreground bg-card rounded-2xl">
                 Kategoriyalar topilmadi
               </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
