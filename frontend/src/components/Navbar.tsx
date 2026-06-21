import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { UserAvatar } from "@/components/UserAvatar";

export function Navbar() {
  const { profile, user } = useAuth();
  const name = profile?.name || profile?.username || "You";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[700px] items-center justify-between px-4">
        <Link to="/home" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg font-extrabold">
            C
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Connectly
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <Link to="/profile" aria-label="Profile">
            <UserAvatar
              name={name}
              src={profile?.avatar}
              seed={user?.id}
              size={34}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
