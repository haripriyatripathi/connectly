import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Smile, Megaphone, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { compressImage } from "@/lib/image";
import { createPost } from "@/lib/api";
import { toast } from "sonner";

const EMOJIS = ["😀", "😂", "🔥", "❤️", "🎉", "👏", "🚀", "💯", "😍", "🙌"];

export function CreatePost() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const name = profile?.name || profile?.username || "You";

  const mutation = useMutation({
    mutationFn: () =>
      createPost({ userId: user!.id, text: text.trim(), image }),
    onSuccess: () => {
      setText("");
      setImage(null);
      setShowEmoji(false);
      toast.success("Post shared!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: () => toast.error("Couldn't share post"),
  });

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }
    try {
      setImage(await compressImage(file));
    } catch {
      toast.error("Couldn't process image");
    }
  };

  const canPost = (text.trim().length > 0 || !!image) && !mutation.isPending;

  return (
    <div className="card-soft p-4">
      <div className="flex gap-3">
        <UserAvatar name={name} src={profile?.avatar} seed={user?.id} size={44} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows={2}
          maxLength={1000}
          className="min-h-[52px] flex-1 resize-none bg-transparent pt-2 text-[15px] outline-none placeholder:text-muted-foreground"
        />
      </div>

      {image && (
        <div className="relative mt-3 overflow-hidden rounded-2xl border border-border">
          <img src={image} alt="Preview" className="max-h-80 w-full object-cover" />
          <button
            onClick={() => setImage(null)}
            aria-label="Remove image"
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-foreground/60 text-white backdrop-blur transition hover:bg-foreground/80"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {showEmoji && (
        <div className="mt-3 flex flex-wrap gap-1 rounded-2xl bg-secondary p-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => setText((t) => t + e)}
              className="grid h-9 w-9 place-items-center rounded-lg text-xl transition hover:bg-accent"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickImage}
          />
          <ToolButton
            icon={<ImagePlus className="h-5 w-5" />}
            label="Image"
            onClick={() => fileRef.current?.click()}
          />
          <ToolButton
            icon={<Smile className="h-5 w-5" />}
            label="Emoji"
            onClick={() => setShowEmoji((v) => !v)}
          />
          <ToolButton
            icon={<Megaphone className="h-5 w-5" />}
            label="Promote"
            onClick={() => toast("Promote is a demo feature ✨")}
          />
        </div>
        <Button
          className="rounded-full px-6"
          disabled={!canPost}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
          Post
        </Button>
      </div>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
