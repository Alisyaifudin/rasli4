import { cn } from "~/utils/cn";

interface SkeletonProps {
  children: React.ReactNode;
  className?: string;
}

function Skeleton({ children, className }: SkeletonProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex h-full w-full animate-pulse flex-col items-center justify-center",
        className
      )}
    >
      {children}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Skeleton;
