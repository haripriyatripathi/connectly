import { cn } from "@/lib/utils";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const GRADIENTS = [
  "from-[#1976D2] to-[#42a5f5]",
  "from-[#7e57c2] to-[#b388ff]",
  "from-[#26a69a] to-[#80cbc4]",
  "from-[#ef5350] to-[#ff8a80]",
  "from-[#ffa726] to-[#ffcc80]",
  "from-[#5c6bc0] to-[#9fa8da]",
];

function gradientFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

interface Props {
  name: string;
  src?: string | null;
  seed?: string;
  size?: number;
  className?: string;
}

export function UserAvatar({ name, src, seed, size = 40, className }: Props) {
  const dim = { width: size, height: size, fontSize: size * 0.4 };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        style={dim}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      style={dim}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white",
        gradientFor(seed ?? name),
        className,
      )}
    >
      {initials(name)}
    </div>
  );
}
