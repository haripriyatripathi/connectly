import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/home" });
  },
  head: () => ({
    meta: [
      { title: "Sign in · Connectly" },
      { name: "description", content: "Join Connectly to share posts and connect." },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/home", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signupSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name: parsed.data.name, username: parsed.data.username },
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome aboard 🎉");
        navigate({ to: "/home", replace: true });
      } else {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
          toast.error(parsed.error.issues[0].message);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        navigate({ to: "/home", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home", replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-accent/60 to-background px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-2">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground font-display shadow-soft">
          C
        </span>
        <h1 className="font-display text-2xl font-extrabold">Connectly</h1>
        <p className="text-sm text-muted-foreground">Share moments. Build your circle.</p>
      </div>

      <div className="card-soft w-full max-w-sm p-6">
        <div className="mb-5 flex gap-1 rounded-full bg-secondary p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors",
                mode === m ? "bg-card text-primary shadow-soft" : "text-muted-foreground",
              )}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "signup" && (
            <>
              <Field label="Name" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
              <Field
                label="Username"
                value={form.username}
                onChange={set("username")}
                placeholder="janedoe"
              />
            </>
          )}
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="••••••••"
          />

          <Button type="submit" className="mt-2 w-full rounded-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Login" : "Create account"}
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full"
          onClick={handleGoogle}
        >
          <GoogleIcon /> Continue with Google
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="h-11 w-full rounded-xl border border-input bg-secondary/60 px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 5.1 29.4 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 5.1 29.4 3 24 3 16.3 3 9.7 7.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34 26.7 35 24 35c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.6 38.6 16.2 43 24 43z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.3C41.8 35.6 44 30.2 44 23c0-1.3-.1-2.5-.4-3.5z" />
    </svg>
  );
}
