import { Link, useLocation } from "wouter";
import { Home, Grid, ShoppingCart, ShieldCheck, Settings } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/hooks/use-cart";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { t } = useLanguage();
  const cartItemsCount = useCart((state) => state.getItemCount());

  const navItems = [
    { href: "/", icon: Home, label: t('home') },
    { href: "/categories", icon: Grid, label: t('categories') },
    { href: "/cart", icon: ShoppingCart, label: t('cart'), badge: cartItemsCount > 0 ? cartItemsCount : undefined },
    { href: "/settings", icon: Settings, label: t('settings') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header Mobile */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-card/80 backdrop-blur-md border-b border-border shadow-sm px-4 py-3 flex items-center justify-center">
        <h1 className="text-xl font-bold text-primary tracking-tight font-display">Ishonch Market</h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto md:py-8 px-0 sm:px-4 lg:px-8">
        {children}
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 group relative">
                <div className={`
                  p-1.5 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                `}>
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar/Nav Alternative (Simple header for now) */}
      <div className="hidden md:flex fixed top-0 left-0 bottom-0 w-64 bg-card border-r border-border flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary tracking-tight font-display">Ishonch Market</h1>
        </div>
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-foreground hover:bg-secondary'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
