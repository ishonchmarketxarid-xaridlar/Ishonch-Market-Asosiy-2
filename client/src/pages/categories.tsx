import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Smartphone, Laptop, Home, ShoppingBag, Grid } from "lucide-react";

const categoryIcons: Record<string, any> = {
  "Elektronika": Smartphone,
  "Telefonlar": Smartphone,
  "Aksessuarlar": ShoppingBag,
  "Uy jihozlari": Home,
  "Kompyuterlar": Laptop,
  "Maishiy texnika": Home,
};

export default function Categories() {
  const { data: products, isLoading } = useProducts();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedCategory) return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <Layout>
      <div className="p-4 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black font-display text-primary">{t('categories')}</h1>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl"
            >
              Hammasi
            </button>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-3xl w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Category Cards */}
            {!selectedCategory && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map(category => {
                  const Icon = categoryIcons[category] || Grid;
                  return (
                    <Card 
                      key={category}
                      className="p-6 rounded-[2rem] border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col items-center gap-3 bg-card group"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="p-4 bg-secondary rounded-[1.5rem] text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="font-bold text-center capitalize">{category}</span>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Filtered Products */}
            {selectedCategory && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    {(() => {
                      const Icon = categoryIcons[selectedCategory] || Grid;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-black capitalize font-display">{selectedCategory}</h2>
                  <span className="ml-auto text-muted-foreground text-sm font-bold bg-secondary px-3 py-1 rounded-full">
                    {filteredProducts.length} 
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
            
            {categories.length === 0 && (
               <div className="text-center py-20 text-muted-foreground bg-card rounded-[2rem] border border-dashed">
                 Kategoriyalar topilmadi
               </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
