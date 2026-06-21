import { supabase } from "@/integrations/supabase/client";
import type { Comment, Post, Profile } from "@/lib/types";

// The auto-generated Database types do not yet include our tables, so we use a
// loosely typed handle for these queries.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function mapPost(row: any, profileMap: Map<string, Profile>): Post {
  return {
    id: row.id,
    user_id: row.user_id,
    text: row.text ?? "",
    image: row.image ?? null,
    liked_by: row.liked_by ?? [],
    comments: (row.comments ?? []) as Comment[],
    created_at: row.created_at,
    author: profileMap.get(row.user_id) ?? null,
  };
}

async function attachAuthors(rows: any[]): Promise<Post[]> {
  if (!rows.length) return [];
  const ids = [...new Set(rows.map((r) => r.user_id))];
  const { data: profiles } = await db
    .from("profiles")
    .select("*")
    .in("id", ids);
  const map = new Map<string, Profile>(
    (profiles ?? []).map((p: Profile) => [p.id, p]),
  );
  return rows.map((r) => mapPost(r, map));
}

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return attachAuthors(data ?? []);
}

export async function fetchMyPosts(userId: string): Promise<Post[]> {
  const { data, error } = await db
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return attachAuthors(data ?? []);
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createPost(input: {
  userId: string;
  text: string;
  image: string | null;
}): Promise<void> {
  const { error } = await db.from("posts").insert({
    user_id: input.userId,
    text: input.text,
    image: input.image,
    liked_by: [],
    comments: [],
  });
  if (error) throw error;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await db.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleLike(
  postId: string,
  userId: string,
  currentLikedBy: string[],
): Promise<string[]> {
  const liked = currentLikedBy.includes(userId);
  const next = liked
    ? currentLikedBy.filter((id) => id !== userId)
    : [...currentLikedBy, userId];
  const { error } = await db
    .from("posts")
    .update({ liked_by: next })
    .eq("id", postId);
  if (error) throw error;
  return next;
}

export async function addComment(
  postId: string,
  currentComments: Comment[],
  comment: Comment,
): Promise<Comment[]> {
  const next = [...currentComments, comment];
  const { error } = await db
    .from("posts")
    .update({ comments: next })
    .eq("id", postId);
  if (error) throw error;
  return next;
}

export async function fetchLikers(userIds: string[]): Promise<Profile[]> {
  if (!userIds.length) return [];
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .in("id", userIds);
  if (error) throw error;
  return data ?? [];
}
