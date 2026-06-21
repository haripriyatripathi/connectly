export interface Profile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  created_at: string;
}

export interface Comment {
  user: string;
  username: string;
  avatar?: string | null;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  user_id: string;
  text: string;
  image: string | null;
  liked_by: string[];
  comments: Comment[];
  created_at: string;
  author?: Profile | null;
}
