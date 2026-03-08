import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useReviews, useCreateReview } from "@/hooks/use-reviews";
import { useLanguage } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Send, ChevronLeft } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => 
    i < Math.round(rating) ? '⭐' : '☆'
  ).join('');
}

function timeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return "Hozir";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minut oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Kecha";
  return `${days} kun oldin`;
}

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const [reviewForm, setReviewForm] = useState({ userName: '', rating: 5, comment: '' });
  
  const { data: product, isLoading } = useProduct(id);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
  const createReview = useCreateReview(id);
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

  const handleSubmitReview = () => {
    if (!reviewForm.userName || !reviewForm.comment) {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Iltimos, barcha maydonlarni to'ldiring",
      });
      return;
    }
    createReview.mutate({
      productId: id,
      userName: reviewForm.userName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    }, {
      onSuccess: () => {
        setReviewForm({ userName: '', rating: 5, comment: '' });
      }
    });
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
            
            <div className="text-sm text-muted-foreground mb-4">
              {renderStars(product.ratingAverage ? parseFloat(product.ratingAverage.toString()) : 0)} ({product.ratingCount})
            </div>
            
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

        {/* Reviews Section */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-black font-display">Sharxlar</h2>

          {/* Add Review Form */}
          <Card className="p-6 rounded-2xl border-border/50 shadow-sm space-y-4 bg-card">
            <h3 className="text-lg font-bold">Sharh qo'shish</h3>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Ismingiz</label>
              <Input
                placeholder="Ismingizni kiriting"
                className="h-10 rounded-xl"
                value={reviewForm.userName}
                onChange={(e) => setReviewForm({...reviewForm, userName: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Reyting</label>
              <select 
                className="w-full h-10 px-3 rounded-xl border border-border/50 bg-background"
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 stars)</option>
                <option value={4}>⭐⭐⭐⭐☆ (4 stars)</option>
                <option value={3}>⭐⭐⭐☆☆ (3 stars)</option>
                <option value={2}>⭐⭐☆☆☆ (2 stars)</option>
                <option value={1}>⭐☆☆☆☆ (1 star)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Sharh</label>
              <Textarea
                placeholder="Mahsulot haqida fikringizni yozing..."
                className="rounded-xl min-h-24"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
              />
            </div>

            <Button 
              className="w-full h-11 rounded-xl font-bold"
              onClick={handleSubmitReview}
              disabled={createReview.isPending}
            >
              {createReview.isPending ? "Yuborilmoqda..." : "Sharh qo'shish"}
            </Button>
          </Card>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <>
                <Skeleton className="h-32 rounded-2xl w-full" />
                <Skeleton className="h-32 rounded-2xl w-full" />
              </>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id} className="p-6 rounded-2xl border-border/50 shadow-sm bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-foreground">{review.userName}</h4>
                      <p className="text-sm text-muted-foreground">{renderStars(review.rating)}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{timeAgo(review.createdAt)}</span>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed">
                Hali sharx yo'q
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
