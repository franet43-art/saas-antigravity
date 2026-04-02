export default function FreelanceCardSkeleton() {
  return (
    <div className="p-4 flex flex-col items-center text-center rounded-xl bg-card border h-full animate-pulse">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-muted mb-3" />
      {/* Name */}
      <div className="h-4 w-24 bg-muted rounded mb-2" />
      {/* Category badge */}
      <div className="h-3 w-20 bg-muted rounded-full mb-auto" />
      {/* Rate */}
      <div className="h-3 w-16 bg-muted rounded mt-4 mb-3" />
      {/* Button */}
      <div className="h-8 w-full bg-muted rounded-full" />
    </div>
  );
}
