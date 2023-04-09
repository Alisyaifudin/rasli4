import React from "react";

interface ShowProps {
  when: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function Show({ when, children, fallback }: ShowProps) {
  return when ? <>{children}</> : <>{fallback}</>;
}

export default Show;
