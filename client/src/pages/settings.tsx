import { useLanguage } from "@/lib/i18n";
import { useAdminStats } from "@/hooks/use-admin";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, BarChart3, TrendingUp, Package, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  const { lang, setLang, t } = useLanguage();
  const { data: stats, isLoading } = useAdminStats();

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8 animate-in fade-in">
        
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-display">{t('language_settings')}</h2>
          </div>
          
          <Card className="p-6 rounded-2xl border-border/50 shadow-sm">
            <RadioGroup value={lang} onValueChange={(v) => setLang(v as 'uz'|'ru')} className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer" onClick={() => setLang('uz')}>
                <RadioGroupItem value="uz" id="uz" className="w-5 h-5" />
                <Label htmlFor="uz" className="text-lg cursor-pointer flex-1">O'zbek tili 🇺🇿</Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-secondary transition-colors cursor-pointer" onClick={() => setLang('ru')}>
                <RadioGroupItem value="ru" id="ru" className="w-5 h-5" />
                <Label htmlFor="ru" className="text-lg cursor-pointer flex-1">Русский язык 🇷🇺</Label>
              </div>
            </RadioGroup>
          </Card>
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold font-display">{t('admin_stats')}</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-32 rounded-2xl w-full" />
              <Skeleton className="h-32 rounded-2xl w-full" />
              <Skeleton className="h-32 rounded-2xl w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-gradient-to-br from-card to-secondary/30">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">{t('total_orders')}</span>
                </div>
                <div className="text-4xl font-black text-foreground">{stats?.totalOrders || 0}</div>
              </Card>
              
              <Card className="p-6 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-gradient-to-br from-card to-secondary/30">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">{t('total_products')}</span>
                </div>
                <div className="text-4xl font-black text-foreground">{stats?.totalProducts || 0}</div>
              </Card>

              <Card className="p-6 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">{t('total_revenue')}</span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-primary truncate">
                  {new Intl.NumberFormat('uz-UZ').format(stats?.totalRevenue || 0)} <span className="text-lg font-bold">UZS</span>
                </div>
              </Card>
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
}
