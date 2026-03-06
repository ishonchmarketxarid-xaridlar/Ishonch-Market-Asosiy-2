import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function Confirmation() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl font-black font-display mb-4 tracking-tight">Muvaqqiyatli!</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-md leading-relaxed">
          {t('success_message')}
        </p>

        <Link href="/">
          <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-lg shadow-primary/20">
            {t('back_home')}
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
