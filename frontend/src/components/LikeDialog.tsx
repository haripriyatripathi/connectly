import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/UserAvatar";
import { fetchLikers } from "@/lib/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userIds: string[];
}

export function LikeDialog({ open, onOpenChange, userIds }: Props) {
  const { data: likers, isLoading } = useQuery({
    queryKey: ["likers", userIds],
    queryFn: () => fetchLikers(userIds),
    enabled: open && userIds.length > 0,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
            Liked by {userIds.length}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-80 space-y-1 overflow-y-auto">
          {isLoading && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          )}
          {(likers ?? []).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-accent/60"
            >
              <UserAvatar name={p.name || p.username} src={p.avatar} seed={p.id} size={40} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {p.name || p.username}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  @{p.username}
                </p>
              </div>
            </div>
          ))}
          {!isLoading && (likers ?? []).length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No likes yet.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
