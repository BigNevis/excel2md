import React from 'react';

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-lg font-bold ${className}`}>{children}</h2>;
}
