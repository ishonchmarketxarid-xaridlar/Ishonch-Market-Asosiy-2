import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { useLanguage } from "@/lib/i18n";
import { ProductCard } from "@/components/product-card";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Smartphone, 
  Laptop, 
  Home, 
  ShoppingBag, 
  Grid, 
  Search, 
  ArrowUpDown,
  ChevronLeft
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryIcons: Record<string, any> = {
  "Elektronika": Smartphone,
  "Telefonlar": Smartphone,
  "Aksessuarlar": ShoppingBag,
  "Uy jihozlari": Home,
  "Kompyuterlar": Laptop,
  "Maishiy texnika": Home,
};

type SortOption = "popular" | "price-asc" | "price-desc";

export default function Categories() {
  const { data: products, isLoading } = useProducts();
  const { t, getLocalized } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = products;
    
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        getLocalized(p, 'title').toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "popular") {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
      }
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, getLocalized]);

  return (
    <Layout>
      <div className="p-4 md:p-0 space-y-8 animate-in fade-in duration-500">
        
        {/* Search Header - matching Home screen style */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search_placeholder')}
            className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm shadow-black/5 text-lg focus-visible:ring-primary/20 transition-all"
            data-testid="input-category-search"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                }}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                data-testid="button-back-to-categories"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h2 className="text-xl font-bold font-display">
              {selectedCategory ? selectedCategory : t('categories')}
            </h2>
          </div>
          {selectedCategory && (
            <div className="flex items-center gap-4">
               <span className="hidden md:inline text-muted-foreground text-sm font-bold bg-secondary px-3 py-1 rounded-full whitespace-nowrap">
                {filteredProducts.length} {t('products_count')}
              </span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[140px] md:w-[180px] h-10 rounded-xl bg-card border-border/50" data-testid="select-sort">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                    <SelectValue placeholder="Saralash" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Ommabop</SelectItem>
                  <SelectItem value="price-asc">Arzonroq</SelectItem>
                  <SelectItem value="price-desc">Qimmatroq</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col space-y-3 bg-card p-4 rounded-2xl">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {!selectedCategory ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {categories.map(category => {
                  const Icon = categoryIcons[category] || Grid;
                  // Find a sample product image for the category
                  const sampleProduct = products?.find(p => p.category === category);
                  return (
                    <Card 
                      key={category}
                      className="group relative aspect-square overflow-hidden rounded-[2rem] border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-pointer bg-card"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`card-category-${category}`}
                    >
                      {sampleProduct?.imageUrl ? (
                        <div className="absolute inset-0">
                          <img 
                            src={sampleProduct.imageUrl} 
                            alt={category}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                           <Icon className="w-16 h-16 text-primary/20" />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] text-white mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="font-black text-xl text-white capitalize font-display drop-shadow-md">{category}</span>
                        <span className="text-white/70 text-sm font-bold mt-1">
                          {products?.filter(p => p.category === category).length} {t('products_count')}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground bg-card rounded-[2xl] border border-dashed border-border/50">
                    Mahsulotlar topilmadi
                  </div>
                )}
              </div>
            )}

            {categories.length === 0 && (
               <div className="text-center py-20 text-muted-foreground bg-card rounded-[2xl] border border-dashed border-border/50">
                 Kategoriyalar topilmadi
               </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
