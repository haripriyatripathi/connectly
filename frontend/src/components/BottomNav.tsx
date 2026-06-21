import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/social", label: "Social", icon: LayoutGrid },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[700px] items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-9 w-12 place-items-center rounded-full transition-colors",
                  active && "bg-accent",
                )}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.4 : 2}
                />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
