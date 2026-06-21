import { Inbox } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { PostSkeleton } from "@/components/PostSkeleton";
import { EmptyState } from "@/components/EmptyState";
import type { Post } from "@/lib/types";

interface Props {
  posts: Post[] | undefined;
  isLoading: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function Feed({ posts, isLoading, emptyTitle, emptyDescription }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle ?? "Nothing here yet"}
        description={emptyDescription ?? "Posts will show up here once shared."}
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
