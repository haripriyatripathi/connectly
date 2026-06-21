import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { addComment } from "@/lib/api";
import type { Comment, Post } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export function CommentDialog({ open, onOpenChange, post }: Props) {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user || !profile) throw new Error("Not signed in");
      const comment: Comment = {
        user: user.id,
        username: profile.username,
        avatar: profile.avatar,
        text: text.trim(),
        createdAt: new Date().toISOString(),
      };
      return addComment(post.id, post.comments, comment);
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: () => toast.error("Couldn't post comment"),
  });

  const submit = () => {
    if (!text.trim()) return;
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] max-w-md flex-col gap-0 rounded-3xl p-0">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="font-display">
            Comments · {post.comments.length}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {post.comments.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No comments yet. Be the first!
            </p>
          )}
          {post.comments.map((c, i) => (
            <div key={i} className="flex gap-3">
              <UserAvatar name={c.username} src={c.avatar} seed={c.user} size={36} />
              <div className="min-w-0 flex-1">
                <div className="rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5">
                  <p className="text-sm font-semibold">@{c.username}</p>
                  <p className="text-sm text-foreground/90">{c.text}</p>
                </div>
                <p className="mt-1 pl-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-border px-4 py-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Add a comment…"
            maxLength={500}
            className="h-11 flex-1 rounded-full border border-input bg-secondary px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            size="icon"
            className="h-11 w-11 shrink-0 rounded-full"
            onClick={submit}
            disabled={!text.trim() || mutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
