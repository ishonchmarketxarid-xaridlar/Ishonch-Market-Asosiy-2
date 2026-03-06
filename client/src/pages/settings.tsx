import { useLanguage } from "@/lib/i18n";
import { useAdminStats } from "@/hooks/use-admin";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, BarChart3, TrendingUp, Package, ShoppingBag, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { lang, setLang, t } = useLanguage();
  const { data: stats, isLoading } = useAdminStats();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleAdminAccess = () => {
    if (password === "9billionaire$$$$$") {
      setLocation("/admin");
    } else {
      toast({
        variant: "destructive",
        title: "Xato",
        description: "Noto'g'ri parol",
      });
      setPassword("");
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8 animate-in fade-in">
        <h1 className="text-3xl font-black font-display text-primary">Ishonch Market</h1>
        
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Til sozlamalari</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={lang === 'uz' ? 'default' : 'outline'}
              className="h-14 rounded-2xl text-lg font-bold"
              onClick={() => setLang('uz')}
            >
              O'zbek tili 🇺🇿
            </Button>
            <Button
              variant={lang === 'ru' ? 'default' : 'outline'}
              className="h-14 rounded-2xl text-lg font-bold"
              onClick={() => setLang('ru')}
            >
              Русский язык 🇷🇺
            </Button>
          </div>
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Mening statistikam</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-24 rounded-2xl w-full" />
              <Skeleton className="h-24 rounded-2xl w-full" />
              <Skeleton className="h-24 rounded-2xl w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-sm font-medium">Jami buyurtmalar</span>
                </div>
                <div className="text-2xl font-black text-foreground">{stats?.totalOrders || 0}</div>
              </Card>
              
              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Jami mahsulotlar</span>
                </div>
                <div className="text-2xl font-black text-foreground">{stats?.totalProducts || 0}</div>
              </Card>

              <Card className="p-4 rounded-2xl border-border/50 shadow-sm flex flex-col justify-center bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Jami tushum</span>
                </div>
                <div className="text-xl font-black text-primary truncate">
                  {new Intl.NumberFormat('uz-UZ').format(stats?.totalRevenue || 0)} UZS
                </div>
              </Card>
            </div>
          )}
        </section>

        <section className="pt-6 border-t border-border">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold font-display">Admin panel</h2>
          </div>
          
          <Card 
            className="p-6 rounded-2xl border-border/50 shadow-sm hover:bg-secondary transition-colors cursor-pointer flex items-center justify-between"
            onClick={() => setShowAdminModal(true)}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Admin panelga kirish</h3>
                <p className="text-sm text-muted-foreground">Mahsulotlar va buyurtmalarni boshqarish</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xl font-bold">→</span>
            </div>
          </Card>
        </section>

        <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black font-display">Admin kirish</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="password"
                placeholder="Admin parolini kiriting"
                className="h-12 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAdminAccess} className="w-full h-12 rounded-xl font-bold text-lg">
                Kirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
