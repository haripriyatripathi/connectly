import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: Props) {
  return (
    <div className="card-soft flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-base font-bold">{title}</h3>
      {description && (
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
