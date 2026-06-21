import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Heart, LogOut, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Feed } from "@/components/Feed";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyPosts } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile · Connectly" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const myQuery = useQuery({
    queryKey: ["my-posts", user?.id],
    queryFn: () => fetchMyPosts(user!.id),
    enabled: !!user,
  });

  const myPosts = myQuery.data ?? [];
  const totalLikes = myPosts.reduce((s, p) => s + p.liked_by.length, 0);
  const name = profile?.name || profile?.username || "Member";

  const handleLogout = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="space-y-4">
      <section className="card-soft flex flex-col items-center gap-3 p-6 text-center">
        <UserAvatar name={name} src={profile?.avatar} seed={user?.id} size={88} />
        <div>
          <h1 className="font-display text-xl font-extrabold">{name}</h1>
          <p className="text-sm text-muted-foreground">@{profile?.username}</p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" /> {profile?.email}
        </p>

        <div className="grid w-full grid-cols-3 gap-3 pt-2">
          <Stat icon={FileText} label="Posts" value={myPosts.length} />
          <Stat icon={Heart} label="Likes" value={totalLikes} />
          <Stat
            icon={MessageCircle}
            label="Comments"
            value={myPosts.reduce((s, p) => s + p.comments.length, 0)}
          />
        </div>

        <Button
          variant="outline"
          className="mt-2 w-full rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </section>

      <h2 className="px-1 pt-2 font-display text-base font-bold">My Posts</h2>
      <Feed
        posts={myPosts}
        isLoading={myQuery.isLoading}
        emptyTitle="No posts yet"
        emptyDescription="Your shared posts will appear here."
      />
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Heart;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-secondary py-3">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 font-display text-lg font-extrabold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
