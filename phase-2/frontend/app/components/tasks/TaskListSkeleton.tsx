export default function TaskListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-border bg-card animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1 w-5 h-5 rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 bg-muted rounded w-16" />
                <div className="h-6 bg-muted rounded w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


