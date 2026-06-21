import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreatePost } from "@/components/CreatePost";
import { Feed } from "@/components/Feed";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyPosts, fetchPosts } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/social")({
  component: SocialPage,
});

function SocialPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"all" | "mine">("all");

  const allQuery = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const myQuery = useQuery({
    queryKey: ["my-posts", user?.id],
    queryFn: () => fetchMyPosts(user!.id),
    enabled: !!user && tab === "mine",
  });

  const showing = tab === "all" ? allQuery : myQuery;

  return (
    <div className="space-y-4">
      <CreatePost />

      <div className="flex gap-1 rounded-full bg-secondary p-1">
        {(["all", "mine"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
              tab === t
                ? "bg-card text-primary shadow-soft"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "all" ? "All Posts" : "My Posts"}
          </button>
        ))}
      </div>

      <Feed
        posts={showing.data}
        isLoading={showing.isLoading}
        emptyTitle={tab === "all" ? "No posts yet" : "You haven't posted yet"}
        emptyDescription={
          tab === "all"
            ? "Be the first to share something with the community."
            : "Share your first post using the box above."
        }
      />
    </div>
  );
}
