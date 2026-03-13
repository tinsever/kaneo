import { useNavigate } from "@tanstack/react-router";
import { usePrimaryNavigationItems } from "@/components/primary-navigation";
import { cn } from "@/lib/cn";

export function MobileBottomNav() {
  const navigate = useNavigate();
  const navItems = usePrimaryNavigationItems();

  if (!navItems.length) {
    return null;
  }

  return (
    <nav className="pointer-events-none fixed inset-x-2 bottom-2 z-30 md:hidden">
      <div className="pointer-events-auto grid auto-cols-fr grid-flow-col rounded-2xl border border-border/80 bg-background/95 p-1 shadow-lg shadow-black/5 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {navItems.map((item) => (
          <button
            key={item.title}
            type="button"
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-medium transition-colors",
              item.isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground",
            )}
            onClick={() => navigate({ to: item.url })}
          >
            <span className="relative">
              <item.icon className="size-4.5" />
              {item.badge !== null && (
                <span className="-top-1.5 -right-2 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[9px] leading-none text-background">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </span>
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
