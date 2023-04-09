import React from "react";

interface ForProps<T> {
  each: readonly T[];
  fallback?: React.ReactNode;
  children: (item: T, index: number) => React.ReactNode;
}

function For<T>({
  each,
  fallback,
  children,
}: ForProps<T>): React.ReactElement | null {
  if (!each || each.length === 0) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{each.map((item, index) => children(item, index))}</>;
}

export default For;
