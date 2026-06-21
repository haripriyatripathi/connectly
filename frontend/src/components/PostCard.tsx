import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { CommentDialog } from "@/components/CommentDialog";
import { LikeDialog } from "@/components/LikeDialog";
import { useAuth } from "@/hooks/useAuth";
import { deletePost, toggleLike } from "@/lib/api";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);
  const [liked, setLiked] = useState(
    () => !!user && post.liked_by.includes(user.id),
  );
  const [likeCount, setLikeCount] = useState(post.liked_by.length);

  const name = post.author?.name || post.author?.username || "Member";
  const username = post.author?.username || "member";

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(post.id, user!.id, post.liked_by),
    onError: () => {
      // revert optimistic state
      setLiked((v) => !v);
      setLikeCount((c) => (liked ? c + 1 : c - 1));
      toast.error("Couldn't update like");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });

  const handleLike = () => {
    if (!user) return;
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
    likeMutation.mutate();
  };

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(post.id),
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: () => toast.error("Couldn't delete post"),
  });

  const handleShare = async () => {
    const url = window.location.origin + "/social";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Connectly", text: post.text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <article className="card-soft overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-4">
        <UserAvatar name={name} src={post.author?.avatar} seed={post.user_id} size={44} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            @{username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        {user?.id === post.user_id && (
          <button
            aria-label="Delete post"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {post.text && (
        <p className="whitespace-pre-wrap px-4 pt-3 text-[15px] leading-relaxed text-foreground/90">
          {post.text}
        </p>
      )}

      {post.image && (
        <div className="mt-3 px-4">
          <img
            src={post.image}
            alt="Post attachment"
            loading="lazy"
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>
      )}

      <div className="mt-1 flex items-center justify-between px-4 pb-1 pt-2 text-xs text-muted-foreground">
        <button
          className="hover:underline disabled:cursor-default disabled:no-underline"
          onClick={() => likeCount > 0 && setLikesOpen(true)}
          disabled={likeCount === 0}
        >
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </button>
        <button className="hover:underline" onClick={() => setCommentsOpen(true)}>
          {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
        </button>
      </div>

      <div className="mx-4 grid grid-cols-3 border-t border-border">
        <ActionButton
          active={liked}
          onClick={handleLike}
          icon={
            <Heart
              className={cn("h-5 w-5", liked && "fill-destructive text-destructive animate-pop")}
            />
          }
          label="Like"
          activeClass="text-destructive"
        />
        <ActionButton
          onClick={() => setCommentsOpen(true)}
          icon={<MessageCircle className="h-5 w-5" />}
          label="Comment"
        />
        <ActionButton
          onClick={handleShare}
          icon={<Share2 className="h-5 w-5" />}
          label="Share"
        />
      </div>

      <CommentDialog open={commentsOpen} onOpenChange={setCommentsOpen} post={post} />
      <LikeDialog open={likesOpen} onOpenChange={setLikesOpen} userIds={post.liked_by} />
    </article>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active,
  activeClass,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground",
        active && activeClass,
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
