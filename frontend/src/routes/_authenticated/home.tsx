import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, FileText, Heart, MessageCircle, Sparkles } from "lucide-react";
import { Feed } from "@/components/Feed";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyPosts, fetchPosts } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Home · Connectly" }] }),
  component: HomePage,
});

function HomePage() {
  const { user, profile } = useAuth();
  const name = profile?.name || profile?.username || "there";

  const allQuery = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });
  const myQuery = useQuery({
    queryKey: ["my-posts", user?.id],
    queryFn: () => fetchMyPosts(user!.id),
    enabled: !!user,
  });

  const myPosts = myQuery.data ?? [];
  const totalPosts = myPosts.length;
  const likesReceived = myPosts.reduce((s, p) => s + p.liked_by.length, 0);
  const commentsReceived = myPosts.reduce((s, p) => s + p.comments.length, 0);

  return (
    <div className="space-y-4">
      {/* Welcome card */}
      <section className="card-soft relative overflow-hidden bg-gradient-to-br from-primary to-[oklch(0.62_0.17_250)] p-5 text-primary-foreground">
        <Sparkles className="absolute -right-3 -top-3 h-24 w-24 text-white/10" />
        <p className="text-sm font-medium text-white/80">Welcome back,</p>
        <h1 className="font-display text-2xl font-extrabold text-white">
          {name} 👋
        </h1>
        <p className="mt-1 max-w-xs text-sm text-white/85">
          Share a moment, connect with people, and see what everyone's up to.
        </p>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3">
        <StatCard icon={FileText} label="Posts" value={totalPosts} />
        <StatCard icon={Heart} label="Likes" value={likesReceived} />
        <StatCard icon={MessageCircle} label="Comments" value={commentsReceived} />
      </section>

      {/* CTA */}
      <Link
        to="/social"
        className="card-soft flex items-center justify-between bg-primary px-5 py-4 text-primary-foreground transition-transform active:scale-[0.99]"
      >
        <span className="font-display text-base font-bold">Go to Social Feed</span>
        <ArrowRight className="h-5 w-5" />
      </Link>

      {/* Recent activity / posts preview */}
      <div className="flex items-center justify-between px-1 pt-2">
        <h2 className="font-display text-base font-bold">Recent Activity</h2>
        <Link to="/social" className="text-sm font-semibold text-primary">
          See all
        </Link>
      </div>
      <Feed
        posts={allQuery.data?.slice(0, 3)}
        isLoading={allQuery.isLoading}
        emptyTitle="No activity yet"
        emptyDescription="Head to the social feed and share your first post."
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
}) {
  return (
    <div className="card-soft flex flex-col items-center gap-1 py-4">
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-display text-xl font-extrabold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
