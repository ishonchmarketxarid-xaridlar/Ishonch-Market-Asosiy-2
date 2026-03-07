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
      <div className="p-4 space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                data-testid="button-back-to-categories"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-black font-display text-primary">
              {selectedCategory ? selectedCategory : t('categories')}
            </h1>
          </div>
          {selectedCategory && (
            <span className="text-muted-foreground text-sm font-bold bg-secondary px-3 py-1 rounded-full whitespace-nowrap">
              {filteredProducts.length} {t('products_count') || 'mahsulot'}
            </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map(category => {
                  const Icon = categoryIcons[category] || Grid;
                  return (
                    <Card 
                      key={category}
                      className="p-6 rounded-[2rem] border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col items-center gap-3 bg-card group"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`card-category-${category}`}
                    >
                      <div className="p-4 bg-secondary rounded-[1.5rem] text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="w-8 h-8" />
                      </div>
                      <span className="font-bold text-center capitalize">{category}</span>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('search_placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20"
                      data-testid="input-category-search"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-full md:w-[180px] h-11 rounded-xl bg-card border-border/50" data-testid="select-sort">
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
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground bg-card rounded-[2rem] border border-dashed border-border/50">
                    Mahsulotlar topilmadi
                  </div>
                )}
              </div>
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
