export function PostSkeleton() {
  return (
    <div className="card-soft animate-pulse p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-2.5 w-20 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-4/5 rounded bg-muted" />
      </div>
      <div className="mt-4 h-44 w-full rounded-2xl bg-muted" />
    </div>
  );
}
